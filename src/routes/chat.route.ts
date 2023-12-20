import express from "express";
import { ChatController } from "../controllers/chat.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";

const chatRoutes = express.Router();

//------------ Chat ----------------

chatRoutes.get("/getAllChatsByUser", checkRoleAuth(), ChatController.getAllChatsByUser);

chatRoutes.get("/getAllSearchableUsers", checkRoleAuth(), ChatController.getAllSearchableUsers);

chatRoutes.post("/createChat", checkRoleAuth(), ChatController.createChat);

//------------ Message ----------------

chatRoutes.post("/createMessage", checkRoleAuth(), ChatController.createMessage);

chatRoutes.get("/getAllMessageByChat", checkRoleAuth(), ChatController.getAllMessageByChat);

export default chatRoutes;
