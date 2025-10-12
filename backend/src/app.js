import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import { createSocketServer } from "./config/socket.js";
import { createServer } from "http";
import secureAuthMiddleware from "./middlewares/auth.middleware.js";

const app = express();
const server = createServer(app);
createSocketServer(server);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(secureAuthMiddleware);

app.get("/", (req, res) => {
  res.send("<h1>Hello SIR</h1>");
});

// Import routes
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import logRoutes from "./routes/log.routes.js";
import requestRoutes from "./routes/request.routes.js";
import collaboratorRoutes from "./routes/collaborator.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import chatRoutes from "./routes/chat.routes.js";
// Use routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/logs", logRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/collaborators", collaboratorRoutes);
app.use("/api/v1/todos", todoRoutes);
app.use("/api/v1/chats", chatRoutes);

app.use(errorHandler);

export default app;
