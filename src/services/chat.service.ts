import { db } from "../models/sequelize";
import { errorMessage } from "../constant/api.constant";

const { Chat, Message, User } = db;

class _ChatService {
  async getOneChat(query: any) {
    try {
      const result = await Chat.findOne({
        where: query,
        include: [
          {
            model: User,
            as: "participantOne",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "role",
            ],
          },
          {
            model: User,
            as: "participantTwo",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "role",
            ],
          },
        ],
      });
      console.log(result, "result");
      return result;
    } catch (error) {
      console.error("ERROR in getOneChat:", error);
      throw new Error("DB_ISSUE");
    }
  }

  async getAllChat(query: any, skip: number = 0, take: number = 10) {
    try {
      return await Chat.findAll({
        where: query,
        include: [
          {
            model: User,
            as: "participantOne",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "role",
            ],
          },
          {
            model: User,
            as: "participantTwo",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImage",
              "email",
              "username",
              "role",
            ],
          },
        ],
        offset: skip,
        limit: take,
      });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async createOneChat(participants: any, allowed: any) {
    try {
      return await Chat.create({
        participantOneId: participants[0],
        participantTwoId: participants[1],
        pendingAllowed: allowed === "UNLIMITED" ? 10000 : 1,
      });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async getOneMessage(query: any) {
    try {
      return await Message.findOne({ where: query });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async updateOneChat(query: any, data: any) {
    try {
      return await Chat.update(data, { where: query });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async getAllMessageForChat(query: any) {
    try {
      return await Message.findAll({ where: query });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async createOneMessage(data: any) {
    try {
      return await Message.create(
        {
          ...data,
        },
        {
          attributes: [
            "id",
            "chatId",
            "message",
            "contentType",
            "senderId",
            "createdAt",
            "updatedAt",
          ],
        },
      );
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }
}

export const ChatService = new _ChatService();
