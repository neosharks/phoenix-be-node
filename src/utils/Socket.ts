import { PrismaClient } from "@prisma/client";
import { Socket, Server } from "socket.io";
import { UserService } from "../services/user.service";
import { verifyJwt } from "../core/jwt.core";

const prisma = new PrismaClient();
const roomUserCount = new Map<string, Set<string>>(); // roomId -> Set of socketIds

// Helper function for common error handling
const handleError = (socket: Socket, message: string) => {
  console.error(message);
  socket.emit("ERROR", { message });
};

// Handle user connection
const handleUserConnection = async (socket: Socket, io: Server) => {
  try {
    const token = socket?.handshake?.auth?.token;
    if (!token) {
      socket.disconnect();
      throw new Error("Authentication failed: Token is required.");
    }

    const { decoded }: any = verifyJwt(token);
    if (!decoded) {
      socket.disconnect();
      throw new Error("Authentication failed: Invalid token.");
    }

    const { id } = decoded;
    const foundUser = await UserService.getOneUser({ id });
    if (!foundUser) {
      socket.disconnect();
      throw new Error("Authentication failed: User not found.");
    }

    // Attach user data to the socket
    socket.data.user = {
      id: foundUser.id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      username: foundUser.username,
      profileImage: foundUser.profileImage,
    };

    console.log(`New connection: ${socket.id}, User: ${socket.data.user.id}`);

    // Bind event handlers
    socket.on("JOIN_ROOM", (classId: number) => handleJoinRoom(socket, io, classId));
    socket.on("SEND_CLASS_MESSAGE", (data: any) => handleSendClassMessage(socket, io, data));
    socket.on("UPDATE_MESSAGE", (data: any) => handleUpdateMessage(socket, io, data));
    socket.on("DELETE_MESSAGE", (data: any) => handleDeleteMessage(socket, io, data));
    socket.on("DISCONNECT", () => handleDisconnect(socket, io));
    socket.on("LEAVE_ROOM", (classId: number) => handleLeaveRoom(socket, io, classId));
    socket.on("TYPING", (data: { classId: number; isTyping: boolean }) =>
      handleTyping(socket, io, data),
    );
  } catch (error: any) {
    console.error(`Error during connection handling: ${error.message}`);
  }
};

// Handle joining a room
const handleJoinRoom = async (socket: Socket, io: Server, classId: number) => {
  try {
    const user = socket.data.user;
    if (!user) throw new Error("User not authenticated");

    const roomId = classId.toString();
    socket.join(roomId);
    console.log(`User ${user.id} (${socket.id}) joined room ${classId}`);

    // Initialize roomUserCount for this room if not already initialized
    if (!roomUserCount.has(roomId)) roomUserCount.set(roomId, new Set());

    // Add socket ID to the room's user set
    roomUserCount.get(roomId)?.add(socket.id);

    // Send the updated user list (filtering by user.id to avoid duplicates)
    const activeUsers = Array.from(roomUserCount.get(roomId)?.values() || []);
    const userCount = activeUsers.length;

    // Get user details for the active users, ensuring unique user IDs
    const userDetails: any = [];
    const seenUserIds = new Set<number>(); // Track seen user IDs to prevent duplicates

    activeUsers.forEach((socketId) => {
      const user = io.sockets.sockets.get(socketId)?.data?.user;
      if (user && !seenUserIds.has(user.id)) {
        seenUserIds.add(user.id);
        userDetails.push({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
        });
      }
    });

    // Emit updated user count and user details
    io.to(roomId).emit("CLASS_USER_COUNT", userCount);
    io.to(roomId).emit("ACTIVE_USERS", userDetails);
    io.to(roomId).emit("USER_STATUS_UPDATE", { userId: user.id, isOnline: true });
  } catch (error: any) {
    handleError(socket, error.message || "Failed to join room");
  }
};

