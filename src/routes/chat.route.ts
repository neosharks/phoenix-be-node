import express from "express";
import { ChatController } from "../controllers/chat.controller";

const chatRoutes = express.Router();

chatRoutes.post("/create", ChatController.createChat);

export default chatRoutes;
