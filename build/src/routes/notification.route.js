"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const notificationRoutes = express_1.default.Router();
// -----------  GET ----------------
notificationRoutes.get("/getAllForUser", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), notification_controller_1.NotificationController.getAllNotificationByUser);
// -----------  POST ----------------
notificationRoutes.post("/sendNotification", notification_controller_1.NotificationController.sendNotification);
notificationRoutes.post("/markAllAsRead", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), notification_controller_1.NotificationController.markAllAsRead);
exports.default = notificationRoutes;
