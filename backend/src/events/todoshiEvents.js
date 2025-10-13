import { getSocketServer } from "../config/socket.js";
import admin from "firebase-admin";
import { Project, Log, Todo, User } from "../models/index.js";

const Rooms = new Map(); // roomID -> Set of users

export default function registerSocketEvents() {
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
    socket.on("joinProjectRoom", async ({ roomID, userId }) => {
      try {
        if (roomID) {
          const user = await User.findById(userId).populate("avatar username _id").lean();
          user.socketId = socket.id;
          if (!user) {
            throw new Error("User not found");
          }

          await socket.join(roomID);
          if (Rooms.has(roomID)) {
            const prev = Rooms.get(roomID);
            if (prev.some((u) => u._id.toString() === userId)) {
              throw new Error("User session in the workspace already exists");
            }
            Rooms.set(roomID, [...prev, user]);
          } else {
            Rooms.set(roomID, [user]);
          }

          console.log(`➡️ User ${socket.id} joined room: ${roomID}`);

          // Get current online users in this room
          const onlineUsers = Rooms.get(roomID) || [];

          // Emit to all users in the room about the updated online users list
          io.to(roomID).emit("online-users-update", {
            onlineUsers: onlineUsers.map((u) => ({
              userId: u._id,
              username: u.username,
              avatar: u.avatar,
            })),
            totalCount: onlineUsers.length,
          });

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
        socket.emit("server-error", `Error updating project description: ${error.message}`);
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
        socket.emit("server-error", `Error updating project links: ${error.message}`);
      }
    });

    //project activeStatus toggled
    socket.on("toggle-project-status", async ({ roomID, projectId, activeStatus }) => {
      console.log("➡️ Toggling project status:", { roomID, projectId, activeStatus });
      try {
        if (!roomID || !projectId || typeof activeStatus !== "boolean") {
          throw new Error("Room ID, project ID, and activeStatus are required");
        }
        const updatedProject = await Project.findByIdAndUpdate(
          projectId,
          { activeStatus },
          { new: true }
        );

        if (!updatedProject) {
          throw new Error("Project not found");
        }

        console.log("✅ Project status toggled:", updatedProject);
        // Emit to all clients in the room
        io.to(roomID).emit("project-status-toggled", {
          activeStatus: updatedProject.activeStatus,
        });
      } catch (error) {
        console.error("❌ Error toggling project status:", error);
        socket.emit("server-error", `Error toggling project status: ${error.message}`);
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
        socket.emit("server-error", `Error adding project log: ${error.message}`);
      }
    });

    // ==================== Todo Page Events ===================== //

    // add-new-todo
    socket.on(
      "new-todo",
      async ({ title, description, status, createdBy, projectId, priority, roomID, date }) => {
        console.log("📥 new-todo event received:", {
          title,
          description,
          status,
          createdBy,
          projectId,
          priority,
          roomID,
          date,
          socketId: socket.id,
          user: socket.user,
        });

        try {
          if (
            !title?.trim() ||
            !description?.trim() ||
            typeof status !== "boolean" ||
            !createdBy?.trim() ||
            !projectId?.trim() ||
            !priority?.trim() ||
            !roomID?.trim() ||
            !date?.trim()
          ) {
            console.error("❌ Validation failed - missing fields");
            throw new Error("All fields are required");
          }

          console.log("✅ Validation passed, creating todo...");

          const newTodo = await Todo.create({
            title,
            description,
            status,
            createdBy,
            projectId,
            priority,
            date, // Store the local date string
          });

          console.log("✅ Todo created in DB:", newTodo);

          // Populate createdBy field
          await newTodo.populate("createdBy", "username avatar _id");

          console.log("✅ Todo populated:", newTodo);

          if (!newTodo) {
            throw new Error("Todo creation failed");
          }

          console.log(`📤 Emitting new-todo to room ${roomID}`);
          io.to(roomID).emit("new-todo", newTodo);
          console.log("✅ new-todo event emitted successfully");
        } catch (error) {
          console.error("❌ Error in new-todo handler:", error);
          socket.emit("server-error", `Error adding new todo: ${error.message}`);
        }
      }
    );

    // mark-todo-completed
    socket.on("mark-todo-completed", async ({ todoId, roomID }) => {
      try {
        if (!todoId?.trim() || !roomID?.trim()) {
          throw new Error("Todo ID and Room ID are required");
        }

        console.log("🔄 Updating todo status to completed...");
        const updatedTodo = await Todo.findByIdAndUpdate(
          todoId,
          { status: true },
          { new: true }
        ).populate("createdBy", "username avatar _id");

        console.log("✅ Todo updated:", updatedTodo);

        if (!updatedTodo) {
          throw new Error("Todo update failed");
        }

        console.log(`📤 Emitting todo-completed to room ${roomID}`);
        io.to(roomID).emit("todo-completed", updatedTodo);
        console.log("✅ todo-completed event emitted successfully");
      } catch (error) {
        console.error("❌ Error in mark-todo-completed:", error);
        socket.emit("server-error", `Error marking todo as completed: ${error.message}`);
      }
    });

    //mark-todo-pending
    socket.on("mark-todo-pending", async ({ todoId, roomID }) => {
      console.log("📥 mark-todo-pending event received:", { todoId, roomID, socketId: socket.id });

      try {
        if (!todoId?.trim() || !roomID?.trim()) {
          throw new Error("Todo ID and Room ID are required");
        }

        console.log("🔄 Updating todo status to pending...");
        const updatedTodo = await Todo.findByIdAndUpdate(
          todoId,
          { status: false },
          { new: true }
        ).populate("createdBy", "username avatar _id");

        console.log("✅ Todo updated:", updatedTodo);

        if (!updatedTodo) {
          throw new Error("Todo update failed");
        }

        console.log(`📤 Emitting todo-pending to room ${roomID}`);
        io.to(roomID).emit("todo-pending", updatedTodo);
        console.log("✅ todo-pending event emitted successfully");
      } catch (error) {
        console.error("❌ Error in mark-todo-pending:", error);
        socket.emit("server-error", `Error marking todo as pending: ${error.message}`);
      }
    });

    // delete-todo
    socket.on("delete-todo", async ({ todoId, roomID }) => {
      console.log("📥 delete-todo event received:", { todoId, roomID, socketId: socket.id });

      try {
        if (!todoId?.trim() || !roomID?.trim()) {
          throw new Error("Todo ID and Room ID are required");
        }

        console.log("🗑️ Deleting todo...");
        const deletedTodo = await Todo.findByIdAndDelete(todoId);

        console.log("✅ Todo deleted:", deletedTodo);

        if (!deletedTodo) {
          throw new Error("Todo deletion failed");
        }

        console.log(`📤 Emitting todo-deleted to room ${roomID}`);
        io.to(roomID).emit("todo-deleted", deletedTodo);
        console.log("✅ todo-deleted event emitted successfully");
      } catch (error) {
        console.error("❌ Error in delete-todo:", error);
        socket.emit("server-error", `Error deleting todo: ${error.message}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);

      // Clean up user from all rooms
      for (const [roomID, users] of Rooms.entries()) {
        const filtered = users.filter((u) => u.socketId !== socket.id);

        if (filtered.length === 0) {
          Rooms.delete(roomID);
          console.log(`🗑️ Room ${roomID} deleted (empty after disconnect)`);
        } else if (filtered.length !== users.length) {
          Rooms.set(roomID, filtered);
          console.log(`🧹 Cleaned up disconnected user from room: ${roomID}`);

          // Emit updated online users list to remaining room members
          io.to(roomID).emit("online-users-update", {
            onlineUsers: filtered.map((u) => ({
              userId: u._id,
              username: u.username,
              avatar: u.avatar,
            })),
            totalCount: filtered.length,
          });
        }
      }
    });
  });
}
