import { getSocketServer } from "../config/socket.js";
import admin from "firebase-admin";

function registerSocketEvents() {
  const io = getSocketServer();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token provided"));
      const decoded = await admin.auth().verifyIdToken(token);
      socket.user = decoded; 
      next();
    } catch (err) {
      console.error("Socket auth error:", err);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id , socket.user);
    //disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

export default registerSocketEvents;
