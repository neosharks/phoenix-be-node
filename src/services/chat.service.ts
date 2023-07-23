import prisma from "../../prisma";

class _ChatService {
  async getOneChat(query: any) {
    return await prisma.chat.findFirst({
      where: query,
    });
  }

  async getAllChat(query: any) {
    return await prisma.chat.findMany({
      where: query,
      include: {
        participantOne: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true,
            username: true,
          },
        },
        participantTwo: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true,
            username: true,
          },
        },
      },
    });
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
