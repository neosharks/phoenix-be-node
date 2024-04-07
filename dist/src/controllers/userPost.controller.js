"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPostController = void 0;
const jimp_1 = __importDefault(require("jimp"));
const userPost_service_1 = require("../services/userPost.service");
const user_service_1 = require("../services/user.service");
const patronCreator_service_1 = require("../services/patronCreator.service");
const prisma_1 = __importDefault(require("../../prisma"));
const logger_core_1 = __importDefault(require("../core/logger.core"));
const api_constant_1 = require("../constant/api.constant");
const s3upload_core_1 = require("../core/s3upload.core");
class _UserPostController {
    getAllUserPostByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { author } = req.query;
                if (!author)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundUser = yield user_service_1.UserService.getOneUser({ username: author });
                if (!foundUser)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                const found = yield userPost_service_1.UserPostService.getAllUserPostByUser({
                    authorId: foundUser.id,
                    isPrivate: true,
                });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                return res.status(200).send({ message: "success", data: found });
            }
            catch (error) {
                logger_core_1.default.error("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllPostForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = res.locals.user;
                let returnPosts = [];
                const foundPatronCreator = yield patronCreator_service_1.PatronCreatorService.getAll({ patronId: id });
                for (let i = 0; i < foundPatronCreator.length; i++) {
                    const ele = foundPatronCreator[i];
                    const allPostsByUser = yield userPost_service_1.UserPostService.getAllUserPostByUser({
                        authorId: ele.creatorId,
                    });
                    returnPosts = [...returnPosts, ...allPostsByUser];
                }
                const allUserPosts = yield userPost_service_1.UserPostService.getAllUserPostByUser({ authorId: id });
                returnPosts = [...returnPosts, ...allUserPosts];
                if (returnPosts.length === 0)
                    return res.status(200).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                returnPosts = returnPosts.sort(function (a, b) {
                    return b.updatedAt - a.updatedAt;
                });
                if (returnPosts.length > 0) {
                    returnPosts = yield Promise.all(returnPosts.map((ele) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        if (((_a = ele === null || ele === void 0 ? void 0 : ele.image) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            const response = yield (0, s3upload_core_1.getObjectSignedUrl)(ele.image);
                            ele.image = response;
                        }
                        return ele;
                    })));
                }
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, data: returnPosts });
            }
            catch (error) {
                logger_core_1.default.error("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getOneUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                if (!id)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const found = yield userPost_service_1.UserPostService.getOneUserPost({ id });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                return res.status(201).send({ message: api_constant_1.successMessages.SUCCESS, data: found });
            }
            catch (error) {
                logger_core_1.default.error("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    likePostToggle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                const { id } = res.locals.user;
                if (!postId)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundPost = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
                if (!foundPost)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                const userIndex = foundPost.likedBy.findIndex((user) => user.id === id);
                if (userIndex === -1) {
                    yield prisma_1.default.userPost.update({
                        where: { id: postId },
                        data: { likedBy: { connect: { id: id } } },
                    });
                }
                else {
                    yield prisma_1.default.userPost.update({
                        where: { id: postId },
                        data: { likedBy: { disconnect: { id: id } } },
                    });
                }
                res.status(201).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                logger_core_1.default.error("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, updates } = req.body;
                if (!postId)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundPost = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
                if (!foundPost)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                yield userPost_service_1.UserPostService.updateOneUserPost({ id: postId }, updates);
                res.status(201).send({ message: api_constant_1.successMessages.UPDATED });
            }
            catch (error) {
                logger_core_1.default.error("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                if (!postId)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundPost = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
                if (!foundPost)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                yield userPost_service_1.UserPostService.delete(postId);
                res.status(201).send({ message: api_constant_1.successMessages.SUCCESS });
            }
            catch (error) {
                logger_core_1.default.error("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    createOneUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, title, isPrivate } = req.body;
                const image = req.file;
                const { id } = res.locals.user;
                if (!body || !id)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                let imageName;
                if (image) {
                    imageName = (0, s3upload_core_1.generateFileName)();
                    const jimpImage = yield jimp_1.default.read(image.buffer);
                    const buffer = yield jimpImage.getBufferAsync(image.mimetype);
                    yield (0, s3upload_core_1.uploadFile)(buffer, imageName, image.mimetype);
                }
                const created = yield userPost_service_1.UserPostService.createOneUserPost({
                    authorId: id,
                    body,
                    type: image ? "IMAGE" : "TEXT",
                    title,
                    image: imageName,
                    isPrivate,
                });
                if (created.image)
                    created.image = yield (0, s3upload_core_1.getObjectSignedUrl)(created.image);
                res.status(201).send({ message: api_constant_1.successMessages.CREATED, data: created });
            }
            catch (error) {
                logger_core_1.default.error("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    commentOnPostByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, authorId, userPostId } = req.body;
                if (!body || !authorId || !userPostId)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const created = yield userPost_service_1.UserPostService.createOneComment({ body, authorId, userPostId });
                res.status(201).send({ message: api_constant_1.successMessages.SUCCESS, data: created });
            }
            catch (error) {
                logger_core_1.default.error("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
}
exports.UserPostController = new _UserPostController();
