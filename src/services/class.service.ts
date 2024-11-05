import prisma from "../../prisma";
import { userCommonObject } from "../lib/commonObjects.lib";
class _ClassService {
  async getOneClassByProps(query: any) {
    try {
      return await prisma.class.findUnique({
        where: query,
        include: {
          ClassParticipants: true,
          creator: {
            select: userCommonObject,
          },
        },
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
          creator: {
            select: userCommonObject,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getAllClassesByProps(props: any) {
    try {
      return await prisma.class.findMany({
        where: props,
        include: {
          ClassParticipants: true,
          creator: {
            select: userCommonObject,
          },
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

  async updateClassByProps(query: any, data: any) {
    try {
      return await prisma.class.update({
        where: query,
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
            select: userCommonObject,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async addMessage(dataValues: any) {
    console.log(dataValues);
    try {
      const { classId, userId, message, image, isPinned, audio, video, document } = dataValues;
      return await prisma.classMessage.create({
        data: {
          classId,
          userId,
          message,
          isPinned,
          image,
          video,
          audio,
          document,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getAllMessagesOfClass(id: number) {
    try {
      return await prisma.classMessage.findMany({
        where: { classId: id },
        include: {
          repliedMessage: {
            include: {
              user: {
                select: userCommonObject,
              },
            },
          },
          user: {
            select: userCommonObject,
          },
        },
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

  async getAvailableParticipants(classId: number) {
    try {
      const classData = await prisma.class.findUnique({
        where: {
          id: classId,
        },
        select: {
          creatorId: true,
        },
      });

      if (!classData) {
        throw new Error("Class not found");
      }

      const creatorId = classData.creatorId;

      const allUsers = await prisma.user.findMany({
        select: userCommonObject,
      });

      const participants = await prisma.classParticipants.findMany({
        where: { classId },
        select: { userId: true },
      });

      const participantIds = participants.map((p) => p.userId);
      const availableParticipants = allUsers.filter(
        (user) => user.id !== creatorId && !participantIds.includes(user.id),
      );

      return availableParticipants;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllClassesForUser(id: number) {
    try {
      const createdClasses = await prisma.class.findMany({
        where: { creatorId: id },
        include: {
          ClassParticipants: true,
          creator: {
            select: userCommonObject,
          },
        },
      });

      const participatedClasses = await prisma.class.findMany({
        where: {
          ClassParticipants: {
            some: {
              userId: id,
            },
          },
        },
        include: {
          ClassParticipants: true,
          creator: {
            select: userCommonObject,
          },
        },
      });
      return { createdClasses, participatedClasses };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async leaveClass(classId: number, userId: number) {
    try {
      const classParticipant = await prisma.classParticipants.findFirst({
        where: {
          classId: classId,
          userId: userId,
        },
      });

      if (!classParticipant) {
        return false;
      }

      await prisma.classParticipants.delete({
        where: {
          id: classParticipant.id,
        },
      });
      return true;
    } catch (error) {
      console.error("Error while leaving the class:", error);
      return false;
    }
  }

  async createClassRequest(userId: number, creatorId: number, message: string) {
    const existingRequest = await prisma.classRequest.findFirst({
      where: {
        userId,
        creatorId,
      },
    });

    if (existingRequest) {
      return null;
    }

    return await prisma.classRequest.create({
      data: {
        userId,
        creatorId,
        message,
      },
    });
  }
}

export const ClassService = new _ClassService();
