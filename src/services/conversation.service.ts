import prisma from "../../prisma";

class _ConversationService {
  async getOneConversation(query: any) {
    return await prisma.conversation.findFirst({
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

  async getAllConversation(query: any) {
    return await prisma.conversation.findMany({
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

  async createOneConversation(participants: any) {
    return await prisma.conversation.create({
      data: {
        participantOneId: participants[0],
        participantTwoId: participants[1],
      },
    });
  }

  async getOneMessage(query: any) {
    return await prisma.message.findUnique({ where: query });
  }

  async getAllMessageForConversation(query: any) {
    return await prisma.message.findMany({
      where: query,
    });
  }

  async createOneMessage(data: any) {
    return await prisma.message.create({ data: data });
  }
}

export const ConversationService = new _ConversationService();
