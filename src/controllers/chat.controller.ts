import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import Logger from "../core/logger.core";
import { UserService } from "../services/user.service";
import { NotificationService } from "../services/notification.service";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { chatSchema } from "../validators/chat.validator";
import logger from "../core/logger.core";
import { PackageService } from "../services/package.service";

class _ChatController {
  async createChat(req: Request, res: Response) {
    try {
      const { participants } = req.body;
      const validation = chatSchema.validate(req.body);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      const foundChat = await ChatService.getOneChat({
        OR: [
          { participantOneId: participants[0], participantTwoId: participants[1] },
          { participantOneId: participants[1], participantTwoId: participants[0] },
        ],
      });
      if (foundChat)
        return res.status(400).json({ message: errorMessage.EXISTING_DATA, data: foundChat });
      const created = await ChatService.createOneChat(participants, "UNLIMITED");
      return res.status(201).json({ message: successMessages.CREATED, data: created });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllChatsByUser(req: Request, res: Response) {
    try {
      const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
      const take = Number(req.query.per_page) || 10;
      const { id } = res.locals.user;
      const foundChat = await ChatService.getAllChat(
        {
          OR: [{ participantOneId: id }, { participantTwoId: id }],
        },
        skip,
        take,
      );
      const finalData: any = [];
      for (let i = 0; i < foundChat.length; i++) {
        const ele = foundChat[i];
        const saveObj: any = {};
        saveObj.id = ele.id;
        saveObj.unreadCount = ele.unreadCount;
        saveObj.pendingAllowed = ele.pendingAllowed;
        saveObj.participants = [ele.participantOne, ele.participantTwo];
        const foundMessages = await ChatService.getAllMessageForChat({
          chatId: ele.id,
        });
        saveObj.messages = foundMessages;

        finalData.push(saveObj);
      }
      return res.status(200).json({ message: successMessages.SUCCESS, chats: finalData });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllSearchableUsers(req: Request, res: Response) {
    try {
      const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
      const take = Number(req.query.per_page) || 10;
      const allUser = await UserService.getAllUser(skip, take);
      return res.status(200).json({ message: successMessages.SUCCESS, contacts: allUser });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async createMessage(req: Request, res: Response) {
    try {
      const { chatId, senderId, message, contentType } = req.body;
      const validation = chatSchema.validate(req.body);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      const { isCreator, firstName, lastName } = res.locals.user;
      const foundChat = await ChatService.getOneChat({ id: chatId });
      if (!foundChat) return res.status(400).json({ message: errorMessage.NOT_FOUND });
      if (!isCreator && foundChat.pendingAllowed === 0)
        return res.status(errorCode.GENERIC).json({ message: errorMessage.LIMIT_EXHAUSTED });
      const createdChat = await ChatService.createOneMessage({
        chatId,
        senderId,
        message,
        contentType,
      });
      await ChatService.updateOneChat(
        { id: chatId },
        { pendingAllowed: isCreator ? foundChat.pendingAllowed : foundChat.pendingAllowed - 1 },
      );
      if (isCreator)
        await NotificationService.createOneNotification({
          aboutUserId: senderId,
          notifiedUserId:
            foundChat.participantOneId === senderId
              ? foundChat.participantTwoId
              : foundChat.participantOneId,
          message: `You have a new message from ${firstName + " " + lastName}`,
          type: "MESSAGE",
        });
      return res.status(201).json({ message: successMessages.SUCCESS, data: createdChat });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllMessageByChat(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const foundChat = await ChatService.getOneChat({ id: id });
      const participants = [foundChat?.participantOne, foundChat?.participantTwo];
      const found = await ChatService.getAllMessageForChat({
        chatId: id,
      });
      const response: any = {
        id,
        participants,
        messages: found,
        type: foundChat?.type,
        unreadCount: foundChat?.unreadCount,
      };
      return res.status(200).json({ message: successMessages.SUCCESS, chat: response });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const ChatController = new _ChatController();
