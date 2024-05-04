import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";

class _NotificationController {
  async getAllNotificationByUser(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const skip = req.query.page || 0;
      const allNotifications = await NotificationService.getAllNotificationOfUser(
        {
          notifiedUserId: id,
        },
        Number(skip),
      );
      return res.status(200).send({ message: successMessages.FETCHED, data: allNotifications });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      await NotificationService.markAllAsRead(id);
      return res.status(200).send({ message: successMessages.SUCCESS });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const NotificationController = new _NotificationController();
