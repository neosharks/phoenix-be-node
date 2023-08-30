import { Request, Response } from "express";
import { ConversationService } from "../services/conversation.service";
import Logger from "../core/logger.core";
import { UserService } from "../services/user.service";

class _ConversationController {
  async createConversation(req: Request, res: Response) {
    const { participants } = req.body;
    console.log(req.body);
    const foundConversation = await ConversationService.getOneConversation({
      OR: [
        { participantOneId: participants[0], participantTwoId: participants[1] },
        { participantOneId: participants[1], participantTwoId: participants[0] },
      ],
    });
    if (foundConversation)
      return res
        .status(400)
        .json({ message: "conversation already exists", data: foundConversation });
    const created = await ConversationService.createOneConversation(participants);
    return res.status(201).json({ message: "Success", data: created });
  }

  async getAllConversationsByUser(req: Request, res: Response) {
    const { id } = res.locals.user;
    const foundConversation = await ConversationService.getAllConversation({
      OR: [{ participantOneId: id }, { participantTwoId: id }],
    });
    const finalData: any = [];
    for (let i = 0; i < foundConversation.length; i++) {
      const ele = foundConversation[i];
      const saveObj: any = {};
      saveObj.id = ele.id;
      saveObj.unreadCount = ele.unreadCount;
      saveObj.participants = [ele.participantOne, ele.participantTwo];
      const foundMessages = await ConversationService.getAllMessageForConversation({
        conversationId: ele.id,
      });
      saveObj.messages = foundMessages;
      finalData.push(saveObj);
    }
    return res.status(200).json({ conversations: finalData });
  }

  async getAllSearchableUsers(req: Request, res: Response) {
    const allUser = await UserService.getAllUser();
    return res.status(200).json({ contacts: allUser });
  }

  async createMessage(req: Request, res: Response) {
    const { conversationId, senderId, message, contentType } = req.body;
    const createdConversation = await ConversationService.createOneMessage({
      conversationId,
      senderId,
      message,
      contentType,
    });
    return res.status(201).json({ message: "Success", data: createdConversation });
  }

  async getAllMessageByConversation(req: Request, res: Response) {
    const { id } = req.query;
    const foundConversation = await ConversationService.getOneConversation({ id: id });
    const participants = [foundConversation?.participantOne, foundConversation?.participantTwo];
    const found = await ConversationService.getAllMessageForConversation({
      conversationId: id,
    });
    const response: any = {
      id,
      participants,
      messages: found,
      type: foundConversation?.type,
      unreadCount: foundConversation?.unreadCount,
    };
    return res.status(200).json({ conversation: response });
  }
}

export const ConversationController = new _ConversationController();
