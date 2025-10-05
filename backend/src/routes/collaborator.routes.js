import { Router } from "express";
import { getAllCollaborators, removeCollaborator, getOutgoingRequests, searchUsers, leaveProject } from "../controllers/collaborator.controller.js";

const router = Router();

router.route("/get-collaborators/:projectID").get(getAllCollaborators);
router.route("/remove-collaborator/:collaboratorID/:projectID").delete(removeCollaborator);
router.route("/get-outgoing-requests/:projectID").get(getOutgoingRequests);
router.route("/search-users").get(searchUsers);
router.route("/leave-project/:projectID").delete(leaveProject);

export default router;
