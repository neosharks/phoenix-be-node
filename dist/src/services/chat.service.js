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
exports.ChatService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class _ChatService {
    getOneChat(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.chat.findFirst({
                where: query,
                include: {
                    participantOne: {
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
                    participantTwo: {
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
    getAllChat(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.chat.findMany({
                where: query,
                include: {
                    participantOne: {
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
                    participantTwo: {
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
    createOneChat(participants) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.chat.create({
                data: {
                    participantOneId: participants[0],
                    participantTwoId: participants[1],
                },
            });
        });
    }
    getOneMessage(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.message.findUnique({ where: query });
        });
    }
    getAllMessageForChat(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.message.findMany({
                where: query,
            });
        });
    }
    createOneMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.message.create({
                data: data,
                select: {
                    id: true,
                    chatId: true,
                    message: true,
                    contentType: true,
                    senderId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        });
    }
}
exports.ChatService = new _ChatService();
