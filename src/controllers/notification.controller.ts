import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

class _NotificationController {
  async getAllNotificationByUser(req: Request, res: Response) {
    const { id } = res.locals.user;
    const allNotifications = await NotificationService.getAllNotificationOfUser({
      notifiedUserId: id,
    });
    return res.status(200).send({ message: "success", data: allNotifications });
  }

  async markAllAsRead(req: Request, res: Response) {
    const { id } = res.locals.user;
    await NotificationService.markAllAsRead(id);
    return res.status(200).send({ message: "success" });
  }
}

export const NotificationController = new _NotificationController();
