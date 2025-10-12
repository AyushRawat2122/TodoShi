import { Router } from "express";
import { handleSendMessage, getPreviousMessages, deleteMessage } from "../controllers/chat.controller.js";
import uploader from "../middlewares/multer.js";
const router = Router();

router
  .route("/sendMessage/:roomID")
  .post(uploader.fields([{ name: "attachments", maxCount: 1 }]), handleSendMessage);

router.route("/getPreviousMessages/:projectId").get(getPreviousMessages);
router.route("/deleteMessage/:roomID").delete(deleteMessage);
export default router;
