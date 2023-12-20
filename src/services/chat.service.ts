import prisma from "../../prisma";

class _ChatService {
  async getOneChat(query: any) {
    return await prisma.chat.findFirst({
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
  }

  async getAllChat(query: any) {
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
    return await prisma.message.findMany({
      where: query,
    });
  }

  async createOneMessage(data: any) {
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
  }
}

export const ChatService = new _ChatService();
