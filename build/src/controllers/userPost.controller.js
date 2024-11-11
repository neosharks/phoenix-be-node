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
const userPost_service_1 = require("../services/userPost.service");
const user_service_1 = require("../services/user.service");
const patronCreator_service_1 = require("../services/patronCreator.service");
const prisma_1 = __importDefault(require("../../prisma"));
const api_constant_1 = require("../constant/api.constant");
const helper_lib_1 = require("../lib/helper.lib");
const userPost_validator_1 = require("../validators/userPost.validator");
const notification_service_1 = require("../services/notification.service");
const Moderation_1 = require("../utils/Moderation");
class _UserPostController {
    getAllUserPostByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { author } = req.query;
                const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
                const take = Number(req.query.per_page) || 10;
                if (!author)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundUser = yield user_service_1.UserService.getOneUser({ username: author });
                if (!foundUser)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                let returnPosts = yield userPost_service_1.UserPostService.getAllUserPostByUser({
                    authorId: foundUser.id,
                }, skip, take);
                if (!returnPosts)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, data: returnPosts });
            }
            catch (error) {
                console.log("Error: ", error);
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
                const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
                const take = Number(req.query.per_page) || 10;
                const foundPatronCreator = yield patronCreator_service_1.PatronCreatorService.getAll({ patronId: id }, skip, take);
                for (let i = 0; i < foundPatronCreator.length; i++) {
                    const ele = foundPatronCreator[i];
                    const allPostsByUser = yield userPost_service_1.UserPostService.getAllUserPostByUser({
                        authorId: ele.creatorId,
                    }, skip, take);
                    returnPosts = [...returnPosts, ...allPostsByUser];
                }
                const allUserPosts = yield userPost_service_1.UserPostService.getAllUserPostByUser({ authorId: id }, skip, take);
                returnPosts = [...returnPosts, ...allUserPosts];
                // Remove duplicate posts
                const seenPostIds = new Set();
                returnPosts = returnPosts.filter((post) => {
                    if (seenPostIds.has(post.id)) {
                        return false;
                    }
                    else {
                        seenPostIds.add(post.id);
                        return true;
                    }
                });
                if (returnPosts.length === 0)
                    return res.status(200).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                returnPosts = returnPosts.sort(function (a, b) {
                    return b.updatedAt - a.updatedAt;
                });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, data: returnPosts });
            }
            catch (error) {
                console.log("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getSingleUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                if (!id)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const postId = parseInt(id, 10);
                const found = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
                if (!found)
                    return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                return res.status(201).send({ message: api_constant_1.successMessages.SUCCESS, data: found });
            }
            catch (error) {
                console.log("Error: ", error);
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
                const validation = userPost_validator_1.userPostSchema.validate(req.body);
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                if (!postId) {
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                }
                const foundPost = yield prisma_1.default.userPost.findUnique({
                    where: { id: postId },
                    include: {
                        likedBy: true, // Include likedBy for easy manipulation
                        author: true,
                    },
                });
                if (!foundPost) {
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                }
                const userIndex = foundPost.likedBy.findIndex((user) => user.id === id);
                if (userIndex === -1) {
                    yield prisma_1.default.userPost.update({
                        where: { id: postId },
                        data: { likedBy: { connect: { id: id } } },
                    });
                    yield notification_service_1.NotificationService.createOneNotification({
                        aboutUserId: id,
                        notifiedUserId: foundPost.authorId,
                        message: ` have liked on your post`,
                        link: postId.toString(), // Ensure link is stringified if necessary
                        type: "NEW_LIKE",
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
                console.log("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    voteOnPoll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pollId, selectedId } = req.body;
                const { id } = res.locals.user;
                const validation = userPost_validator_1.userPostSchema.validate(req.body);
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                if (!pollId || !selectedId)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundPoll = yield userPost_service_1.UserPostService.getOnePoll({ id: pollId });
                if (!foundPoll)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                const userIndex = foundPoll.selectedOptions.findIndex((user) => user.userId === id);
                if (userIndex === -1) {
                    yield prisma_1.default.poll.update({
                        where: { id: pollId },
                        data: { selectedOptions: [...foundPoll.selectedOptions, { userId: id, selectedId }] },
                    });
                }
                else {
                    foundPoll.selectedOptions[userIndex].selectedId = selectedId;
                    yield prisma_1.default.poll.update({
                        where: { id: pollId },
                        data: { selectedOptions: [...foundPoll.selectedOptions] },
                    });
                }
                res.status(201).send({ message: api_constant_1.successMessages.CREATED });
            }
            catch (error) {
                console.log("Error: ", error);
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
                const validation = userPost_validator_1.userPostSchema.validate(req.body);
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                if (!postId)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundPost = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
                if (!foundPost)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                if (((updates === null || updates === void 0 ? void 0 : updates.description) && (0, Moderation_1.isTextObjectionable)(updates === null || updates === void 0 ? void 0 : updates.description)) ||
                    ((updates === null || updates === void 0 ? void 0 : updates.title) && (0, Moderation_1.isTextObjectionable)(updates === null || updates === void 0 ? void 0 : updates.title)))
                    return res.status(403).send({ message: api_constant_1.errorMessage.OFFENSIVE_CONTENT });
                yield userPost_service_1.UserPostService.updateOneUserPost({ id: postId }, updates);
                res.status(201).send({ message: "UPDATED" });
            }
            catch (error) {
                console.log("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    createOneUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const { description, type, visibility, videoUrl, document, image, title, packages, combinedCommunityId, } = body;
                const { id } = res.locals.user;
                const payload = { authorId: id };
                if (!description ||
                    !id ||
                    !type ||
                    !visibility ||
                    (type === "IMAGE" && !image) ||
                    (type === "VIDEO" && !videoUrl) ||
                    (type === "DOCUMENT" && !document))
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                if ((0, Moderation_1.isTextObjectionable)(description) || (0, Moderation_1.isTextObjectionable)(title))
                    return res.status(403).send({ message: api_constant_1.errorMessage.OFFENSIVE_CONTENT });
                if (visibility === "PAID_MEMBER" && (!packages || packages.length === 0))
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                if (type === "POLL") {
                    const { options } = req.body;
                    let redefinedOptions = options.map((ele) => {
                        return { id: (0, helper_lib_1.generateRandomAlpaNumberic)(5), optionText: ele };
                    });
                    const response = yield userPost_service_1.UserPostService.createPoll({
                        options: redefinedOptions,
                        selectedOptions: [],
                        authorId: id,
                        description,
                        title,
                    });
                    payload.pollId = response.id;
                }
                const created = yield userPost_service_1.UserPostService.createOneUserPost(Object.assign(Object.assign({}, payload), { description,
                    type,
                    visibility,
                    image,
                    videoUrl,
                    document,
                    title,
                    combinedCommunityId, packages: visibility === "PAID_MEMBER" ? packages : [] }));
                return res.status(201).send({ message: api_constant_1.successMessages.CREATED, data: created });
            }
            catch (error) {
                console.error(error);
                console.log("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    commentOnPostByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { description, authorId, userPostId } = req.body;
                const validation = userPost_validator_1.userPostSchema.validate(req.body);
                if (validation.error)
                    return res.status(400).json({ error: validation.error.details[0].message });
                if ((0, Moderation_1.isTextObjectionable)(description))
                    return res.status(403).send({ message: api_constant_1.errorMessage.OFFENSIVE_CONTENT });
                const { id } = res.locals.user;
                if (!description || !authorId || !userPostId)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const created = yield userPost_service_1.UserPostService.createOneComment({
                    description,
                    authorId,
                    userPostId,
                });
                yield notification_service_1.NotificationService.createOneNotification({
                    aboutUserId: id,
                    notifiedUserId: authorId,
                    message: `${created.firstName + " " + created.lastName} have commented on your post`,
                    link: String(userPostId),
                    type: "NEW_COMMENT",
                });
                res.status(201).send({ message: api_constant_1.successMessages.SUCCESS, data: created });
            }
            catch (error) {
                console.log("Error: ", error);
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
                const { id } = res.locals.user;
                if (!postId)
                    return res.status(400).send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
                const foundPost = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
                if (!foundPost)
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_FOUND });
                if (id !== foundPost.authorId) {
                    return res.status(400).send({ message: api_constant_1.errorMessage.NOT_ALLOWED });
                }
                yield userPost_service_1.UserPostService.delete(postId);
                res.status(201).send({ message: api_constant_1.successMessages.SUCCESS });
            }
            catch (error) {
                console.log("Error: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
                const take = Number(req.query.per_page) || 10;
                const allPosts = yield userPost_service_1.UserPostService.getAllPost(skip, take);
                if (!allPosts || allPosts.length === 0)
                    return res.status(404).send({ message: api_constant_1.errorMessage.POST_NOT_FOUND, data: [] });
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS, data: allPosts });
            }
            catch (error) {
                console.error("Error:", error);
                return res.status(500).send({ message: "Internal server error", error });
            }
        });
    }
}
exports.UserPostController = new _UserPostController();
