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
const serviceAccountKey_1 = require("../firebseNotification/serviceAccountKey");
const s3upload_core_1 = require("../core/s3upload.core");
const path = require("path");
const fs = require("fs");
const prisma = new client_1.PrismaClient();
const socketIdToUserId = new Map();
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccountKey_1.serviceAccountKey),
    });
}
else {
    firebase_admin_1.default.app();
}
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
const Socket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("send_class_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { classId, userId, message, file, fileName, mimetype } = data;
                let uploadedFileName = null;
                let fileUrl = null;
                if (file && fileName && mimetype) {
                    const fileBuffer = Buffer.from(file, "base64");
                    if (mimetype.startsWith("image/")) {
                        uploadedFileName = yield (0, s3upload_core_1.GetUploadedFile)({ buffer: fileBuffer, mimetype });
                    }
                    else if (mimetype.startsWith("video/")) {
                        uploadedFileName = yield (0, s3upload_core_1.GetUploadedVideo)({ buffer: fileBuffer, mimetype });
                    }
                    else {
                        uploadedFileName = yield (0, s3upload_core_1.GetUploadedDocument)({ buffer: fileBuffer, mimetype });
                    }
                    fileUrl = yield (0, s3upload_core_1.getObjectSignedUrl)(uploadedFileName);
                }
                const messageData = {
                    classId,
                    userId,
                    message,
                    isPinned: false,
                    image: (mimetype === null || mimetype === void 0 ? void 0 : mimetype.startsWith("image/")) ? fileUrl : null,
                    video: (mimetype === null || mimetype === void 0 ? void 0 : mimetype.startsWith("video/")) ? fileUrl : null,
                    document: mimetype && !mimetype.startsWith("image/") && !mimetype.startsWith("video/")
                        ? fileUrl
                        : null,
                };
                const createdMessage = yield prisma.classMessage.create({
                    data: messageData,
                });
                io.to(classId.toString()).emit("receive_class_message", createdMessage);
            }
            catch (error) {
                console.error("Error handling send_class_message event:", error);
            }
        }));
        socket.on("join_room", (classId) => {
            socket.join(classId.toString());
            console.log(`User ${socket.id} joined room ${classId}`);
        });
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
        }));
        socket.on("leave_room", (classId) => {
            socket.leave(classId.toString());
            console.log(`User ${socket.id} left room ${classId}`);
        });
    });
};
exports.default = Socket;
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
