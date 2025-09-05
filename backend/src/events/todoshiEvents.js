import { getSocketServer } from "../config/socket.js";

function registerSocketEvents() {
  const io = getSocketServer();
  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);
    //disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

export default registerSocketEvents;