// Handle sending a class message
const handleSendClassMessage = async (socket: Socket, io: Server, data: any) => {
  try {
    const user = socket.data.user;
    if (!user) throw new Error("User not authenticated");

    const { classId, message, image, video, document, audio, repliedMessageId } = data;
    if (!classId || (!message && !image && !video && !document && !audio)) {
      throw new Error("Invalid data received. Message or media is required.");
    }

    const classExists = await prisma.class.findUnique({ where: { id: classId } });
    if (!classExists) throw new Error("Class not found");

    const createdMessage = await prisma.classMessage.create({
      data: {
        classId,
        userId: user.id,
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
  } catch (error: any) {
    handleError(socket, error.message || "Failed to send message");
  }
};

// Handle updating a message
const handleUpdateMessage = async (socket: Socket, io: Server, receivedData: any) => {
  try {
    const user = socket.data.user;
    if (!user) throw new Error("User not authenticated");

    const { messageId, data } = receivedData;
    const updatedMessage = await prisma.classMessage.update({
      where: { id: messageId },
      data,
    });

    io.to(updatedMessage.classId.toString()).emit("MESSAGE_UPDATED", {
      messageId: updatedMessage.id,
      data,
    });
  } catch (error: any) {
    handleError(socket, error.message || "Failed to update message");
  }
};

// Handle deleting a message
const handleDeleteMessage = async (socket: Socket, io: Server, receivedData: any) => {
  try {
    const user = socket.data.user;
    if (!user) throw new Error("User not authenticated");

    const { messageId } = receivedData;
    const deletedMessage = await prisma.classMessage.delete({
      where: { id: messageId },
    });

    io.to(deletedMessage.classId.toString()).emit("MESSAGE_DELETED", {
      messageId: deletedMessage.id,
    });
  } catch (error: any) {
    handleError(socket, error.message || "Failed to delete message");
  }
};

// Handle user disconnection
const handleDisconnect = async (socket: Socket, io: Server) => {
  try {
    const user = socket.data.user;
    if (!user) {
      console.log(`Unauthenticated socket disconnected: ${socket.id}`);
      return;
    }

    console.log(`Socket disconnected: ${socket.id}, User: ${user.id}`);

    roomUserCount.forEach((users, roomId) => {
      // Check if the user is in the room by user ID
      const userSocket = Array.from(users).find(
        (socketId) => io.sockets.sockets.get(socketId)?.data?.user?.id === user.id,
      );

      if (userSocket) {
        users.delete(userSocket);
        const userCount = users.size;
        io.to(roomId).emit("CLASS_USER_COUNT", userCount);

        // Emit user status update only for the user
        io.to(roomId).emit("USER_STATUS_UPDATE", { userId: user.id, isOnline: false });
      }
    });

    io.emit("USER_STATUS_UPDATE", { userId: user.id, isOnline: false });
  } catch (error: any) {
    console.error("Error during disconnection:", error.message);
  }
};
// Handle leaving a room
const handleLeaveRoom = (socket: Socket, io: Server, classId: number) => {
  try {
    const user = socket.data.user;
    if (!user) throw new Error("User not authenticated");

    const roomId = classId.toString();
    socket.leave(roomId);
    console.log(`User ${user.id} (${socket.id}) left room ${classId}`);

    const roomUsers = roomUserCount.get(roomId);
    if (roomUsers) {
      // Remove the socket from the set of users based on user.id
      const userSocket = Array.from(roomUsers).find(
        (socketId) => io.sockets.sockets.get(socketId)?.data?.user?.id === user.id,
      );

      if (userSocket) {
        roomUsers.delete(userSocket);
        const activeUsers = Array.from(roomUsers);
        const userCount = activeUsers.length;

        io.to(roomId).emit("CLASS_USER_COUNT", userCount);
        io.to(roomId).emit("ACTIVE_USERS", activeUsers);
        io.to(roomId).emit("USER_STATUS_UPDATE", { userId: user.id, isOnline: false });
      }
    }
  } catch (error: any) {
    handleError(socket, error.message || "Failed to leave room");
  }
};

// Handle typing event
const handleTyping = (socket: Socket, io: Server, data: { classId: number; isTyping: boolean }) => {
  try {
    const user = socket.data.user;
    if (!user) throw new Error("User not authenticated");

    const { classId, isTyping } = data;
    io.to(classId.toString()).emit("USER_TYPING", { userId: user.id, isTyping });
  } catch (error: any) {
    handleError(socket, error.message || "Failed to emit typing event");
  }
};

// Export SocketConnection
export const SocketConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => handleUserConnection(socket, io));
};

export default SocketConnection;
