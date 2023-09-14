import express from "express";
import { ConversationController } from "../controllers/conversation.controller";
import fetchUser from "../middlewares/fetchUser.middleware";

const conversationRoutes = express.Router();

//------------ Conversation ----------------

conversationRoutes.get(
  "/getAllConversationsByUser",
  fetchUser,
  ConversationController.getAllConversationsByUser,
);

conversationRoutes.get(
  "/getAllSearchableUsers",
  fetchUser,
  ConversationController.getAllSearchableUsers,
);

conversationRoutes.post(
  "/createConversation",
  fetchUser,
  ConversationController.createConversation,
);

//------------ Message ----------------

conversationRoutes.post("/createMessage", fetchUser, ConversationController.createMessage);

conversationRoutes.get(
  "/getAllMessageByConversation",
  fetchUser,
  ConversationController.getAllMessageByConversation,
);

export default conversationRoutes;
