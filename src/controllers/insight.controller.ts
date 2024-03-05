import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";

class _InsightController {
  async get(req: Request, res: Response) {
    try {
      const { id, isCreator } = res.locals.user;
      if (!isCreator)
        return res.status(errorCode.FORBIDDEN).json({ message: errorMessage.NOT_ALLOWED });
      const allNotifications = await NotificationService.getAllNotificationOfUser({
        notifiedUserId: id,
      });
      return res.status(200).send({ message: successMessages.FETCHED, data: allNotifications });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const InsightController = new _InsightController();
