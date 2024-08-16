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
const admin = require("firebase-admin");
const notification_service_1 = require("../services/notification.service");
const api_constant_1 = require("../constant/api.constant");
const serviceAccountKey_1 = require("../firebseNotification/serviceAccountKey");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey_1.serviceAccountKey),
});
class _NotificationController {
    sendNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, title, body, data } = req.body;
            const message = {
                notification: {
                    title,
                    body,
                },
                token,
                data: data || {},
            };
            try {
                const response = yield admin.messaging().send(message);
                res.status(200).send(`Notification sent successfully: ${response}`);
            }
            catch (error) {
                res.status(500).send(`Error sending notification: ${error}`);
            }
        });
    }
    getAllNotificationByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = res.locals.user;
                const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
                const take = Number(req.query.per_page) || 10;
                const allNotifications = yield notification_service_1.NotificationService.getAllNotificationOfUser({
                    notifiedUserId: id,
                }, skip, take);
                return res.status(200).send({ message: api_constant_1.successMessages.FETCHED, data: allNotifications });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    markAllAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = res.locals.user;
                yield notification_service_1.NotificationService.markAllAsRead(id);
                return res.status(200).send({ message: api_constant_1.successMessages.SUCCESS });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
}
exports.NotificationController = new _NotificationController();
