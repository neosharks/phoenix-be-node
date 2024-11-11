import { Request, Response } from "express";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { ClassService } from "../services/class.service";
import { number } from "joi";
import { PaymentService } from "../services/payment.service";
import { isTextObjectionable } from "../utils/Moderation";

class _ClassController {
  async getOneClass(req: Request, res: Response) {
    try {
      let { id }: any = req.query;
      if (!id) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
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
      let creatorId = req.query.creatorId as any;
      if (typeof creatorId === "string" && !isNaN(Number(creatorId)))
        creatorId = parseInt(creatorId, 10);
      else creatorId = null;

      const allClasses = await ClassService.getAllClassesByProps(
        creatorId ? { creatorId, isActive: true } : { isActive: true },
      );
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
      const { id } = res.locals.user;
      const { name, isPaid = false, price, paymentFrequency } = req.body;
      if (!name) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      if (isPaid && !price)
        return res
          .status(403)
          .send({ message: errorMessage.NOT_ALLOWED, info: "Provide price for paid class" });
      await ClassService.createClass({
        name,
        creatorId: id,
        isPaid,
        type: "NORMAL",
        price: price || null,
        paymentFrequency: paymentFrequency || null,
      });
      return res.status(200).send({ message: successMessages.CREATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async updateClass(req: Request, res: Response) {
    try {
      const { id, ...data } = req.body;

      if (!id) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      const foundClass = await ClassService.getOneClassByProps({ id: parseInt(id) });
      if (!foundClass) return res.status(400).send({ message: errorMessage.NOT_FOUND });

      await ClassService.updateClassByProps({ id: parseInt(id) }, data);

      return res.status(200).send({ message: "UPDATED" });
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
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const foundClass = await ClassService.getOneClassByProps({ id: classId });
      if (!foundClass) return res.status(404).send({ message: errorMessage.NOT_FOUND });
      if (foundClass.isPaid) {
        const foundPaidEntry = await PaymentService.getOnePaymentByProps({
          classId,
          userId: participantId,
        });
        if (!foundPaidEntry || foundPaidEntry.status !== "PAID")
          return res.status(403).send({ message: errorMessage.NOT_ALLOWED, info: "Class is paid" });
      }
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
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
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
      if (!classId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const allClasses = await ClassService.getAllParticipantOfClass(parseInt(classId));
      return res.status(200).send({ message: successMessages.FETCHED, data: allClasses });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async leaveOneClass(req: Request, res: Response) {
    try {
      let { classId, userId } = req.body;
      if (!classId || !userId)
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const allClasses = await ClassService.leaveClass(parseInt(classId), parseInt(userId));
      console.log(allClasses, "sdfsd");
      if (allClasses) {
        return res
          .status(200)
          .send({ message: successMessages.FETCHED, data: successMessages.DELETE });
      } else {
        return res.status(403).json({ message: errorMessage.ALREADY_DELETED });
      }
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const { classId, message } = req.body;
      const image = req.body?.image;
      const video = req.body?.video;
      const document = req.body?.document;
      const audio = req.body?.audio;
      const { id } = res.locals.user;
      const payload: any = { authorId: id };

      if (!classId || (!message && !image && !video && !document && !audio))
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      if (!message && !payload.image && !payload.video && !payload.document && !payload.audio)
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      if (isTextObjectionable(message))
        return res.status(403).send({ message: errorMessage.OFFENSIVE_CONTENT });

      await ClassService.addMessage({
        ...payload,
        userId: Number(id),
        classId: Number(classId),
        message: message || "",
        isPinned: false,
      });
      return res.status(200).send({ message: successMessages.CREATED });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteOneMessage(req: Request, res: Response) {
    try {
      let { messageId } = req.body;
      if (!messageId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
      const foundMessage = await ClassService.getOneMessageByProps({ id: messageId });
      if (!foundMessage) return res.status(403).send({ message: errorMessage.NOT_ALLOWED });
      await ClassService.deleteOneMessageByProps({ id: messageId });
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
      if (!id) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });
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

  async updateMessage(req: Request, res: Response) {
    try {
      const { messageId } = req.body;
      const { id } = res.locals.user;
      if (!messageId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      const foundMessage = await ClassService.getOneMessageByProps({ id: messageId });
      if (!foundMessage) return res.status(400).send({ message: errorMessage.NOT_FOUND });
      if (id !== foundMessage.userId)
        return res.status(403).send({ message: errorMessage.NOT_ALLOWED });
      await ClassService.updateMessage({ id: messageId }, req.body);

      return res.status(200).send({ message: "UPDATED" });
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
      if (!classId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

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

  async deactivateOneClass(req: Request, res: Response) {
    try {
      const { classId } = req.body;
      const { id } = res.locals.user;

      if (!classId) return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      const foundClass = await ClassService.getOneClassByProps({ id: classId });
      if (!foundClass) return res.status(404).send({ message: errorMessage.NOT_FOUND });

      if (foundClass.creatorId !== id)
        return res.status(403).send({ message: errorMessage.NOT_ALLOWED });

      await ClassService.updateClassByProps({ id: classId }, { isActive: false });

      return res.status(201).send({ message: "UPDATED" });
    } catch (error) {
      console.error("ERROR: ", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  async requestNewClass(req: Request, res: Response) {
    try {
      const { creatorId, message } = req.body;
      const { id } = res.locals.user;

      if (!creatorId || !message)
        return res.status(400).send({ message: errorMessage.MISSING_PARAMS });

      const newRequest = await ClassService.createClassRequest(id, creatorId, message);
      if (!newRequest) return res.status(403).json({ message: errorMessage.REQUEST_ALREADY });

      return res.status(201).send({ message: successMessages.CREATED, data: newRequest });
    } catch (error) {
      console.error("ERROR: ", error);
      if (error) {
        return res.status(409).send({ message: error });
      }
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
}

export const ClassController = new _ClassController();
