"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const chatRoutes = express_1.default.Router();
//------------ Chat ----------------
chatRoutes.get("/getAllChatsByUser", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), chat_controller_1.ChatController.getAllChatsByUser);
chatRoutes.get("/getAllSearchableUsers", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), chat_controller_1.ChatController.getAllSearchableUsers);
chatRoutes.post("/createChat", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), chat_controller_1.ChatController.createChat);
//------------ Message ----------------
chatRoutes.post("/createMessage", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), chat_controller_1.ChatController.createMessage);
chatRoutes.get("/getAllMessageByChat", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), chat_controller_1.ChatController.getAllMessageByChat);
exports.default = chatRoutes;
