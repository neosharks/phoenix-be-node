import { Op } from "sequelize";
import Notification from "../models/notification.model";
import User from "../models/user.model";

import { errorMessage } from "../constant/api.constant";
import logger from "../core/logger.core";

class _NotificationService {
  async getAllNotificationOfUser(query: any, skip: number = 0, take: number = 10) {
    try {
      return await Notification.findAll({
        where: query,
        include: [
          {
            model: User,
            as: "aboutUser",
            attributes: ["profileImage", "firstName", "lastName", "username"],
          },
        ],
        offset: skip,
        limit: take,
      });
    } catch (error) {
      logger.error("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async createOneNotification(dataValues: any) {
    try {
      const { aboutUserId, notifiedUserId, message, link, type } = dataValues;
      return await Notification.create({
        aboutUserId,
        notifiedUserId,
        message,
        read: false,
        link,
        type,
      });
    } catch (error) {
      logger.error("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async markAllAsRead(dataValues: any) {
    try {
      const { id } = dataValues;
      return await Notification.update(
        { read: true },
        {
          where: {
            notifiedUserId: id,
          },
        },
      );
    } catch (error) {
      logger.error("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }
}

export const NotificationService = new _NotificationService();
