import prisma from "../../prisma";
import { errorMessage } from "../constant/api.constant";
import logger from "../core/logger.core";

class _ChatService {
  async getOneChat(query: any) {
    try {
      const result = await prisma.chat.findFirst({
        where: query,
        include: {
          participantOne: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              role: true,
            },
          },
          participantTwo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              role: true,
            },
          },
        },
      });
      console.log(result, "result");
      return result;
    } catch (error) {
      console.error("ERROR in getOneChat:", error);
      throw new Error("DB_ISSUE");
    }
  }

  async getAllChat(query: any, skip: any = 0, take: any = 10) {
    try {
      return await prisma.chat.findMany({
        where: query,
        include: {
          participantOne: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              role: true,
            },
          },
          participantTwo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              username: true,
              role: true,
            },
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

  async createOneChat(participants: any, allowed: any) {
    try {
      return await prisma.chat.create({
        data: {
          participantOneId: participants[0],
          participantTwoId: participants[1],
          pendingAllowed: allowed === "UNLIMITED" ? 10000 : 1,
        },
      });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async getOneMessage(query: any) {
    try {
      return await prisma.message.findUnique({ where: query });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async updateOneChat(query: any, data: any) {
    try {
      return await prisma.chat.update({ where: query, data });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async getAllMessageForChat(query: any) {
    try {
      return await prisma.message.findMany({
        where: query,
      });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }

  async createOneMessage(data: any) {
    try {
      return await prisma.message.create({
        data: data,
        select: {
          id: true,
          chatId: true,
          message: true,
          contentType: true,
          senderId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.log("ERROR: ", error);
      throw new Error(errorMessage.DB_ISSUE);
    }
  }
}

export const ChatService = new _ChatService();
