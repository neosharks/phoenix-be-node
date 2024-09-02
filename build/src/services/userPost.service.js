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
exports.UserPostService = void 0;
const userPost_model_1 = __importDefault(require("../models/userPost.model"));
const postComment_model_1 = __importDefault(require("../models/postComment.model"));
const poll_model_1 = __importDefault(require("../models/poll.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const package_model_1 = __importDefault(require("../models/package.model"));
const class_model_1 = __importDefault(require("../models/class.model"));
class _UserPostService {
    getAllUserPostByUser(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, skip = 0, take = 10) {
            try {
                return yield userPost_model_1.default.findAll({
                    where: query,
                    include: [
                        { model: poll_model_1.default },
                        { model: package_model_1.default },
                        { model: class_model_1.default },
                        {
                            model: postComment_model_1.default,
                            as: "comments",
                            attributes: ["description", "createdAt", "updatedAt"],
                            include: {
                                model: user_model_1.default,
                                as: "author",
                                attributes: [
                                    "id",
                                    "firstName",
                                    "lastName",
                                    "profileImage",
                                    "email",
                                    "username",
                                    "role",
                                ],
                            },
                        },
                        {
                            model: user_model_1.default,
                            as: "likedBy",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "profileImage",
                                "email",
                                "username",
                                "role",
                            ],
                        },
                        {
                            model: user_model_1.default,
                            as: "author",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "profileImage",
                                "email",
                                "username",
                                "role",
                            ],
                        },
                    ],
                    offset: skip,
                    limit: take,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOneUserPost(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userPost_model_1.default.findOne({
                    where: query,
                    include: [
                        {
                            model: postComment_model_1.default,
                            as: "comments",
                            include: {
                                model: user_model_1.default,
                                as: "author",
                            },
                        },
                        {
                            model: user_model_1.default,
                            as: "author",
                        },
                        {
                            model: user_model_1.default,
                            as: "likedBy",
                            attributes: ["id", "firstName", "lastName", "profileImage", "email", "username"],
                        },
                    ],
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateOneUserPost(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userPost_model_1.default.update(data, { where: query });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createOneUserPost(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { description, authorId, title, type, image, visibility, allowComments, videoUrl, document, pollId, packages, } = dataValues;
                const createdPost = yield userPost_model_1.default.create({
                    description,
                    authorId,
                    title,
                    type,
                    image,
                    visibility,
                    allowComments,
                    videoUrl,
                    document,
                    pollId,
                });
                if (Array.isArray(packages)) {
                    yield createdPost.setPackages(packages);
                }
                return yield userPost_model_1.default.findOne({
                    where: { id: createdPost.id },
                    include: [
                        {
                            model: user_model_1.default,
                            as: "likedBy",
                        },
                        {
                            model: postComment_model_1.default,
                            as: "comments",
                        },
                        {
                            model: user_model_1.default,
                            as: "author",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "profileImage",
                                "email",
                                "username",
                                "role",
                            ],
                        },
                    ],
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createOneComment(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { description, authorId, userPostId } = dataValues;
                return yield postComment_model_1.default.create({
                    description,
                    authorId,
                    userPostId,
                    include: [
                        {
                            model: user_model_1.default,
                            as: "author",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "profileImage",
                                "email",
                                "username",
                                "role",
                            ],
                        },
                    ],
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createPoll(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield poll_model_1.default.create(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOnePoll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield poll_model_1.default.findOne({
                    where: query,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateOnePoll(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield poll_model_1.default.update(data, { where: query });
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield postComment_model_1.default.destroy({ where: { userPostId: postId } });
                return yield userPost_model_1.default.destroy({ where: { id: postId } });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserPostService = new _UserPostService();
