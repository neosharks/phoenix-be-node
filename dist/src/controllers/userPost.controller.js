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
class _UserPostController {
    getAllUserPostByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { author } = req.query;
            if (!author)
                return res.status(400).send({ message: "provide author" });
            const foundUser = yield user_service_1.UserService.getOneUser({ username: author });
            if (!foundUser)
                return res.status(400).send({ message: "provide author" });
            const found = yield userPost_service_1.UserPostService.getAllUserPostByUser({ authorId: foundUser.id });
            if (!found)
                return res.status(404).send({ message: "user post cannot be found" });
            return res.status(200).send({ message: "success", data: found });
        });
    }
    getAllPostForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = res.locals.user;
            let returnPosts = [];
            const foundPatronCreator = yield patronCreator_service_1.PatronCreatorService.getAll({ patronId: id });
            if (!foundPatronCreator || foundPatronCreator.length === 0)
                return res.status(200).send({ message: "No Posts found" });
            for (let i = 0; i < foundPatronCreator.length; i++) {
                const ele = foundPatronCreator[i];
                const allPostsByUser = yield userPost_service_1.UserPostService.getAllUserPostByUser({
                    authorId: ele.creatorId,
                });
                returnPosts = [...returnPosts, ...allPostsByUser];
            }
            returnPosts = returnPosts.sort(function (a, b) {
                return a.createdAt - b.createdAt;
            });
            return res.status(200).send({ message: "success", data: returnPosts });
        });
    }
    getOneUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            if (!id)
                return res.status(400).send({ message: "provide id" });
            const found = yield userPost_service_1.UserPostService.getOneUserPost({ id });
            if (!found)
                return res.status(404).send({ message: "User Post not found" });
            return res.status(201).send({ message: "success", data: found });
        });
    }
    likePostToggle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.body;
            const { id } = res.locals.user;
            if (!postId)
                return res.status(400).send({ message: "Incomplete params" });
            const foundPost = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
            if (!foundPost)
                return res.status(400).send({ message: "Post Not found" });
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
            res.status(201).send({ message: "created" });
        });
    }
    createOneUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, authorId } = req.body;
            if (!body || !authorId)
                return res.status(400).send({ message: "Incomplete params" });
            yield userPost_service_1.UserPostService.createOneUserPost(Object.assign({}, req.body));
            res.status(201).send({ message: "created" });
        });
    }
    commentOnPostByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, authorId, userPostId } = req.body;
            if (!body || !authorId || !userPostId)
                return res.status(400).send({ message: "Incomplete params" });
            yield userPost_service_1.UserPostService.createOneComment({ body, authorId, userPostId });
            res.status(201).send({ message: "created" });
        });
    }
}
exports.UserPostController = new _UserPostController();
