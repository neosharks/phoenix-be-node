import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import { UserService } from "../services/user.service";
import { NotificationService } from "../services/notification.service";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { Op } from "sequelize";

class _ChatController {
  async createChat(req: Request, res: Response) {
    try {
      const { participants } = req.body;

      const foundChat = await ChatService.getOneChat({
        [Op.or]: [
          { participantOneId: participants[0], participantTwoId: participants[1] },
          { participantOneId: participants[1], participantTwoId: participants[0] },
        ],
      });

      if (foundChat) {
        return res.status(400).json({ message: errorMessage.EXISTING_DATA, data: foundChat });
      }

      const created = await ChatService.createOneChat(participants, "UNLIMITED");
      return res.status(201).json({ message: successMessages.CREATED, data: created });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async getAllChatsByUser(req: Request, res: Response) {
    try {
      const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
      const take = Number(req.query.per_page) || 10;
      const { id } = res.locals.user;

      const foundChat = await ChatService.getAllChat(
        {
          [Op.or]: [{ participantOneId: id }, { participantTwoId: id }],
        },
        skip,
        take,
      );

      const finalData: any[] = [];
      for (const ele of foundChat) {
        const saveObj: any = {
          id: ele.id,
          unreadCount: ele.unreadCount,
          pendingAllowed: ele.pendingAllowed,
          participants: [ele.participantOne, ele.participantTwo],
        };

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
        .json({ message: errorMessage.INTERNAL_SERVER, error });
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
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async createMessage(req: Request, res: Response) {
    try {
      const { chatId, contentType, message, senderId } = req.body;
      const { isCreator, firstName, lastName } = res.locals.user;

      const foundChat = await ChatService.getOneChat({ id: chatId });
      if (!foundChat) return res.status(400).json({ message: errorMessage.NOT_FOUND });
      if (!isCreator && foundChat.pendingAllowed === 0) {
        return res.status(errorCode.GENERIC).json({ message: errorMessage.LIMIT_EXHAUSTED });
      }

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

      if (isCreator) {
        await NotificationService.createOneNotification({
          aboutUserId: senderId,
          notifiedUserId:
            foundChat.participantOneId === senderId
              ? foundChat.participantTwoId
              : foundChat.participantOneId,
          message: `You have a new message from ${firstName + " " + lastName}`,
          type: "MESSAGE",
        });
      }

      return res.status(201).json({ message: successMessages.SUCCESS, data: createdChat });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }

  async getAllMessageByChat(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const foundChat = await ChatService.getOneChat({ id });
      if (!foundChat) {
        return res.status(404).json({ message: errorMessage.NOT_FOUND });
      }

      const participants = [foundChat.participantOne, foundChat.participantTwo];
      const foundMessages = await ChatService.getAllMessageForChat({
        chatId: id,
      });

      const response: any = {
        id,
        participants,
        messages: foundMessages,
        type: foundChat.type,
        unreadCount: foundChat.unreadCount,
      };

      return res.status(200).json({ message: successMessages.SUCCESS, chat: response });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error });
    }
  }
}

export const ChatController = new _ChatController();
