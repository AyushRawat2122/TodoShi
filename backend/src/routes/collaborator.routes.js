import { Router } from "express";
import { getAllCollaborators, removeCollaborator, getOutgoingRequests } from "../controllers/collaborator.controller.js";

const router = Router();

router.route("/get-collaborators/:projectID").get(getAllCollaborators);
router.route("/remove-collaborator/:collaboratorID/:projectID").delete(removeCollaborator);
router.route("/get-outgoing-requests/:projectID").get(getOutgoingRequests);

export default router;
