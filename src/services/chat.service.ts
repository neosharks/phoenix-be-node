import prisma from "../../prisma";

class _ChatService {
  async getOneChat(query: any) {
    return await prisma.chat.findUnique({ where: query });
  }

  async getAllChat(query: any) {
    return await prisma.message.findMany({ where: query });
  }

  async createOneChat(participants: any) {
    return await prisma.chat.create({
      data: {
        participantOneId: participants[0],
        participantTwoId: participants[1],
      },
    });
  }

  async getOneMessage(query: any) {
    return await prisma.message.findUnique({ where: query });
  }

  async getAllMessageForChat(query: any) {
    return await prisma.message.findMany({ where: query });
  }

  async createOneMessage(data: any) {
    return await prisma.message.create({ data: data });
  }
}

export const ChatService = new _ChatService();
