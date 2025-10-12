import { Router } from "express";
import {
  getUserDetails,
  updateAbout,
  updateBasicInfo,
  updateSkills,
  updateAvatar,
  updateBanner,
  previewUser,
} from "../controllers/user.controller.js";
import uploader from "../middlewares/multer.js";

const router = Router();
router.route("/userDetails/:firebaseUID").get(getUserDetails);
router.route("/updateAbout/:firebaseUID").patch(updateAbout);
router.route("/updateBasicInfo/:firebaseUID").patch(updateBasicInfo);
router.route("/updateSkills/:firebaseUID").patch(updateSkills);
router
  .route("/updateAvatar/:firebaseUID")
  .patch(uploader.fields([{ name: "avatar", maxCount: 1 }]), updateAvatar);
router
  .route("/updateBanner/:firebaseUID")
  .patch(uploader.fields([{ name: "banner", maxCount: 1 }]), updateBanner);
router.route("/:userId").get(previewUser);
export default router;
