import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import Logger from "../core/logger.core";
import { UserService } from "../services/user.service";
import { NotificationService } from "../services/notification.service";

class _ChatController {
  async createChat(req: Request, res: Response) {
    const { participants } = req.body;
    const foundChat = await ChatService.getOneChat({
      OR: [
        { participantOneId: participants[0], participantTwoId: participants[1] },
        { participantOneId: participants[1], participantTwoId: participants[0] },
      ],
    });
    if (foundChat) return res.status(400).json({ message: "chat already exists", data: foundChat });
    const created = await ChatService.createOneChat(participants);
    return res.status(201).json({ message: "Success", data: created });
  }

  async getAllChatsByUser(req: Request, res: Response) {
    const { id } = res.locals.user;
    const foundChat = await ChatService.getAllChat({
      OR: [{ participantOneId: id }, { participantTwoId: id }],
    });
    const finalData: any = [];
    for (let i = 0; i < foundChat.length; i++) {
      const ele = foundChat[i];
      const saveObj: any = {};
      saveObj.id = ele.id;
      saveObj.unreadCount = ele.unreadCount;
      saveObj.participants = [ele.participantOne, ele.participantTwo];
      const foundMessages = await ChatService.getAllMessageForChat({
        chatId: ele.id,
      });
      saveObj.messages = foundMessages;
      finalData.push(saveObj);
    }
    return res.status(200).json({ chats: finalData });
  }

  async getAllSearchableUsers(req: Request, res: Response) {
    const allUser = await UserService.getAllUser();
    return res.status(200).json({ contacts: allUser });
  }

  async createMessage(req: Request, res: Response) {
    const { chatId, senderId, message, contentType } = req.body;
    const { isCreator, firstName, lastName } = res.locals.user;
    const foundChat = await ChatService.getOneChat({ id: chatId });
    if (!foundChat) return res.status(400).json({ message: "No chat found" });
    const createdChat = await ChatService.createOneMessage({
      chatId,
      senderId,
      message,
      contentType,
    });
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
    return res.status(201).json({ message: "Success", data: createdChat });
  }

  async getAllMessageByChat(req: Request, res: Response) {
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
    return res.status(200).json({ chat: response });
  }
}

export const ChatController = new _ChatController();
