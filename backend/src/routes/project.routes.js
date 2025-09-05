import { Router } from "express";
import { createProject, getAllProjects, deleteProject } from "../controllers/project.controller.js";
const router = Router();

router.route("/create/:userID").post(createProject);
router.route("/search/:userID").get(getAllProjects);
router.route("/delete/:projectID/:userID").delete(deleteProject);

export default router;
