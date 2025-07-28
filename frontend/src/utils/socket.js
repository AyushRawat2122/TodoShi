import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SERVER_URL;

let socket = null;

export const connectSocket = () => {
  if (socket) return;
  try {
    if (!SOCKET_URL) {
      throw new Error("Missing SOCKET_URL environment variable");
    }
    socket = io(SOCKET_URL, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Socket connection failed:", error);
  }
};

export const getSocket = () => {
  if (!socket) {
    console.log("Socket not initialized");
    return null;
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected manually");
  }
};
