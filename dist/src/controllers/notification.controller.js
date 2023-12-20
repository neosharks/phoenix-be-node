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
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
class _NotificationController {
    getAllNotificationByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = res.locals.user;
            const allNotifications = yield notification_service_1.NotificationService.getAllNotificationOfUser({
                notifiedUserId: id,
            });
            return res.status(200).send({ message: "success", data: allNotifications });
        });
    }
    markAllAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = res.locals.user;
            yield notification_service_1.NotificationService.markAllAsRead(id);
            return res.status(200).send({ message: "success" });
        });
    }
}
exports.NotificationController = new _NotificationController();
