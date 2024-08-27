import { Request, Response } from "express";
import admin from "firebase-admin";
import { NotificationService } from "../services/notification.service";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { serviceAccountKey } from "../firebseNotification/serviceAccountKey";
import logger from "../core/logger.core";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

class _NotificationController {
  async sendNotification(req: Request, res: Response) {
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
      const response = await admin.messaging().send(message);
      res.status(200).send(`Notification sent successfully: ${response}`);
    } catch (error) {
      logger.error(`Error sending notification: ${error}`);
      res.status(500).send(`Error sending notification: ${error}`);
    }
  }

  async getAllNotificationByUser(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
      const take = Number(req.query.per_page) || 10;

      const allNotifications = await NotificationService.getAllNotificationOfUser(
        { notifiedUserId: id },
        skip,
        take,
      );

      return res.status(200).send({ message: successMessages.FETCHED, data: allNotifications });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      await NotificationService.markAllAsRead({ id });
      return res.status(200).send({ message: successMessages.SUCCESS });
    } catch (error) {
      logger.error("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const NotificationController = new _NotificationController();
