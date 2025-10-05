import { Router } from "express";
import { getTodosByProjectIdAndDate } from "../controllers/todo.controller.js";

const router = Router();
router.route("/:projectId").get(getTodosByProjectIdAndDate);

export default router;
