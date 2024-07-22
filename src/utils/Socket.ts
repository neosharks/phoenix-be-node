import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const socketIdToUserId = new Map<string, number>();
import firebase from "firebase-admin";
import { serviceAccountKey } from "../firebseNotification/serviceAccountKey";

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

    // Handle join room event
    socket.on("join_room", (chatId: number) => {
      socket.join(chatId.toString());
      console.log(`User ${socket.id} joined room ${chatId}`);
    });

    // Handle leave room event
    socket.on("leave_room", (chatId: number) => {
      socket.leave(chatId.toString());
      console.log(`User ${socket.id} left room ${chatId}`);
    });

    // Handle join chat event
    socket.on("join_chat", (userId: number) => {
      socket.join(userId.toString());
      console.log(`User ${socket.id} joined chat ${userId}`);
    });

    // Handle leave chat event
    socket.on("leave_chat", (userId: number) => {
      socket.leave(userId.toString());
      console.log(`User ${socket.id} left chat ${userId}`);
    });

    // Handle typing events
    socket.on("is_typing", ({ roomId, userId }: { roomId: number; userId: number }) => {
      io.to(roomId.toString()).emit("user_typing", { userId });
    });

    socket.on("stop_typing", ({ roomId, userId }: { roomId: number; userId: number }) => {
      io.to(roomId.toString()).emit("user_stopped", { userId });
    });

    // Handle send message event
    socket.on("send_message", async (data: MessageData) => {
      try {
        console.log("send_message", data.userId);
        io.to(data.chatId.toString()).emit("send_message", data);
        io.to(data.userId.toString()).emit("new_chat", data.roomData);
        await sendNotification(data);
      } catch (error) {
        console.error("Error handling send_message event:", error);
      }
    });

    // Handle class message event
    socket.on("send_class_message", async (data: any) => {
      console.log("send_class_message", data.userId);
      io.to(data.classId.toString()).emit("send_class_message", data);
      io.to(data.userId.toString()).emit("new_class_chat", data.roomData);
    });

    // Handle message event
    socket.on("message", async (data: MessageData) => {
      const { classId, userId, message, image, video, document } = data;

      // Store message in the database
      const createdMessage = await prisma.classMessage.create({
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
    });

    // Handle user online event
    socket.on("user_online", async ({ userId }: { userId: number }) => {
      try {
        const user = await prisma.user.update({
          where: { id: userId },
          data: { online: true },
        });
        socketIdToUserId.set(socket.id, userId);
        io.emit("user_online", { userId: user.id, online: true });
        console.log(userId, "+++user online success+++");
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    });

    // Handle disconnect event
    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);
      const userId = socketIdToUserId.get(socket.id);
      if (userId) {
        try {
          const user = await prisma.user.update({
            where: { id: userId },
            data: { online: false, lastSeen: new Date() },
          });
          io.emit("user_online", { userId: user.id, online: false, lastSeen: user.lastSeen });
          console.log("User disconnected successfully.");
        } catch (error) {
          console.error("Error updating user status:", error);
        }
      }
    });
  });
};

export default Socket;

// Notification function
const sendNotification = async (notificationData: any) => {
  console.log("Notification data received:", notificationData);

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
