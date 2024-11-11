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
exports.ClassService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const commonObjects_lib_1 = require("../lib/commonObjects.lib");
class _ClassService {
    getOneClassByProps(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.class.findUnique({
                    where: query,
                    include: {
                        ClassParticipants: true,
                        creator: {
                            select: commonObjects_lib_1.userCommonObject,
                        },
                    },
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllClassesByCreatorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.class.findMany({
                    where: { creatorId: parseInt(id) },
                    include: {
                        ClassParticipants: true,
                        creator: {
                            select: commonObjects_lib_1.userCommonObject,
                        },
                    },
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllClassesByProps(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.class.findMany({
                    where: props,
                    include: {
                        ClassParticipants: true,
                        creator: {
                            select: commonObjects_lib_1.userCommonObject,
                        },
                    },
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    createClass(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.class.create({
                    data: data,
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addClassParticipant(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.classParticipants.create({
                    data: data,
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addMultipleParticipants(participantsData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.classParticipants.createMany({
                    data: participantsData,
                    skipDuplicates: true,
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    updateClassByProps(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.class.update({
                    where: query,
                    data: data,
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllParticipantOfClass(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.classParticipants.findMany({
                    where: { classId: id },
                    include: {
                        user: {
                            select: commonObjects_lib_1.userCommonObject,
                        },
                    },
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getOneMessageByProps(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.classMessage.findFirst({
                    where: props,
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    deleteOneMessageByProps(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.classMessage.delete({
                    where: props,
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addMessage(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(dataValues);
            try {
                const { classId, userId, message, image, isPinned, audio, video, document } = dataValues;
                return yield prisma_1.default.classMessage.create({
                    data: {
                        classId,
                        userId,
                        message,
                        isPinned,
                        image,
                        video,
                        audio,
                        document,
                    },
                });
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    getAllMessagesOfClass(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.classMessage.findMany({
                    where: { classId: id },
                    include: {
                        repliedMessage: {
                            include: {
                                user: {
                                    select: commonObjects_lib_1.userCommonObject,
                                },
                            },
                        },
                        user: {
                            select: commonObjects_lib_1.userCommonObject,
                        },
                    },
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updateMessage(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.messageId)
                delete data.messageId;
            try {
                return yield prisma_1.default.classMessage.update({ where: query, data: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAvailableParticipants(classId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classData = yield prisma_1.default.class.findUnique({
                    where: {
                        id: classId,
                    },
                    select: {
                        creatorId: true,
                    },
                });
                if (!classData) {
                    throw new Error("Class not found");
                }
                const creatorId = classData.creatorId;
                const allUsers = yield prisma_1.default.user.findMany({
                    select: commonObjects_lib_1.userCommonObject,
                });
                const participants = yield prisma_1.default.classParticipants.findMany({
                    where: { classId },
                    select: { userId: true },
                });
                const participantIds = participants.map((p) => p.userId);
                const availableParticipants = allUsers.filter((user) => user.id !== creatorId && !participantIds.includes(user.id));
                return availableParticipants;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAllClassesForUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdClasses = yield prisma_1.default.class.findMany({
                    where: { creatorId: id },
                    include: {
                        ClassParticipants: true,
                        creator: {
                            select: commonObjects_lib_1.userCommonObject,
                        },
                    },
                });
                const participatedClasses = yield prisma_1.default.class.findMany({
                    where: {
                        ClassParticipants: {
                            some: {
                                userId: id,
                            },
                        },
                    },
                    include: {
                        ClassParticipants: true,
                        creator: {
                            select: commonObjects_lib_1.userCommonObject,
                        },
                    },
                });
                return { createdClasses, participatedClasses };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    leaveClass(classId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classParticipant = yield prisma_1.default.classParticipants.findFirst({
                    where: {
                        classId: classId,
                        userId: userId,
                    },
                });
                if (!classParticipant) {
                    return false;
                }
                yield prisma_1.default.classParticipants.delete({
                    where: {
                        id: classParticipant.id,
                    },
                });
                return true;
            }
            catch (error) {
                console.error("Error while leaving the class:", error);
                return false;
            }
        });
    }
    createClassRequest(userId, creatorId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingRequest = yield prisma_1.default.classRequest.findFirst({
                where: {
                    userId,
                    creatorId,
                },
            });
            if (existingRequest) {
                return null;
            }
            return yield prisma_1.default.classRequest.create({
                data: {
                    userId,
                    creatorId,
                    message,
                },
            });
        });
    }
}
exports.ClassService = new _ClassService();
