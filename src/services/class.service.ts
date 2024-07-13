import prisma from "../../prisma";

class _ClassService {
  async getOneClassByProps(query: any) {
    try {
      return await prisma.class.findUnique({
        where: query,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getAllClassesByProps(query: any) {
    try {
      return await prisma.class.findMany({
        where: query,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getAllClassesByCreatorId(id: any) {
    try {
      return await prisma.class.findMany({
        where: { creatorId: parseInt(id) },
        include: {
          ClassParticipants: true,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createClass(data: any) {
    try {
      return await prisma.class.create({
        data: data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async addClassParticipant(data: any) {
    try {
      return await prisma.classParticipants.create({
        data: data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async addMultipleParticipants(participantsData: any[]) {
    try {
      return await prisma.classParticipants.createMany({
        data: participantsData,
        skipDuplicates: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateClassByProps(props: any, data: any) {
    try {
      return await prisma.class.update({
        where: props,
        data: data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getAllParticipantOfClass(id: number) {
    try {
      return await prisma.classParticipants.findMany({
        where: { classId: id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async addMessage(data: any) {
    try {
      return await prisma.classMessage.create({
        data: data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateSendMessage(query: any, data: any) {
    try {
      return await prisma.classMessage.update({ where: query, data: data });
    } catch (error) {
      throw error;
    }
  }

  async getAllMessagesOfClass(id: number) {
    try {
      return await prisma.classMessage.findMany({
        where: { classId: id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const ClassService = new _ClassService();
