import { Server } from "socket.io";

let io;

function createSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://www.todoshi.app",
        "https://todoshi.app",
        "https://todo-shi.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
}

function getSocketServer() {
  if (!io) {
    throw new Error("Socket server is not initialized. Call createSocketServer first.");
  }
  return io;
}

export { createSocketServer, getSocketServer };
