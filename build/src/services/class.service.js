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
const classParticipants_model_1 = __importDefault(require("../models/classParticipants.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const class_model_1 = __importDefault(require("../models/class.model"));
const classMessage_model_1 = __importDefault(require("../models/classMessage.model"));
const patronCreator_model_1 = __importDefault(require("../models/patronCreator.model"));
class _ClassService {
    getOneClassByProps(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield class_model_1.default.findOne({
                    where: query,
                    include: [
                        { model: classParticipants_model_1.default },
                        {
                            model: user_model_1.default,
                            as: "creator",
                            attributes: [
                                "firstName",
                                "lastName",
                                "profileImage",
                                "username",
                                "email",
                                "phoneNumber",
                            ],
                        },
                    ],
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAllClassesByProps(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield class_model_1.default.findAll({
                    where: query,
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAllClassesByCreatorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield class_model_1.default.findAll({
                    where: { creatorId: parseInt(id) },
                    include: [
                        {
                            model: classParticipants_model_1.default,
                        },
                        {
                            model: user_model_1.default,
                            as: "creator",
                            attributes: [
                                "firstName",
                                "lastName",
                                "profileImage",
                                "username",
                                "email",
                                "phoneNumber",
                            ],
                        },
                    ],
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
                return yield class_model_1.default.create({ data });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addClassParticipant(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield classParticipants_model_1.default.create({ data });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addMultipleParticipants(participantsData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield classParticipants_model_1.default.bulkCreate(participantsData, { ignoreDuplicates: true });
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
                return yield class_model_1.default.update(data, {
                    where: query,
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAllParticipantOfClass(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield classParticipants_model_1.default.findAll({
                    where: { classId: id },
                    include: [
                        {
                            model: user_model_1.default,
                            attributes: [
                                "firstName",
                                "lastName",
                                "profileImage",
                                "username",
                                "email",
                                "phoneNumber",
                            ],
                        },
                    ],
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAllMessagesOfClass(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield classMessage_model_1.default.findAll({
                    where: { classId: id },
                    include: [
                        {
                            model: classMessage_model_1.default,
                            as: "repliedMessage",
                            include: {
                                model: user_model_1.default,
                                attributes: ["firstName", "lastName", "profileImage", "username"],
                            },
                        },
                        {
                            model: user_model_1.default,
                            attributes: [
                                "firstName",
                                "lastName",
                                "profileImage",
                                "username",
                                "email",
                                "phoneNumber",
                            ],
                        },
                    ],
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updateSendMessage(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield classMessage_model_1.default.update(data, {
                    where: query,
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAvailableParticipants(classId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classData = yield class_model_1.default.findOne({
                    where: { id: classId },
                    attributes: ["creatorId"],
                });
                if (!classData) {
                    throw new Error("Class not found");
                }
                const creatorId = classData.creatorId;
                const allUsers = yield user_model_1.default.findAll({
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profileImage",
                        "username",
                        "email",
                        "phoneNumber",
                    ],
                });
                const participants = yield classParticipants_model_1.default.findAll({
                    where: { classId },
                    attributes: ["userId"],
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
                const createdClasses = yield class_model_1.default.findAll({
                    where: { creatorId: id },
                    include: [
                        { model: classParticipants_model_1.default },
                        {
                            model: user_model_1.default,
                            as: "creator",
                            attributes: [
                                "firstName",
                                "lastName",
                                "profileImage",
                                "username",
                                "email",
                                "phoneNumber",
                            ],
                        },
                    ],
                });
                const participatedClasses = yield class_model_1.default.findAll({
                    where: {
                        "$ClassParticipants.userId$": id,
                    },
                    include: [
                        { model: classParticipants_model_1.default },
                        {
                            model: user_model_1.default,
                            as: "creator",
                            attributes: [
                                "firstName",
                                "lastName",
                                "profileImage",
                                "username",
                                "email",
                                "phoneNumber",
                            ],
                        },
                    ],
                });
                return { createdClasses, participatedClasses };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getPatronCreatorSubscription(userId, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield patronCreator_model_1.default.findOne({
                    where: {
                        patronId: userId,
                        creatorId: creatorId,
                        status: "ACTIVE",
                    },
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.ClassService = new _ClassService();
