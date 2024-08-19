import { PrismaClient } from "@prisma/client";
import firebase from "firebase-admin";
import { serviceAccountKey } from "../firebseNotification/serviceAccountKey";
import { getObjectSignedUrl } from "../core/s3upload.core";

const prisma = new PrismaClient();
const socketIdToUserId = new Map<string, number>();

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccountKey),
  });
} else {
  firebase.app();
}

interface MessageData {
  message: string;
  classId: number;
  userId: number;
  image?: string;
  video?: string;
  document?: string;
  replyToMessageId?: number | null;
}

const Socket = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", async (classId: any) => {
      socket.join(classId);
      console.log(`User ${socket.id} joined room ${classId}`);
    });

    socket.on("leave_room", (classId: any) => {
      socket.leave(classId);
      console.log(`User ${socket.id} left room ${classId}`);
    });

    socket.on("send_class_message", async (data: any) => {
      const { classId, userId, message, replyTo, file } = data;
      let fileUrl = null;

      if (file) {
        // Handle file upload to S3 or local storage and get the file URL
        // For example purposes, assuming file is saved and URL is assigned to fileUrl
      }

      const newMessage = await prisma.classMessage.create({
        data: {
          userId,
          message,
          image: fileUrl, // You can choose to save the appropriate URL based on file type
          classId,
          replyToMessageId: replyTo,
        },
      });

      io.to(classId).emit("receive_class_message", newMessage);
    });

    socket.on("update_message", async ({ messageId, isPinned }: any) => {
      const updatedMessage = await prisma.classMessage.update({
        where: { id: messageId },
        data: { isPinned },
      });

      io.emit("message_updated", updatedMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
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
