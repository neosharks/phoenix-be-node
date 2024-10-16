import { PrismaClient } from "@prisma/client";
import firebase from "firebase-admin";
import { serviceAccountKey } from "../firebaseNotification/serviceAccountKey";

const prisma = new PrismaClient();
const socketIdToUserId = new Map<string, number>();
const roomUserCount = new Map<string, Set<string>>(); // Track users in rooms

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
      const roomId = classId.toString();
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${classId}`);

      if (!roomUserCount.has(roomId)) {
        roomUserCount.set(roomId, new Set());
      }
      roomUserCount.get(roomId)?.add(socket.id);

      const userCount = roomUserCount.get(roomId)?.size || 0;
      io.to(roomId).emit("user_count", userCount);
    });

    socket.on("send_class_message", async (data: any) => {
      try {
        if (
          !data.classId ||
          !data.userId ||
          (!data.message && !data.image && !data.video && !data.document)
        ) {
          console.error("Invalid data received:", data);
          socket.emit("error", { message: "Invalid data received" });
          return;
        }

        const findUser = await prisma.user.findUnique({
          where: { id: data.userId },
        });

        if (!findUser) {
          console.error("User not found:", data.userId);
          socket.emit("error", { message: "User not found" });
          return;
        }

        const classExists = await prisma.class.findUnique({
          where: { id: data.classId },
        });

        if (!classExists) {
          console.error("Class not found:", data.classId);
          socket.emit("error", { message: "Class not found" });
          return;
        }

        const createdMessage = await prisma.classMessage.create({
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
      } catch (error) {
        console.error("Error handling send_class_message event:", error);
        socket.emit("error", { message: "An error occurred while sending the message" });
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

      roomUserCount.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          const userCount = users.size;
          io.to(roomId).emit("user_count", userCount);
        }
      });
    });

    socket.on("leave_room", (classId: number) => {
      const roomId = classId.toString();
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${classId}`);
      roomUserCount.get(roomId)?.delete(socket.id);
      const userCount = roomUserCount.get(roomId)?.size || 0;
      io.to(roomId).emit("user_count", userCount);
    });
  });
};

export default Socket;

// Function to send notifications
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
