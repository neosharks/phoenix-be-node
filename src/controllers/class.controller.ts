import { Request, Response } from "express";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { ClassService } from "../services/class.service";
import User from "../models/user.model";

class _ClassController {
  async getOneClass(req: Request, res: Response) {
    try {
      let { id }: any = req.query;
      if (!id) return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundClass = await ClassService.getOneClassByProps({ id: parseInt(id) });
      return res.status(200).send({ message: successMessages.FETCHED, data: foundClass });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllClasses(req: Request, res: Response) {
    try {
      let { creatorId } = req.query;
      if (!creatorId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const allClasses = await ClassService.getAllClassesByCreatorId(creatorId);
      if (!allClasses) {
        return res.status(200).send({ message: successMessages.FETCHED, data: [] });
      }
      return res.status(200).send({ message: successMessages.FETCHED, data: allClasses });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async createClass(req: Request, res: Response) {
    try {
      const { id } = res.locals.user; // Get authenticated user's ID
      const { name, isPaid = false, price, paymentFrequency } = req.body;

      if (!name) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      }

      // Check if user exists before creating class
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(errorCode.NOT_FOUND).send({ message: "User not found" });
      }

      await ClassService.createClass({
        name,
        creatorId: id,
        isPaid,
        type: "NORMAL", // Assuming "NORMAL" is a valid value for the `type` field
        price: price || null,
        paymentFrequency: paymentFrequency || null,
      });

      return res.status(200).send({ message: successMessages.CREATED });
    } catch (error) {
      console.error("ERROR: ", error); // Improved error logging
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async updateClass(req: Request, res: Response) {
    try {
      const { id, ...data } = req.body;

      if (!id) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      }
      const foundClass = await ClassService.getOneClassByProps({ id: parseInt(id) });

      if (!foundClass) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      }
      await ClassService.updateClassByProps({ id: parseInt(id) }, data);

      return res.status(200).send({ message: successMessages.UPDATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async addOneParticipant(req: Request, res: Response) {
    try {
      const { classId, participantId } = req.body;
      if (!classId || !participantId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const addMember = await ClassService.addClassParticipant({
        classId: Number(classId),
        userId: Number(participantId),
      });
      return res.status(200).send({ message: successMessages.CREATED, data: addMember });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async addMultipleParticipants(req: Request, res: Response) {
    try {
      const { classId, participants } = req.body;
      if (!classId || !participants || !Array.isArray(participants)) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      }
      const participantData = participants.map((participantId) => ({
        userId: participantId,
        classId: classId,
      }));
      await ClassService.addMultipleParticipants(participantData);
      return res.status(200).send({ message: successMessages.CREATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async getAllParticipantOfClass(req: Request, res: Response) {
    try {
      let { classId }: any = req.query;
      if (!classId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const allClasses = await ClassService.getAllParticipantOfClass(parseInt(classId));
      return res.status(200).send({ message: successMessages.FETCHED, data: allClasses });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllMessagesOfClass(req: Request, res: Response) {
    try {
      let { id }: any = req.query;
      if (!id) return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const allClasses = await ClassService.getAllMessagesOfClass(parseInt(id));
      if (!allClasses) {
        return res.status(200).send({ message: successMessages.FETCHED, data: [] });
      }
      return res.status(200).send({ message: successMessages.FETCHED, data: allClasses });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async updateSendMessage(req: Request, res: Response) {
    try {
      const { classId, messageId, isPinned = false } = req.body;
      if (!classId || !messageId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const foundClass = await ClassService.getAllMessagesOfClass(parseInt(classId));
      if (!foundClass) {
        return res.status(200).send({ message: successMessages.FETCHED, data: [] });
      }
      const findMessage = foundClass?.find((res: any) => res.id === messageId);
      if (!findMessage)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.NOT_FOUND });
      await ClassService.updateSendMessage({ id: messageId }, { isPinned });

      return res.status(200).send({ message: successMessages.UPDATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAvailableParticipants(req: Request, res: Response) {
    try {
      let { classId }: any = req.query;
      if (!classId)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });

      const availableParticipants = await ClassService.getAvailableParticipants(parseInt(classId));

      return res
        .status(200)
        .send({ message: successMessages.FETCHED, data: availableParticipants });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllClassesForUser(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const classes = await ClassService.getAllClassesForUser(id);
      return res.status(200).json({ message: successMessages.FETCHED, data: classes });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
  async joinPaidClass(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const userId = res.locals.user.id;

      if (!id) {
        return res.status(400).send({ message: "Class ID is required" });
      }

      const foundClass = await ClassService.getOneClassByProps({ id: parseInt(id) });

      if (!foundClass) {
        return res.status(404).send({ message: "Class not found" });
      }

      if (!foundClass.isPaid) {
        await ClassService.addClassParticipant({
          classId: Number(id),
          userId,
        });
        return res.status(200).send({ message: "Successfully joined the class" });
      }

      const patronCreator = await ClassService.getPatronCreatorSubscription(
        userId,
        foundClass.creatorId,
      );

      if (!patronCreator) {
        return res
          .status(403)
          .send({ message: "You need an active subscription to join this class" });
      }

      await ClassService.addClassParticipant({
        classId: Number(id),
        userId,
      });

      return res.status(200).send({ message: "Successfully joined the class" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

export const ClassController = new _ClassController();
