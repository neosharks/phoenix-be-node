"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationController = void 0;
const conversation_service_1 = require("../services/conversation.service");
const user_service_1 = require("../services/user.service");
class _ConversationController {
    createConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { participants } = req.body;
            const foundConversation = yield conversation_service_1.ConversationService.getOneConversation({
                OR: [
                    { participantOneId: participants[0], participantTwoId: participants[1] },
                    { participantOneId: participants[1], participantTwoId: participants[0] },
                ],
            });
            if (foundConversation)
                return res
                    .status(400)
                    .json({ message: "conversation already exists", data: foundConversation });
            const created = yield conversation_service_1.ConversationService.createOneConversation(participants);
            return res.status(201).json({ message: "Success", data: created });
        });
    }
    getAllConversationsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = res.locals.user;
            const foundConversation = yield conversation_service_1.ConversationService.getAllConversation({
                OR: [{ participantOneId: id }, { participantTwoId: id }],
            });
            const finalData = [];
            for (let i = 0; i < foundConversation.length; i++) {
                const ele = foundConversation[i];
                const saveObj = {};
                saveObj.id = ele.id;
                saveObj.unreadCount = ele.unreadCount;
                saveObj.participants = [ele.participantOne, ele.participantTwo];
                const foundMessages = yield conversation_service_1.ConversationService.getAllMessageForConversation({
                    conversationId: ele.id,
                });
                saveObj.messages = foundMessages;
                finalData.push(saveObj);
            }
            return res.status(200).json({ conversations: finalData });
        });
    }
    getAllSearchableUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUser = yield user_service_1.UserService.getAllUser();
            return res.status(200).json({ contacts: allUser });
        });
    }
    createMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conversationId, senderId, message, contentType } = req.body;
            const createdConversation = yield conversation_service_1.ConversationService.createOneMessage({
                conversationId,
                senderId,
                message,
                contentType,
            });
            return res.status(201).json({ message: "Success", data: createdConversation });
        });
    }
    getAllMessageByConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            const foundConversation = yield conversation_service_1.ConversationService.getOneConversation({ id: id });
            const participants = [foundConversation === null || foundConversation === void 0 ? void 0 : foundConversation.participantOne, foundConversation === null || foundConversation === void 0 ? void 0 : foundConversation.participantTwo];
            const found = yield conversation_service_1.ConversationService.getAllMessageForConversation({
                conversationId: id,
            });
            const response = {
                id,
                participants,
                messages: found,
                type: foundConversation === null || foundConversation === void 0 ? void 0 : foundConversation.type,
                unreadCount: foundConversation === null || foundConversation === void 0 ? void 0 : foundConversation.unreadCount,
            };
            return res.status(200).json({ conversation: response });
        });
    }
}
exports.ConversationController = new _ConversationController();
