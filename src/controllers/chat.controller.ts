import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import Logger from "../core/logger.core";

class _ChatController {
  async createChat(req: Request, res: Response) {
    try {
      const { participants } = req.body;
      const foundChat = await ChatService.getOneChat({
        OR: [
          { participantOneId: participants[0], participantTwoId: participants[1] },
          { participantOneId: participants[1], participantTwoId: participants[0] },
        ],
      });
      if (foundChat)
        return res.status(400).json({ message: "chat already exists", data: foundChat });
      const created = await ChatService.createOneChat(participants);
      return res.status(201).json({ message: "Success", data: created });
    } catch (err) {
      Logger.error(err);
    }
  }

  async getAllChatsByUser(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const foundChat = await ChatService.getAllChat({
        OR: [{ participantOneId: id }, { participantTwoId: id }],
      });
      return res.status(200).json({ data: foundChat });
    } catch (err) {
      Logger.error(err);
    }
  }

  async createMessage(req: Request, res: Response) {
    try {
      const { chatId, senderId, message } = req.body;
      const createdChat = await ChatService.createOneMessage({ chatId, senderId, message });
      return res.status(201).json({ message: "Success", data: createdChat });
    } catch (err) {
      Logger.error(err);
    }
  }

  async getAllMessageByChat(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const found = await ChatService.getAllMessageForChat({
        chatId: id,
      });
      return res.status(200).json({ data: found });
    } catch (err) {
      Logger.error(err);
    }
  }
}

export const ChatController = new _ChatController();
