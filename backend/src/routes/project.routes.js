import { Router } from "express";
import {
  createProject,
  getAllProjects,
  deleteProject,
  getProjectDetails,
} from "../controllers/project.controller.js";
const router = Router();

router.route("/create/:userID").post(createProject);
router.route("/search/:userID").get(getAllProjects);
router.route("/delete/:projectID/:userID").delete(deleteProject);
router.route("/get/:projectID").get(getProjectDetails);
export default router;
