import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { NotificationController } from "../controllers/notification.controller";

const notificationRoutes = express.Router();

notificationRoutes.get(
  "/getAllForUser",
  checkRoleAuth(),
  NotificationController.getAllNotificationByUser,
);

notificationRoutes.post("/markAllAsRead", checkRoleAuth(), NotificationController.markAllAsRead);

export default notificationRoutes;
