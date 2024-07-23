import { PrismaClient } from "@prisma/client";
import firebase from "firebase-admin";
import { serviceAccountKey } from "../firebseNotification/serviceAccountKey";

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

    socket.on("join_room", (chatId: number) => {
      socket.join(chatId.toString());
      console.log(`User ${socket.id} joined room ${chatId}`);
    });

    socket.on("leave_room", (chatId: number) => {
      socket.leave(chatId.toString());
      console.log(`User ${socket.id} left room ${chatId}`);
    });

    socket.on("join_chat", (userId: number) => {
      socket.join(userId.toString());
      console.log(`User ${socket.id} joined chat ${userId}`);
    });

    socket.on("leave_chat", (userId: number) => {
      socket.leave(userId.toString());
      console.log(`User ${socket.id} left chat ${userId}`);
    });

    socket.on("is_typing", ({ roomId, userId }: { roomId: number; userId: number }) => {
      io.to(roomId.toString()).emit("user_typing", { userId });
    });

    socket.on("stop_typing", ({ roomId, userId }: { roomId: number; userId: number }) => {
      io.to(roomId.toString()).emit("user_stopped", { userId });
    });

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

    socket.on("send_class_message", async (data: MessageData) => {
      try {
        // Validate that classId and userId are not null or undefined
        if (!data.classId || !data.userId) {
          console.error("Invalid data received:", data);
          return;
        }

        console.log("send_class_message", data.userId);

        // Emit class message to the class room
        io.to(data.classId.toString()).emit("send_class_message", data);
        // Emit new class chat to the user
        io.to(data.userId.toString()).emit("new_class_chat", data.roomData);
      } catch (error) {
        console.error("Error handling send_class_message event:", error);
      }
    });

    socket.on("message", async (data: MessageData) => {
      const { classId, userId, message, image, video, document } = data;

      try {
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

        io.to(classId.toString()).emit("receive_message", createdMessage);
      } catch (error) {
        console.error("Error creating message:", error);
      }
    });

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

    socket.on("news", async (data: MessageData) => {
      var msg = data + "world";
      socket.emit("news-response", msg);
    });

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
