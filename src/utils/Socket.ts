import { PrismaClient } from "@prisma/client";
import firebase from "firebase-admin";
import { serviceAccountKey } from "../firebseNotification/serviceAccountKey";
import {
  GetUploadedFile,
  GetUploadedVideo,
  GetUploadedDocument,
  getObjectSignedUrl,
} from "../core/s3upload.core";

const prisma = new PrismaClient();
const socketIdToUserId = new Map<string, number>();

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccountKey),
  });
} else {
  firebase.app();
}

const Socket = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (classId: number) => {
      socket.join(classId.toString());
      console.log(`User ${socket.id} joined room ${classId}`);
    });

    socket.on("send_class_message", async (data: any) => {
      try {
        const { classId, userId, message, image, video, document } = data;

        if (!classId || !userId || (!message && !image && !video && !document)) {
          console.error("Invalid data received:", data);
          return;
        }

        const payload = { classId, userId, message, image, video, document };

        if (image) payload.image = await GetUploadedFile(image);
        if (video) payload.video = await GetUploadedVideo(video);
        if (document) payload.document = await GetUploadedDocument(document);

        const createdMessage = await prisma.classMessage.create({ data: payload });
        if (createdMessage?.image)
          createdMessage.image = await getObjectSignedUrl(createdMessage.image);
        if (createdMessage?.video)
          createdMessage.video = await getObjectSignedUrl(createdMessage.video);
        if (createdMessage?.document)
          createdMessage.document = await getObjectSignedUrl(createdMessage.document);

        io.to(classId.toString()).emit("receive_class_message", createdMessage);
      } catch (error) {
        console.error("Error handling send_class_message event:", error);
      }
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
  console.log("Notification data received:", notificationData);

  try {
    const findUser = await prisma.user.findUnique({
      where: { id: notificationData.userId },
    });

    console.log(findUser, "asdasdf");
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
