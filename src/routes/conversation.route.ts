import express from "express";
import { ConversationController } from "../controllers/conversation.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";

const conversationRoutes = express.Router();

//------------ Conversation ----------------

conversationRoutes.get(
  "/getAllConversationsByUser",
  checkRoleAuth(),
  ConversationController.getAllConversationsByUser,
);

conversationRoutes.get(
  "/getAllSearchableUsers",
  checkRoleAuth(),
  ConversationController.getAllSearchableUsers,
);

conversationRoutes.post(
  "/createConversation",
  checkRoleAuth(),
  ConversationController.createConversation,
);

//------------ Message ----------------

conversationRoutes.post("/createMessage", checkRoleAuth(), ConversationController.createMessage);

conversationRoutes.get(
  "/getAllMessageByConversation",
  checkRoleAuth(),
  ConversationController.getAllMessageByConversation,
);

export default conversationRoutes;
