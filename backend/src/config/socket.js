import { Server } from "socket.io";

let io;

function createSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
}

function getSocketServer() {
  if (!io) {
    throw new Error("Socket server is not initialized. Call createSocketServer first.");
  }
  io.on("connection", (Socket) => {
    console.log("A user connected:", Socket.id);
  });
  return io;
}

export { createSocketServer, getSocketServer };
