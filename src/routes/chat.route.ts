import express from "express";
import { ChatController } from "../controllers/chat.controller";

const chatRoutes = express.Router();

//------------ Chat ----------------

chatRoutes.get("/getAllChatsByUser", ChatController.getAllChatsByUser);
chatRoutes.post("/createChat", ChatController.createChat);

//------------ Message ----------------

chatRoutes.post("/createMessage", ChatController.createMessage);
chatRoutes.get("/getAllMessageByChat", ChatController.getAllMessageByChat);

export default chatRoutes;
