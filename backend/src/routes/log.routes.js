import { Router } from "express";
import { getLogsByProjectID } from "../controllers/log.controller.js";
const router = Router();
router.route("/:projectID").get(getLogsByProjectID);

export default router;
