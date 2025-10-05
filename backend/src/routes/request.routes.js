import Router from "express";
import {
  getAllRequests,
  sendRequest,
  revokeRequest,
  acceptRequest,
  rejectRequest,
} from "../controllers/request.controller.js";

const router = Router();

router.route("/get-requests/:userID").get(getAllRequests);
router.route("/send-request/:projectID/:userID").post(sendRequest);
router.route("/revoke-request/:requestID/:projectID").delete(revokeRequest);
router.route("/accept-request/:requestID/:userID").patch(acceptRequest);
router.route("/reject-request/:requestID/:userID").patch(rejectRequest);

export default router;
