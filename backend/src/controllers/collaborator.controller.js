import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Project, User, Request } from "../models/index.js";
import { Types } from "mongoose";
import { getSocketServer } from "../config/socket.js";
//get all collaborators of a project
export const getAllCollaborators = asyncHandler(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID.trim()) {
    return next(new ApiError(400, "Project ID is required"));
  }
  const ProjectCollaborators = await Project.findById(projectID)
    .populate("collaborators", "username avatar _id")
    .populate("createdBy", "username avatar _id")
    .select("collaborators createdBy");

  if (!ProjectCollaborators) {
    return next(new ApiError(404, "Project not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Collaborators retrieved successfully", ProjectCollaborators));
});
//remove a collaborator from a project
export const removeCollaborator = asyncHandler(async (req, res, next) => {
  const { collaboratorID, projectID } = req.params;
  const tokenUID = req.user.uid;
  if (!collaboratorID.trim() || !projectID.trim() || !tokenUID.trim()) {
    return next(new ApiError(400, "Invalid request parameters"));
  }
  const user = await User.findOne({ firebaseUID: tokenUID });
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  const project = await Project.findById(projectID);
  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }
  if (project.createdBy.toString() !== user._id.toString()) {
    return next(new ApiError(403, "Only the project owner can remove collaborators"));
  }
  if (!project.collaborators.some((id) => id.toString() === collaboratorID)) {
    return next(new ApiError(404, "Collaborator not found in project"));
  }
  const collaborator = await User.findById(collaboratorID);
  if (!collaborator) {
    return next(new ApiError(404, "Collaborator user not found"));
  }

  project.collaborators.pull(collaboratorID);
  await project.save();
  // Emit socket event to notify other collaborators
  const io = getSocketServer();
  const roomID = project.title.trim().slice(0, 2) + projectID.trim();
  io.to(roomID).emit("collaborator-left", {
    userId: collaborator._id,
    userName: collaborator.username,
    projectId: projectID,
  });

  return res.status(200).json(new ApiResponse(200, "Collaborator removed successfully", {}));
});
//get all outgoing requests of a project
export const getOutgoingRequests = asyncHandler(async (req, res, next) => {
  const { projectID } = req.params;
  const tokenUID = req.user.uid;
  if (!projectID.trim() || !tokenUID.trim()) {
    return next(new ApiError(400, "Project ID and User ID are required"));
  }

  const user = await User.findOne({ firebaseUID: tokenUID });
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const project = await Project.findById(projectID);
  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }

  const outgoingRequests = await Request.find({
    senderId: user._id,
    projectId: project._id,
  }).populate("receiverId", "username avatar _id");

  return res
    .status(200)
    .json(new ApiResponse(200, "Outgoing requests retrieved successfully", outgoingRequests));
});
//leave project as a collaborator
export const leaveProject = asyncHandler(async (req, res, next) => {
  const { projectID } = req.params;
  const tokenUID = req.user.uid;
  if (!projectID.trim() || !tokenUID.trim()) {
    return next(new ApiError(400, "Project ID and User ID are required"));
  }

  const user = await User.findOne({ firebaseUID: tokenUID });
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const project = await Project.findById(projectID);
  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }

  if (!project.collaborators.some((id) => id.toString() === user._id.toString())) {
    return next(new ApiError(403, "User is not a collaborator of this project"));
  }

  project.collaborators.pull(user._id);
  await project.save();
  return res.status(200).json(new ApiResponse(200, "Left project successfully", {}));
});
//search users by username or ID
export const searchUsers = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  if (!query || !query.trim()) {
    return next(new ApiError(400, "Search query is required"));
  }

  let results = [];

  // Check if query is a valid MongoDB ObjectId
  if (Types.ObjectId.isValid(query)) {
    const user = await User.findById(query).select("username avatar _id");
    if (user) {
      results.push(user);
    }
  }

  // Search by username (case-insensitive)
  const users = await User.find({
    username: { $regex: query, $options: "i" },
  })
    .select("username avatar _id")
    .limit(10);

  results.push(...users);

  // Remove duplicates
  const uniqueResults = Array.from(new Map(results.map((u) => [u._id.toString(), u])).values());

  return res.status(200).json(new ApiResponse(200, "Users retrieved successfully", uniqueResults));
});
