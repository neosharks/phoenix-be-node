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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const socketIdToUserId = new Map();
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccountKey_1 = require("../firebseNotification/serviceAccountKey");
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccountKey_1.serviceAccountKey),
    });
}
else {
    firebase_admin_1.default.app();
}
const Socket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        // Handle join room event
        socket.on("join_room", (chatId) => {
            socket.join(chatId.toString());
            console.log(`User ${socket.id} joined room ${chatId}`);
        });
        // Handle leave room event
        socket.on("leave_room", (chatId) => {
            socket.leave(chatId.toString());
            console.log(`User ${socket.id} left room ${chatId}`);
        });
        // Handle join chat event
        socket.on("join_chat", (userId) => {
            socket.join(userId.toString());
            console.log(`User ${socket.id} joined chat ${userId}`);
        });
        // Handle leave chat event
        socket.on("leave_chat", (userId) => {
            socket.leave(userId.toString());
            console.log(`User ${socket.id} left chat ${userId}`);
        });
        // Handle typing events
        socket.on("is_typing", ({ roomId, userId }) => {
            io.to(roomId.toString()).emit("user_typing", { userId });
        });
        socket.on("stop_typing", ({ roomId, userId }) => {
            io.to(roomId.toString()).emit("user_stopped", { userId });
        });
        // Handle send message event
        socket.on("send_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log("send_message", data.userId);
                io.to(data.chatId.toString()).emit("send_message", data);
                io.to(data.userId.toString()).emit("new_chat", data.roomData);
                yield sendNotification(data);
            }
            catch (error) {
                console.error("Error handling send_message event:", error);
            }
        }));
        // Handle class message event
        socket.on("send_class_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("send_class_message", data.userId);
            io.to(data.classId.toString()).emit("send_class_message", data);
            io.to(data.userId.toString()).emit("new_class_chat", data.roomData);
        }));
        // Handle message event
        socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { classId, userId, message, image, video, document } = data;
            // Store message in the database
            const createdMessage = yield prisma.classMessage.create({
                data: {
                    classId,
                    userId,
                    message,
                    image,
                    video,
                    document,
                },
            });
            // Emit message to the room
            io.to(classId.toString()).emit("receive_message", createdMessage);
        }));
        // Handle user online event
        socket.on("user_online", (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
            try {
                const user = yield prisma.user.update({
                    where: { id: userId },
                    data: { online: true },
                });
                socketIdToUserId.set(socket.id, userId);
                io.emit("user_online", { userId: user.id, online: true });
                console.log(userId, "+++user online success+++");
            }
            catch (error) {
                console.error("Error updating user status:", error);
            }
        }));
        // Handle disconnect event
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Socket disconnected:", socket.id);
            const userId = socketIdToUserId.get(socket.id);
            if (userId) {
                try {
                    const user = yield prisma.user.update({
                        where: { id: userId },
                        data: { online: false, lastSeen: new Date() },
                    });
                    io.emit("user_online", { userId: user.id, online: false, lastSeen: user.lastSeen });
                    console.log("User disconnected successfully.");
                }
                catch (error) {
                    console.error("Error updating user status:", error);
                }
            }
        }));
    });
};
exports.default = Socket;
// Notification function
const sendNotification = (notificationData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Notification data received:", notificationData);
    try {
        const findUser = yield prisma.user.findUnique({
            where: { id: notificationData.userId },
        });
        if (findUser === null || findUser === void 0 ? void 0 : findUser.fcmToken) {
            const notificationPayload = {
                roomId: notificationData.chatId,
                roomName: findUser.username,
                receiverIds: notificationData.userId,
                type: notificationData.roomData.type,
            };
            const res = yield firebase_admin_1.default.messaging().send({
                token: findUser.fcmToken,
                notification: {
                    title: "New Message",
                    body: notificationData.text,
                },
                data: {
                    notification_type: "chat",
                    navigationId: "messages",
                    data: JSON.stringify(notificationPayload),
                },
            });
            console.log("Notification sent successfully:", res);
        }
    }
    catch (error) {
        console.error("Notification failed:", error);
    }
});
