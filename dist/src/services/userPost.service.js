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
    getAllUserPostByUser(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, skip = 0, take = 10) {
            try {
                return yield prisma_1.default.userPost.findMany({
                    where: query,
                    include: {
                        poll: true,
                        packages: true,
                        class: true,
                        comments: {
                            select: {
                                description: true,
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
                    skip,
                    take,
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
                return yield prisma_1.default.userPost.findUnique({
                    where: query,
                    include: {
                        comments: {
                            include: {
                                author: true,
                            },
                        },
                        author: true,
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateOneUserPost(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.userPost.update({ where: query, data: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createOneUserPost(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { description, authorId, title, type, image, visibility, allowComments, videoUrl, pollId, packages, } = dataValues;
                const packagesToConnect = Array.isArray(packages) ? packages.map((id) => ({ id })) : [];
                return yield prisma_1.default.userPost.create({
                    data: {
                        description,
                        authorId,
                        title,
                        type,
                        image,
                        visibility,
                        allowComments,
                        videoUrl,
                        pollId,
                        packages: { connect: packagesToConnect },
                    },
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    createOneComment(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description, authorId, userPostId } = dataValues;
            try {
                return yield prisma_1.default.postComment.create({
                    data: { description, authorId, userPostId },
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    createPoll(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.poll.create({ data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOnePoll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.poll.findUnique({
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
                return yield prisma_1.default.poll.update({ where: query, data: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.postComment.deleteMany({ where: { userPostId: postId } });
                return yield prisma_1.default.userPost.delete({ where: { id: postId } });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserPostService = new _UserPostService();
