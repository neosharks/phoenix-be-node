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
exports.NotificationService = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const api_constant_1 = require("../constant/api.constant");
const logger_core_1 = __importDefault(require("../core/logger.core"));
class _NotificationService {
    getAllNotificationOfUser(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, skip = 0, take = 10) {
            try {
                return yield notification_model_1.default.findAll({
                    where: query,
                    include: [
                        {
                            model: user_model_1.default,
                            as: "aboutUser",
                            attributes: ["profileImage", "firstName", "lastName", "username"],
                        },
                    ],
                    offset: skip,
                    limit: take,
                });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                throw new Error(api_constant_1.errorMessage.DB_ISSUE);
            }
        });
    }
    createOneNotification(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { aboutUserId, notifiedUserId, message, link, type } = dataValues;
                return yield notification_model_1.default.create({
                    aboutUserId,
                    notifiedUserId,
                    message,
                    read: false,
                    link,
                    type,
                });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                throw new Error(api_constant_1.errorMessage.DB_ISSUE);
            }
        });
    }
    markAllAsRead(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = dataValues;
                return yield notification_model_1.default.update({ read: true }, {
                    where: {
                        notifiedUserId: id,
                    },
                });
            }
            catch (error) {
                logger_core_1.default.error("ERROR: ", error);
                throw new Error(api_constant_1.errorMessage.DB_ISSUE);
            }
        });
    }
}
exports.NotificationService = new _NotificationService();
