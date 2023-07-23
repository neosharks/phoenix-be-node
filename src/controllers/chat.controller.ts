import { Request, Response } from "express";
import Logger from "../core/Logger";
import { ChatService } from "../services/chat.service";

class _ChatController {
  async createChat(req: Request, res: Response) {
    const body = req.body;
    await ChatService.createOneChat(body.participants);
    return res.status(200).json({ message: "Success" });
  }
}

export const ChatController = new _ChatController();
