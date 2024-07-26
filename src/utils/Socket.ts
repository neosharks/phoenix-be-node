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

interface MessageData {
  message: string;
  classId: number;
  chatId: number;
  userId: number;
  text: string;
  roomData: any;
  image: string;
  video: string;
  document: string;
}

const Socket = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (classId: number) => {
      socket.join(classId.toString());
      console.log(`User ${socket.id} joined room ${classId}`);
    });

    socket.on("send_class_message", async (data: MessageData) => {
      try {
        if (
          !data.classId ||
          !data.userId ||
          (!data.message && !data.image && !data.video && !data.document)
        ) {
          console.error("Invalid data received:", data);
          return;
        }

        const imageUrl = data.image ? await GetUploadedFile(data.image) : null;
        const videoUrl = data.video ? await GetUploadedVideo(data.video) : null;
        const documentUrl = data.document ? await GetUploadedDocument(data.document) : null;

        const createdMessage = await prisma.classMessage.create({
          data: {
            classId: data.classId,
            userId: data.userId,
            message: data.message,
            image: imageUrl,
            video: videoUrl,
            document: documentUrl,
          },
        });

        if (createdMessage?.image)
          createdMessage.image = await getObjectSignedUrl(createdMessage.image);
        if (createdMessage?.video)
          createdMessage.video = await getObjectSignedUrl(createdMessage.video);
        if (createdMessage?.document)
          createdMessage.document = await getObjectSignedUrl(createdMessage.document);

        io.to(data.classId.toString()).emit("receive_class_message", createdMessage);
        sendNotification(createdMessage);
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
