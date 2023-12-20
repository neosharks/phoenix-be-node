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
const prisma_1 = __importDefault(require("../../prisma"));
class _NotificationService {
    getAllNotificationOfUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma_1.default.notification.findMany({
                    where: query,
                    include: {
                        aboutUser: {
                            select: {
                                profileImage: true,
                                firstName: true,
                                lastName: true,
                                username: true,
                            },
                        },
                    },
                });
            }
            catch (error) {
                console.error("Error creating notification:", error);
                throw new Error("Failed to create notification");
            }
        });
    }
    createOneNotification(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { aboutUserId, notifiedUserId, message, link, type } = dataValues;
                return prisma_1.default.notification.create({
                    data: { aboutUserId, notifiedUserId, message, read: false, link, type },
                });
            }
            catch (error) {
                console.error("Error creating notification:", error);
                throw new Error("Failed to create notification");
            }
        });
    }
    markAllAsRead(dataValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = dataValues;
                return prisma_1.default.notification.updateMany({
                    where: {
                        notifiedUserId: id,
                    },
                    data: {
                        read: true,
                    },
                });
            }
            catch (error) {
                console.error("Error updating notification:", error);
                throw new Error("Failed to update notification");
            }
        });
    }
}
exports.NotificationService = new _NotificationService();
