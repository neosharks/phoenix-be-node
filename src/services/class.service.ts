import prisma from "../../prisma";
class _ClassService {
  async getOneClassByProps(query: any) {
    try {
      return await prisma.class.findUnique({
        where: query,
        include: {
          ClassParticipants: true,
          creator: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
              username: true,
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
          creator: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
              username: true,
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
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
              username: true,
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

  async addMessage(dataValues: any) {
    try {
      const { classId, userId, message, image, isPinned, video, document } = dataValues;

      return await prisma.classMessage.create({
        data: {
          classId,
          userId,
          message,
          isPinned,
          image,
          video,
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
                select: {
                  firstName: true,
                  lastName: true,
                  profileImage: true,
                  username: true,
                },
              },
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
              username: true,
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
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          username: true,
          email: true,
          phoneNumber: true,
        },
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
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
              username: true,
              email: true,
              phoneNumber: true,
            },
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
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
              username: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });
      return { createdClasses, participatedClasses };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const ClassService = new _ClassService();
