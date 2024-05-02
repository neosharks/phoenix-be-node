import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";
import { paginationSchema } from "../validators/chat.validator";

class _NotificationController {
  async getAllNotificationByUser(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const { error, value } = paginationSchema.validate(req.query);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { omit, obtain } = value;
      const allNotifications = await NotificationService.getAllNotificationOfUser(
        {
          notifiedUserId: id,
        },
        omit,
        obtain,
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
