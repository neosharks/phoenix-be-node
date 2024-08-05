import { PrismaClient } from "@prisma/client";
import firebase from "firebase-admin";
import { serviceAccountKey } from "../firebseNotification/serviceAccountKey";
import {
  GetUploadedFile,
  GetUploadedVideo,
  GetUploadedDocument,
  getObjectSignedUrl,
} from "../core/s3upload.core";
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();
const socketIdToUserId = new Map<string, number>();

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccountKey),
  });
} else {
  firebase.app();
}

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const Socket = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    socket.on("send_class_message", async (data: any) => {
      try {
        const { classId, userId, message, file, fileName, mimetype } = data;

        let uploadedFileName: string | null = null;
        let fileUrl: string | null = null;

        if (file && fileName && mimetype) {
          const fileBuffer = Buffer.from(file, "base64");

          if (mimetype.startsWith("image/")) {
            uploadedFileName = await GetUploadedFile({ buffer: fileBuffer, mimetype });
          } else if (mimetype.startsWith("video/")) {
            uploadedFileName = await GetUploadedVideo({ buffer: fileBuffer, mimetype });
          } else {
            uploadedFileName = await GetUploadedDocument({ buffer: fileBuffer, mimetype });
          }

          fileUrl = await getObjectSignedUrl(uploadedFileName);
        }

        const messageData = {
          classId,
          userId,
          message,
          isPinned: false,
          image: mimetype?.startsWith("image/") ? fileUrl : null,
          video: mimetype?.startsWith("video/") ? fileUrl : null,
          document:
            mimetype && !mimetype.startsWith("image/") && !mimetype.startsWith("video/")
              ? fileUrl
              : null,
        };

        const createdMessage = await prisma.classMessage.create({
          data: messageData,
        });

        io.to(classId.toString()).emit("receive_class_message", createdMessage);
      } catch (error) {
        console.error("Error handling send_class_message event:", error);
      }
    });

    socket.on("join_room", (classId: number) => {
      socket.join(classId.toString());
      console.log(`User ${socket.id} joined room ${classId}`);
    });

    socket.on("update_message", async (data: { messageId: number; isPinned: boolean }) => {
      try {
        const updatedMessage = await prisma.classMessage.update({
          where: { id: data.messageId },
          data: { isPinned: data.isPinned },
        });

        io.to(updatedMessage.classId.toString()).emit("message_updated", {
          messageId: updatedMessage.id,
          isPinned: updatedMessage.isPinned,
        });
      } catch (error) {
        console.error("Error updating message:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);
      const userId = socketIdToUserId.get(socket.id);
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { online: false },
        });
        socketIdToUserId.delete(socket.id);
        io.emit("user_status_update", { userId, isOnline: false });
      }
    });

    socket.on("leave_room", (classId: number) => {
      socket.leave(classId.toString());
      console.log(`User ${socket.id} left room ${classId}`);
    });
  });
};

export default Socket;

const sendNotification = async (notificationData: any) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: { id: notificationData.userId },
    });

    if (findUser?.fcmToken) {
      const notificationPayload = {
        roomId: notificationData.chatId,
        roomName: findUser.username,
        receiverIds: notificationData.userId,
        type: notificationData.roomData.type,
      };

      const res = await firebase.messaging().send({
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
  } catch (error) {
    console.error("Notification failed:", error);
  }
};
