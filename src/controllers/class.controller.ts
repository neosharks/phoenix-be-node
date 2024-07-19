import { Request, Response } from "express";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { ClassService } from "../services/class.service";
import {
  GetUploadedFile,
  GetUploadedVideo,
  GetUploadedDocument,
  getObjectSignedUrl,
} from "../core/s3upload.core";

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
      const { name, isPaid = false } = req.body;
      if (!name)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      await ClassService.createClass({ name, creatorId: id, isPaid, type: "NORMAL" });
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
      const classAdd = await ClassService.addClassParticipant({ userId: participantId, classId });
      return res.status(200).send({ message: successMessages.CREATED });
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

  async sendMessage(req: Request, res: Response) {
    try {
      const { classId, participantId, message, isPinned = false } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const image = files?.image?.[0];
      const video = files?.video?.[0];
      const document = files?.document?.[0];
      const { id } = res.locals.user;
      const payload: any = { authorId: id };

      if (!classId || !participantId || (!message && !image && !video && !document)) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      }

      if (image) payload.image = await GetUploadedFile(image);
      if (video) payload.video = await GetUploadedVideo(video);
      if (document) payload.document = await GetUploadedDocument(document);

      if (!message && !payload.image && !payload.video && !payload.document) {
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      }

      const created = await ClassService.addMessage({
        ...payload,
        userId: Number(participantId),
        classId: Number(classId),
        message: message || "",
        isPinned: Boolean(isPinned),
      });

      if (created?.image) created.image = await getObjectSignedUrl(created.image);
      if (created?.video) created.video = await getObjectSignedUrl(created.video);
      if (created?.document) created.document = await getObjectSignedUrl(created.document);

      return res.status(200).send({ message: successMessages.CREATED });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Internal server error" });
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

      await Promise.all(
        allClasses.map(async (message: any) => {
          if (message.file) {
            message.file = await getObjectSignedUrl(message.file);
          }
          return message;
        }),
      );
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
}

export const ClassController = new _ClassController();
