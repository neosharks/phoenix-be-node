import prisma from "../../prisma";
import { errorMessage } from "../constant/api.constant";
import logger from "../core/logger.core";
import { userCommonObject } from "../lib/commonObjects.lib";

class _NotificationService {
  async getAllNotificationOfUser(query: any, skip: number = 0, take: number = 10) {
    try {
      return await prisma.notification.findMany({
        where: query,
        include: {
          aboutUser: {
            select: userCommonObject,
          },
        },
        skip,
        take,
      });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async createOneNotification(dataValues: any) {
    try {
      const { aboutUserId, notifiedUserId, message, link, type } = dataValues;
      return prisma.notification.create({
        data: { aboutUserId, notifiedUserId, message, read: false, link, type },
      });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async markAllAsRead(dataValues: any) {
    try {
      const { id } = dataValues;
      return prisma.notification.updateMany({
        where: {
          notifiedUserId: id,
        },
        data: {
          read: true,
        },
      });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }
}

export const NotificationService = new _NotificationService();
