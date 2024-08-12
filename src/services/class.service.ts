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
      const availableParticipants = allUsers.filter((user) => !participantIds.includes(user.id));

      return availableParticipants;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllClassesForUser(userId: number) {
    try {
      const createdClasses = await prisma.class.findMany({
        where: { creatorId: userId },
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
              userId: userId,
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

      const classesWhereUserIsCreatorAndOthersJoined = await prisma.class.findMany({
        where: {
          creatorId: userId,
          ClassParticipants: {
            some: {
              userId: { not: userId },
            },
          },
        },
        include: {
          ClassParticipants: {
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
          },
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

      // सभी क्लासेस को मर्ज करना
      const allClasses = [
        ...createdClasses,
        ...participatedClasses,
        ...classesWhereUserIsCreatorAndOthersJoined,
      ];

      const uniqueClasses = allClasses.filter(
        (value, index, self) => index === self.findIndex((t) => t.id === value.id),
      );

      return uniqueClasses;
    } catch (error) {
      console.log("ERROR: ", error);
      return error;
    }
  }
}

export const ClassService = new _ClassService();
