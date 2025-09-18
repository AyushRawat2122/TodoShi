import { Router } from "express";
import uploader from "../middlewares/multer.js";
import {
  createProject,
  getAllProjects,
  deleteProject,
  getProjectDetails,
  updateProjectDetails,
  uploadProjectSRS,
} from "../controllers/project.controller.js";
const router = Router();

router.route("/create/:userID").post(createProject);
router.route("/search/:userID").get(getAllProjects);
router.route("/delete/:projectID/:userID").delete(deleteProject);
router.route("/get/:projectID").get(getProjectDetails);
router
  .route("/update-details/:projectID")
  .post(uploader.fields([{ name: "imageFile", maxCount: 1 }]), updateProjectDetails);

router
  .route("/upload-srs/:projectID")
  .post(uploader.fields([{ name: "srs", maxCount: 1 }]), uploadProjectSRS);

export default router;
