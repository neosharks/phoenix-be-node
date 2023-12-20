import prisma from "../../prisma";

class _NotificationService {
  async getAllNotificationOfUser(query: any) {
    try {
      return await prisma.notification.findMany({
        where: query,
        include: {
          aboutUser: {
            select: {
              profileImage: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification");
    }
  }

  async createOneNotification(dataValues: any) {
    try {
      const { aboutUserId, notifiedUserId, message, link, type } = dataValues;
      return prisma.notification.create({
        data: { aboutUserId, notifiedUserId, message, read: false, link, type },
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification");
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
      console.error("Error updating notification:", error);
      throw new Error("Failed to update notification");
    }
  }
}

export const NotificationService = new _NotificationService();
