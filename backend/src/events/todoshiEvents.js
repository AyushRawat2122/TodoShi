import { getSocketServer } from "../config/socket.js";
import admin from "firebase-admin";
import { Project, Log } from "../models/index.js";
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
    console.log("⚡ User connected:", socket.id, socket.user);

    //events
    socket.on("joinProjectRoom", ({ roomID }) => {
      try {
        if (roomID) {
          socket.join(roomID);
          console.log(`➡️ User ${socket.id} joined room: ${roomID}`);
          socket.emit("room-connection-success", roomID);
        }
      } catch (error) {
        socket.emit("room-connection-error", { message: "Failed to join room", error });
      }
    });

    // ==================== Info Page Events ===================== //

    // project update-description
    socket.on("update-project-description", async ({ roomID, projectId, description }) => {
      console.log("➡️ Updating project description:", { roomID, projectId, description });
      try {
        if (!roomID || !description || !projectId) {
          throw new Error("Room ID, project ID, and description are required");
        }
        const updatedProject = await Project.findByIdAndUpdate(
          projectId,
          { description: description },
          { new: true }
        );
        if (!updatedProject) {
          throw new Error("Project update failed");
        }
        io.to(roomID).emit("project-description-update", {
          description: updatedProject.description,
        });
      } catch (error) {
        console.error("Error updating project description:", error);
      }
    });

    //project update-links
    socket.on("update-project-links", async ({ roomID, projectId, links }) => {
      console.log("➡️ Updating project links:", { roomID, projectId, links });
      try {
        if (!roomID || !Array.isArray(links) || !projectId) {
          throw new Error("Room ID, project ID, and links are required");
        }
        const updatedProject = await Project.findByIdAndUpdate(
          projectId,
          { links: links },
          { new: true }
        );
        if (!updatedProject) {
          throw new Error("Project update failed");
        }
        io.to(roomID).emit("project-links-update", {
          links: updatedProject.links,
        });
      } catch (error) {
        console.error("Error updating project description:", error);
      }
    });

    // ==================== Logs Page Events ===================== //

    // add-project-log
    socket.on("add-project-log", async ({ roomID, projectId, description }) => {
      try {
        if (!roomID || !description || !projectId) {
          throw new Error("Room ID, project ID, and description are required");
        }
        console.log("➡️ Adding project log:", { roomID, projectId, description });
        const newLog = await Log.create({ description, projectId });
        if (!newLog) {
          throw new Error("Log creation failed");
        }
        console.log("✅ Project log added:", newLog);
        io.to(roomID).emit("new-project-log", newLog);
      } catch (error) {
        console.error("Error adding project log:", error);
      }
    });

    //disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

export default registerSocketEvents;
