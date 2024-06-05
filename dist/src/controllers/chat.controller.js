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
exports.ChatController = void 0;
const chat_service_1 = require("../services/chat.service");
const user_service_1 = require("../services/user.service");
const notification_service_1 = require("../services/notification.service");
const api_constant_1 = require("../constant/api.constant");
const chat_validator_1 = require("../validators/chat.validator");
class _ChatController {
    createChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { participants } = req.body;
                const validation = chat_validator_1.chatSchema.validate(req.body);
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                const foundChat = yield chat_service_1.ChatService.getOneChat({
                    OR: [
                        { participantOneId: participants[0], participantTwoId: participants[1] },
                        { participantOneId: participants[1], participantTwoId: participants[0] },
                    ],
                });
                if (foundChat)
                    return res.status(400).json({ message: api_constant_1.errorMessage.EXISTING_DATA, data: foundChat });
                const created = yield chat_service_1.ChatService.createOneChat(participants, "UNLIMITED");
                return res.status(201).json({ message: api_constant_1.successMessages.CREATED, data: created });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllChatsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
                const take = Number(req.query.per_page) || 10;
                const { id } = res.locals.user;
                const foundChat = yield chat_service_1.ChatService.getAllChat({
                    OR: [{ participantOneId: id }, { participantTwoId: id }],
                }, skip, take);
                const finalData = [];
                for (let i = 0; i < foundChat.length; i++) {
                    const ele = foundChat[i];
                    const saveObj = {};
                    saveObj.id = ele.id;
                    saveObj.unreadCount = ele.unreadCount;
                    saveObj.pendingAllowed = ele.pendingAllowed;
                    saveObj.participants = [ele.participantOne, ele.participantTwo];
                    const foundMessages = yield chat_service_1.ChatService.getAllMessageForChat({
                        chatId: ele.id,
                    });
                    saveObj.messages = foundMessages;
                    finalData.push(saveObj);
                }
                return res.status(200).json({ message: api_constant_1.successMessages.SUCCESS, chats: finalData });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllSearchableUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (Number(req.query.page) - 1) * Number(req.query.per_page) || 0;
                const take = Number(req.query.per_page) || 10;
                const allUser = yield user_service_1.UserService.getAllUser(skip, take);
                return res.status(200).json({ message: api_constant_1.successMessages.SUCCESS, contacts: allUser });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    createMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, senderId, message, contentType } = req.body;
                const validation = chat_validator_1.chatSchema.validate(req.body);
                if (validation.error) {
                    return res.status(400).json({ error: validation.error.details[0].message });
                }
                const { isCreator, firstName, lastName } = res.locals.user;
                const foundChat = yield chat_service_1.ChatService.getOneChat({ id: chatId });
                if (!foundChat)
                    return res.status(400).json({ message: api_constant_1.errorMessage.NOT_FOUND });
                if (!isCreator && foundChat.pendingAllowed === 0)
                    return res.status(api_constant_1.errorCode.GENERIC).json({ message: api_constant_1.errorMessage.LIMIT_EXHAUSTED });
                const createdChat = yield chat_service_1.ChatService.createOneMessage({
                    chatId,
                    senderId,
                    message,
                    contentType,
                });
                yield chat_service_1.ChatService.updateOneChat({ id: chatId }, { pendingAllowed: isCreator ? foundChat.pendingAllowed : foundChat.pendingAllowed - 1 });
                if (isCreator)
                    yield notification_service_1.NotificationService.createOneNotification({
                        aboutUserId: senderId,
                        notifiedUserId: foundChat.participantOneId === senderId
                            ? foundChat.participantTwoId
                            : foundChat.participantOneId,
                        message: `You have a new message from ${firstName + " " + lastName}`,
                        type: "MESSAGE",
                    });
                return res.status(201).json({ message: api_constant_1.successMessages.SUCCESS, data: createdChat });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
    getAllMessageByChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const foundChat = yield chat_service_1.ChatService.getOneChat({ id: id });
                const participants = [foundChat === null || foundChat === void 0 ? void 0 : foundChat.participantOne, foundChat === null || foundChat === void 0 ? void 0 : foundChat.participantTwo];
                const found = yield chat_service_1.ChatService.getAllMessageForChat({
                    chatId: id,
                });
                const response = {
                    id,
                    participants,
                    messages: found,
                    type: foundChat === null || foundChat === void 0 ? void 0 : foundChat.type,
                    unreadCount: foundChat === null || foundChat === void 0 ? void 0 : foundChat.unreadCount,
                };
                return res.status(200).json({ message: api_constant_1.successMessages.SUCCESS, chat: response });
            }
            catch (error) {
                console.log("ERROR: ", error);
                return res
                    .status(api_constant_1.errorCode.INTERNAL_SERVER)
                    .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
            }
        });
    }
}
exports.ChatController = new _ChatController();
