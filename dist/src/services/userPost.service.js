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
const prisma_1 = __importDefault(require("../../prisma"));
class _UserPostService {
    getAllUserPostByUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.userPost.findMany({
                where: query,
                include: {
                    comments: {
                        select: {
                            body: true,
                            createdAt: true,
                            updatedAt: true,
                            author: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    profileImage: true,
                                    email: true,
                                    username: true,
                                    role: true,
                                },
                            },
                        },
                    },
                    likedBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true,
                            username: true,
                            role: true,
                        },
                    },
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true,
                            username: true,
                            role: true,
                        },
                    },
                },
            });
        });
    }
    getOneUserPost(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.userPost.findUnique({
                where: query,
                include: {
                    comments: true,
                    likedBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true,
                            username: true,
                        },
                    },
                },
            });
        });
    }
    updateOneUserPost(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.userPost.update({ where: query, data: data });
        });
    }
    createOneUserPost(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, authorId, title, type, image, isPrivate } = dataValues;
            return yield prisma_1.default.userPost.create({
                data: { body, authorId, title, type, image, isPrivate },
                include: {
                    likedBy: true,
                    comments: true,
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true,
                            username: true,
                            role: true,
                        },
                    },
                },
            });
        });
    }
    createOneComment(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, authorId, userPostId } = dataValues;
            return yield prisma_1.default.postComment.create({
                data: { body, authorId, userPostId },
                include: {
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true,
                            username: true,
                            role: true,
                        },
                    },
                },
            });
        });
    }
    delete(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.postComment.deleteMany({ where: { userPostId: postId } });
            return yield prisma_1.default.userPost.delete({ where: { id: postId } });
        });
    }
}
exports.UserPostService = new _UserPostService();
