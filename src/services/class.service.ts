import ClassParticipants from "../models/classParticipants.model";
import User from "../models/user.model";
import Class from "../models/class.model";
import ClassMessage from "../models/classMessage.model";
import PatronCreator from "../models/patronCreator.model";

class _ClassService {
  async getOneClassByProps(query: any) {
    try {
      return await Class.findOne({
        where: query,
        include: [
          { model: ClassParticipants },
          {
            model: User,
            as: "creator",
            attributes: [
              "firstName",
              "lastName",
              "profileImage",
              "username",
              "email",
              "phoneNumber",
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllClassesByProps(query: any) {
    try {
      return await Class.findAll({
        where: query,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllClassesByCreatorId(id: any) {
    try {
      return await Class.findAll({
        where: { creatorId: parseInt(id) },
        include: [
          {
            model: ClassParticipants,
          },
          {
            model: User,
            as: "creator",
            attributes: [
              "firstName",
              "lastName",
              "profileImage",
              "username",
              "email",
              "phoneNumber",
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createClass(data: any) {
    try {
      return await Class.create(data);
    } catch (error) {
      console.error(error);
    }
  }

  async addClassParticipant(data: any) {
    try {
      return await ClassParticipants.create(data);
    } catch (error) {
      console.error(error);
    }
  }

  async addMultipleParticipants(participantsData: any[]) {
    try {
      return await ClassParticipants.bulkCreate(participantsData, { ignoreDuplicates: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateClassByProps(query: any, data: any) {
    try {
      return await Class.update(data, {
        where: query,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllParticipantOfClass(id: number) {
    try {
      return await ClassParticipants.findAll({
        where: { classId: id },
        include: [
          {
            model: User,
            attributes: [
              "firstName",
              "lastName",
              "profileImage",
              "username",
              "email",
              "phoneNumber",
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllMessagesOfClass(id: number) {
    try {
      return await ClassMessage.findAll({
        where: { classId: id },
        include: [
          {
            model: ClassMessage,
            as: "repliedMessage",
            include: [
              {
                model: User,
                attributes: ["firstName", "lastName", "profileImage", "username"],
              },
            ],
          },
          {
            model: User,
            attributes: [
              "firstName",
              "lastName",
              "profileImage",
              "username",
              "email",
              "phoneNumber",
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateSendMessage(query: any, data: any) {
    try {
      return await ClassMessage.update(data, {
        where: query,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAvailableParticipants(classId: number) {
    try {
      const classData = await Class.findOne({
        where: { id: classId },
        attributes: ["creatorId"],
      });

      if (!classData) {
        throw new Error("Class not found");
      }

      const creatorId = classData.creatorId;

      const allUsers = await User.findAll({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "profileImage",
          "username",
          "email",
          "phoneNumber",
        ],
      });

      const participants = await ClassParticipants.findAll({
        where: { classId },
        attributes: ["userId"],
      });

      const participantIds = participants.map((p: any) => p.userId);
      const availableParticipants = allUsers.filter(
        (user: any) => user.id !== creatorId && !participantIds.includes(user.id),
      );

      return availableParticipants;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllClassesForUser(id: number) {
    try {
      const createdClasses = await Class.findAll({
        where: { creatorId: id },
        include: [
          { model: ClassParticipants },
          {
            model: User,
            as: "creator",
            attributes: [
              "firstName",
              "lastName",
              "profileImage",
              "username",
              "email",
              "phoneNumber",
            ],
          },
        ],
      });

      const participatedClasses = await Class.findAll({
        where: {
          "$ClassParticipants.userId$": id,
        },
        include: [
          { model: ClassParticipants },
          {
            model: User,
            as: "creator",
            attributes: [
              "firstName",
              "lastName",
              "profileImage",
              "username",
              "email",
              "phoneNumber",
            ],
          },
        ],
      });

      return { createdClasses, participatedClasses };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getPatronCreatorSubscription(userId: number, creatorId: number) {
    try {
      return await PatronCreator.findOne({
        where: {
          patronId: userId,
          creatorId: creatorId,
          status: "ACTIVE",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const ClassService = new _ClassService();
