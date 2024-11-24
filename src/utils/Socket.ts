import { PrismaClient } from "@prisma/client";
import { Socket, Server } from "socket.io";

const prisma = new PrismaClient();

const roomUserCount = new Map<string, Set<string>>(); // roomId -> Set of socketIds
const socketIdToUserId = new Map<string, string>(); // socketId -> userId

// Helper function for common error handling
const handleError = (socket: Socket, message: string) => {
  console.error(message);
  socket.emit("ERROR", { message });
};

// Handle user connection
const handleUserConnection = (socket: Socket, io: Server) => {
  console.log("New connected:", socket.id);
  // --------
  socket.on("JOIN_ROOM", handleJoinRoom(socket, io));
  socket.on("SEND_CLASS_MESSAGE", handleSendClassMessage(socket, io));
  socket.on("UPDATE_MESSAGE", handleUpdateMessage(socket, io));
  socket.on("DELETE_MESSAGE", handleDeleteMessage(socket, io));
  socket.on("DISCONNECT", handleDisconnect(socket, io));
  socket.on("LEAVE_ROOM", handleLeaveRoom(socket, io));
  socket.on("TYPING", handleTyping(socket, io));
};

// Handle joining a room
const handleJoinRoom = (socket: Socket, io: Server) => async (classId: number) => {
  const roomId = classId.toString();
  socket.join(roomId);
  console.log(`User ${socket.id} joined room ${classId}`);

  // Initialize room if it's the first user
  if (!roomUserCount.has(roomId)) roomUserCount.set(roomId, new Set());
  roomUserCount.get(roomId)?.add(socket.id);

  // Get the list of active users in the room
  const activeUsers = Array.from(roomUserCount.get(roomId)?.values() || []);
  const userCount = activeUsers.length;

  // Emit the user count and the list of active users to the room
  io.to(roomId).emit("CLASS_USER_COUNT", userCount);
  io.to(roomId).emit("ACTIVE_USERS", activeUsers);

  // Emit user status update for the newly joined user
  io.to(roomId).emit("USER_STATUS_UPDATE", { userId: socket.id, isOnline: true });
};

const handleSendClassMessage = (socket: Socket, io: Server) => async (data: any) => {
  try {
    const { classId, userId, message, image, video, document, audio, repliedMessageId } = data;

    if (!classId || !userId || (!message && !image && !video && !document && !audio))
      return handleError(socket, "Invalid data received");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return handleError(socket, "User not found");

    const classExists = await prisma.class.findUnique({ where: { id: classId } });
    if (!classExists) return handleError(socket, "Class not found");

    const createdMessage = await prisma.classMessage.create({
      data: {
        classId,
        userId,
        message,
        image: image || null,
        video: video || null,
        document: document || null,
        audio: audio || null,
        repliedMessageId: repliedMessageId || null,
      },
      include: { repliedMessage: true },
    });

    io.to(classId.toString()).emit("RECEIVE_CLASS_MESSAGE", createdMessage);
  } catch (error) {
    console.error("Error handling SEND_CLASS_MESSAGE event:", error);
    handleError(socket, "An error occurred while sending the message");
  }
};

const handleUpdateMessage = (socket: Socket, io: Server) => async (recivedData: any) => {
  const { messageId, data } = recivedData;
  try {
    const updatedMessage = await prisma.classMessage.update({
      where: { id: messageId },
      data,
    });

    io.to(updatedMessage.classId.toString()).emit("MESSAGE_UPDATED", {
      messageId: updatedMessage.id,
      data,
    });
  } catch (error) {
    console.error("Error updating message:", error);
  }
};

const handleDeleteMessage = (socket: Socket, io: Server) => async (recivedData: any) => {
  const { messageId } = recivedData;
  try {
    const updatedMessage = await prisma.classMessage.delete({
      where: { id: messageId },
    });
    io.to(updatedMessage.classId.toString()).emit("MESSAGE_DELETED", {
      messageId: updatedMessage.id,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};

const handleDisconnect = (socket: Socket, io: Server) => async () => {
  console.log("Socket disconnected:", socket.id);
  const userId = socketIdToUserId.get(socket.id);

  if (userId) {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { online: false },
    });
    socketIdToUserId.delete(socket.id);
    io.emit("USER_STATUS_UPDATE", { userId, isOnline: false });
  }

  roomUserCount.forEach((users, roomId) => {
    if (users.has(socket.id)) {
      users.delete(socket.id);
      const userCount = users.size;
      io.to(roomId).emit("CLASS_USER_COUNT", userCount);
    }
  });
};

const handleLeaveRoom = (socket: Socket, io: Server) => (classId: number) => {
  const roomId = classId.toString();
  socket.leave(roomId);
  console.log(`User ${socket.id} left room ${classId}`);

  // Remove the user from the room
  roomUserCount.get(roomId)?.delete(socket.id);

  // Get the updated list of active users in the room
  const activeUsers = Array.from(roomUserCount.get(roomId)?.values() || []);
  const userCount = activeUsers.length;

  // Emit the user count and the list of active users to the room
  io.to(roomId).emit("CLASS_USER_COUNT", userCount);
  io.to(roomId).emit("ACTIVE_USERS", activeUsers);

  // Emit user status update for the user who left
  io.to(roomId).emit("USER_STATUS_UPDATE", { userId: socket.id, isOnline: false });
};

const handleTyping =
  (socket: Socket, io: Server) => (data: { classId: number; isTyping: boolean }) => {
    const { classId, isTyping } = data;
    io.to(classId.toString()).emit("USER_TYPING", { userId: socket.id, isTyping });
  };

export const SocketConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => handleUserConnection(socket, io));
};

export default SocketConnection;
