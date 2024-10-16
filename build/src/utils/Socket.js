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
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccountKey_1 = require("../firebaseNotification/serviceAccountKey");
const prisma = new client_1.PrismaClient();
const socketIdToUserId = new Map();
const roomUserCount = new Map(); // Track users in rooms
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
        socket.on("join_room", (classId) => {
            var _a, _b;
            const roomId = classId.toString();
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${classId}`);
            if (!roomUserCount.has(roomId)) {
                roomUserCount.set(roomId, new Set());
            }
            (_a = roomUserCount.get(roomId)) === null || _a === void 0 ? void 0 : _a.add(socket.id);
            const userCount = ((_b = roomUserCount.get(roomId)) === null || _b === void 0 ? void 0 : _b.size) || 0;
            io.to(roomId).emit("user_count", userCount);
        });
        socket.on("send_class_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!data.classId ||
                    !data.userId ||
                    (!data.message && !data.image && !data.video && !data.document)) {
                    console.error("Invalid data received:", data);
                    socket.emit("error", { message: "Invalid data received" });
                    return;
                }
                const findUser = yield prisma.user.findUnique({
                    where: { id: data.userId },
                });
                if (!findUser) {
                    console.error("User not found:", data.userId);
                    socket.emit("error", { message: "User not found" });
                    return;
                }
                const classExists = yield prisma.class.findUnique({
                    where: { id: data.classId },
                });
                if (!classExists) {
                    console.error("Class not found:", data.classId);
                    socket.emit("error", { message: "Class not found" });
                    return;
                }
                const createdMessage = yield prisma.classMessage.create({
                    data: {
                        classId: data.classId,
                        userId: data.userId,
                        message: data.message,
                        image: data.image || null,
                        video: data.video || null,
                        document: data.document || null,
                        repliedMessageId: data.repliedMessageId || null,
                    },
                    include: {
                        repliedMessage: true,
                    },
                });
                io.to(data.classId.toString()).emit("receive_class_message", createdMessage);
                sendNotification(createdMessage);
            }
            catch (error) {
                console.error("Error handling send_class_message event:", error);
                socket.emit("error", { message: "An error occurred while sending the message" });
            }
        }));
        socket.on("update_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const updatedMessage = yield prisma.classMessage.update({
                    where: { id: data.messageId },
                    data: { isPinned: data.isPinned },
                });
                io.to(updatedMessage.classId.toString()).emit("message_updated", {
                    messageId: updatedMessage.id,
                    isPinned: updatedMessage.isPinned,
                });
            }
            catch (error) {
                console.error("Error updating message:", error);
            }
        }));
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Socket disconnected:", socket.id);
            const userId = socketIdToUserId.get(socket.id);
            if (userId) {
                yield prisma.user.update({
                    where: { id: userId },
                    data: { online: false },
                });
                socketIdToUserId.delete(socket.id);
                io.emit("user_status_update", { userId, isOnline: false });
            }
            roomUserCount.forEach((users, roomId) => {
                if (users.has(socket.id)) {
                    users.delete(socket.id);
                    const userCount = users.size;
                    io.to(roomId).emit("user_count", userCount);
                }
            });
        }));
        socket.on("leave_room", (classId) => {
            var _a, _b;
            const roomId = classId.toString();
            socket.leave(roomId);
            console.log(`User ${socket.id} left room ${classId}`);
            (_a = roomUserCount.get(roomId)) === null || _a === void 0 ? void 0 : _a.delete(socket.id);
            const userCount = ((_b = roomUserCount.get(roomId)) === null || _b === void 0 ? void 0 : _b.size) || 0;
            io.to(roomId).emit("user_count", userCount);
        });
    });
};
exports.default = Socket;
// Function to send notifications
const sendNotification = (notificationData) => __awaiter(void 0, void 0, void 0, function* () {
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
