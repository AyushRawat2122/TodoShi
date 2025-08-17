import { Router } from "express";
import { getUserDetails } from "../controllers/user.controller.js";
const router = Router();

console.log("getUserDetails typeof:", typeof getUserDetails); // temporary debug

router.route("/userDetails/:firebaseUID").get(getUserDetails);

export default router;
