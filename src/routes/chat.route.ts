import express from "express";
import { ChatController } from "../controllers/chat.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";

const chatRoutes = express.Router();

// -----------  GET ----------------

chatRoutes.get("/getAllChatsByUser", checkRoleAuth(), ChatController.getAllChatsByUser);

chatRoutes.get("/getAllSearchableUsers", checkRoleAuth(), ChatController.getAllSearchableUsers);

chatRoutes.get("/getAllMessageByChat", checkRoleAuth(), ChatController.getAllMessageByChat);

// -----------  POST ----------------

chatRoutes.post("/createMessage", checkRoleAuth(), ChatController.createMessage);

chatRoutes.post("/createChat", checkRoleAuth(), ChatController.createChat);

export default chatRoutes;
