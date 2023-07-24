import express from "express";
import { ChatController } from "../controllers/chat.controller";
import fetchUser from "../middlewares/fetchUser.middleware";

const chatRoutes = express.Router();

//------------ Chat ----------------

chatRoutes.get("/getAllChatsByUser", fetchUser, ChatController.getAllChatsByUser);
chatRoutes.get("/getAllChatUsers", fetchUser, ChatController.getAllChatUsers);
chatRoutes.post("/createChat", fetchUser, ChatController.createChat);

//------------ Message ----------------

chatRoutes.post("/createMessage", fetchUser, ChatController.createMessage);
chatRoutes.get("/getAllMessageByChat", fetchUser, ChatController.getAllMessageByChat);

export default chatRoutes;
