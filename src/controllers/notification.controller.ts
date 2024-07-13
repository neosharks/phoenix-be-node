import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import logger from "../core/logger.core";
// const admin = require("firebase-admin");

// const serviceAccount = require("./modular-seeker-425605-b7-firebase-adminsdk-gatu2-0bc4810f8f.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const sendNotification = async (registrationToken: Request) => {
//   const messageSend = {
//     token: registrationToken,
//     notification: {
//       title: "hellow",
//       body: "world",
//     },
//     data: {
//       key1: "value1",
//       key2: "value2",
//     },
//     android: {
//       priority: "high",
//     },
//     apns: {
//       payload: {
//         aps: {
//           badge: 42,
//         },
//       },
//     },
//   };
//   admin
//     .message()
//     .send(messageSend)
//     .then((response: any) => {
//       console.log("succesFully send message", response);
//     })
//     .catch((error: any) => {
//       console.log("error send message", error);
//     });
// };

// const registrationToken = "c9DGqMRZRo2G8tt5dlD2g5:APA91bHxUKQ8D-MNLqoxuKDVvm7u3QOwNMZh9BS92E7Cj2pDp-y5AELLscAVjlMwYJdCxfGKDn-1DrEcvGdmmHL-mjyBNzcCfP9TRvcvDl2-vHdljr8B7rUJKdYrRqdF6MfZKXvh42UK";
// sendNotification(registrationToken);

const admin = require("firebase-admin");
const serviceAccount = require("../firebseNotification/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class _NotificationController {
  async sendNotification(req: Request, res: Response) {
    const { token, title, body, data } = req.body;

    const message = {
      notification: {
        title,
        body: body.message,
      },
      token,
      data: data || {},
    };

    await admin
      .messaging()
      .send(message)
      .then((response: any) => {
        res.status(200).send(`Notification sent successfully: ${response}`);
      })
      .catch((error: any) => {
        res.status(500).send(`Error sending notification: ${error}`);
      });
  }
  async getAllNotificationByUser(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
      const take = Number(req.query.per_page) || 10;
      const allNotifications = await NotificationService.getAllNotificationOfUser(
        {
          notifiedUserId: id,
        },
        skip,
        take,
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
