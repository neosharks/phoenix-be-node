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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const sequelize_1 = require("../models/sequelize");
const api_constant_1 = require("../constant/api.constant");
const { Chat, Message, User } = sequelize_1.db;
class _ChatService {
    getOneChat(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Chat.findOne({
                    where: query,
                    include: [
                        {
                            model: User,
                            as: "participantOne",
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
                            model: User,
                            as: "participantTwo",
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
                console.log(result, "result");
                return result;
            }
            catch (error) {
                console.error("ERROR in getOneChat:", error);
                throw new Error("DB_ISSUE");
            }
        });
    }
    getAllChat(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, skip = 0, take = 10) {
            try {
                return yield Chat.findAll({
                    where: query,
                    include: [
                        {
                            model: User,
                            as: "participantOne",
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
                            model: User,
                            as: "participantTwo",
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
                console.log("ERROR: ", error);
                throw new Error(api_constant_1.errorMessage.DB_ISSUE);
            }
        });
    }
    createOneChat(participants, allowed) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Chat.create({
                    participantOneId: participants[0],
                    participantTwoId: participants[1],
                    pendingAllowed: allowed === "UNLIMITED" ? 10000 : 1,
                });
            }
            catch (error) {
                console.log("ERROR: ", error);
                throw new Error(api_constant_1.errorMessage.DB_ISSUE);
            }
        });
    }
    getOneMessage(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Message.findOne({ where: query });
            }
            catch (error) {
                console.log("ERROR: ", error);
                throw new Error(api_constant_1.errorMessage.DB_ISSUE);
            }
        });
    }
    updateOneChat(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Chat.update(data, { where: query });
            }
            catch (error) {
                console.log("ERROR: ", error);
                throw new Error(api_constant_1.errorMessage.DB_ISSUE);
            }
        });
    }
    getAllMessageForChat(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Message.findAll({ where: query });
            }
            catch (error) {
                console.log("ERROR: ", error);
                throw new Error(api_constant_1.errorMessage.DB_ISSUE);
            }
        });
    }
    createOneMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Message.create(Object.assign({}, data));
            }
            catch (error) {
                console.log("ERROR: ", error);
                throw new Error(api_constant_1.errorMessage.DB_ISSUE);
            }
        });
    }
}
exports.ChatService = new _ChatService();
