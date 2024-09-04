import firebase from "firebase-admin";
import { serviceAccountKey } from "../firebseNotification/serviceAccountKey";
import User from "../models/user.model";
import ClassMessage from "../models/classMessage.model";
import Class from "../models/class.model";
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
        if (
          !data.classId ||
          !data.userId ||
          (!data.message && !data.image && !data.video && !data.document)
        ) {
          console.error("Invalid data received:", data);
          socket.emit("error", { message: "Invalid data received" });
          return;
        }

        const findUser = await User.findByPk(data.userId);

        if (!findUser) {
          console.error("User not found:", data.userId);
          socket.emit("error", { message: "User not found" });
          return;
        }

        const classExists = await Class.findByPk(data.classId);

        if (!classExists) {
          console.error("Class not found:", data.classId);
          socket.emit("error", { message: "Class not found" });
          return;
        }

        const createdMessage = await ClassMessage.create({
          classId: data.classId,
          userId: data.userId,
          message: data.message,
          image: data.image,
          video: data.video,
          document: data.document,
          repliedMessageId: data.repliedMessageId || null,
          isPinned: data.isPinned || false,
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
        const [affectedCount] = await ClassMessage.update(
          { isPinned: data.isPinned },
          { where: { id: data.messageId } },
        );

        if (affectedCount > 0) {
          const updatedMessage = await ClassMessage.findByPk(data.messageId);
          if (updatedMessage) {
            io.to(updatedMessage.classId.toString()).emit("message_updated", {
              messageId: updatedMessage.id,
              isPinned: updatedMessage.isPinned,
            });
          } else {
            console.log(updatedMessage, "updatedMessage not available");
          }
        }
      } catch (error) {
        console.error("Error updating message:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);
      const userId = socketIdToUserId.get(socket.id);
      if (userId) {
        await User.update({ online: false }, { where: { id: userId } });
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
    const findUser = await User.findByPk(notificationData.userId);

    if (findUser?.fcmToken) {
      const notificationPayload = {
        roomId: notificationData.classId,
        roomName: findUser.username,
        receiverIds: notificationData.userId,
        type: notificationData.type,
      };

      const res = await firebase.messaging().send({
        token: findUser.fcmToken,
        notification: {
          title: "New Message",
          body: notificationData.message,
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
