"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversation_controller_1 = require("../controllers/conversation.controller");
const checkRoleAuth_middleware_1 = require("../middlewares/checkRoleAuth.middleware");
const conversationRoutes = express_1.default.Router();
//------------ Conversation ----------------
conversationRoutes.get("/getAllConversationsByUser", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), conversation_controller_1.ConversationController.getAllConversationsByUser);
conversationRoutes.get("/getAllSearchableUsers", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), conversation_controller_1.ConversationController.getAllSearchableUsers);
conversationRoutes.post("/createConversation", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), conversation_controller_1.ConversationController.createConversation);
//------------ Message ----------------
conversationRoutes.post("/createMessage", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), conversation_controller_1.ConversationController.createMessage);
conversationRoutes.get("/getAllMessageByConversation", (0, checkRoleAuth_middleware_1.checkRoleAuth)(), conversation_controller_1.ConversationController.getAllMessageByConversation);
exports.default = conversationRoutes;
