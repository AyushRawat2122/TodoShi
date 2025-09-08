import { io } from "socket.io-client";
import { app } from "../firebase/config";
import { getAuth } from "firebase/auth";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

export const connectSocket = async () => {
  if (socket) return;
  try {
    if (!SOCKET_URL) {
      throw new Error("Missing SOCKET_URL environment variable");
    }
    console.log(SOCKET_URL);
    const user = getAuth(app).currentUser;
    const token = await user?.getIdToken();
    socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token: token || "" },
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
