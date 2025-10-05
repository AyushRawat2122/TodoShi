import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Request, User, Project } from "../models/index.js";

export const getAllRequests = asyncHandler(async (req, res, next) => {
  const { userID } = req.params;

  if (!userID.trim()) {
    return next(new ApiError(400, "User ID is required"));
  }

  const requests = await Request.find({ receiverId: userID })
    .populate("senderId", "username avatar _id")
    .populate("projectId", "title description _id")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, "Requests retrieved successfully", requests));
});

export const sendRequest = asyncHandler(async (req, res, next) => {
  const { userID, projectID } = req.params;
  const tokenUID = req.user.uid;

  // TODO: Implement send request logic
  if (!userID.trim() || !tokenUID.trim() || !projectID.trim()) {
    return next(new ApiError(400, "User ID, Sender ID and Project ID are required"));
  }
  const sender = await User.findOne({ firebaseUID: tokenUID });
  if (!sender) {
    return next(new ApiError(404, "Sender not found"));
  }
  const project = await Project.findById(projectID);
  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }
  if (project.createdBy.toString() === userID) {
    return next(new ApiError(400, "Cannot send collaboration request to yourself"));
  }
  if (project.createdBy.toString() !== sender._id.toString()) {
    return next(new ApiError(403, "Only the project owner can send collaboration requests"));
  }

  const receiver = await User.findById(userID);
  if (!receiver) {
    return next(new ApiError(404, "Receiver not found"));
  }

  const existingRequest = await Request.findOne({
    senderId: sender._id,
    receiverId: receiver._id,
    projectId: project._id,
  });
  if (existingRequest) {
    return next(new ApiError(409, "Collaboration request already exists"));
  }

  const newRequest = await Request.create({
    projectId: project._id,
    senderId: sender._id,
    receiverId: receiver._id,
  });
  if (!newRequest) {
    return next(new ApiError(500, "Failed to create request"));
  }

  return res.status(201).json(new ApiResponse(201, "Request sent successfully", newRequest));
});

export const revokeRequest = asyncHandler(async (req, res, next) => {
  const { requestID, projectID } = req.params;
  const tokenUID = req.user.uid;
  if (!requestID.trim() || !projectID.trim() || !tokenUID.trim()) {
    return next(new ApiError(400, "Request ID, Project ID and User ID are required"));
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
    return next(new ApiError(403, "Only the project owner can revoke requests"));
  }

  const request = await Request.findById(requestID);
  if (!request) {
    return next(new ApiError(404, "Request not found"));
  }

  if (request.senderId.toString() !== user._id.toString()) {
    return next(new ApiError(403, "Only the request sender can revoke it"));
  }

  await Request.findByIdAndDelete(requestID);

  return res.status(200).json(new ApiResponse(200, "Request revoked successfully", {}));
});

export const acceptRequest = asyncHandler(async (req, res, next) => {
  const { requestID, userID } = req.params;

  if (!requestID.trim() || !userID.trim()) {
    return next(new ApiError(400, "Request ID and User ID are required"));
  }

  const request = await Request.findById(requestID).populate("projectId");
  if (!request) {
    return next(new ApiError(404, "Request not found"));
  }

  if (request.receiverId.toString() !== userID) {
    return next(new ApiError(403, "Only the request receiver can accept it"));
  }

  if (request.status !== "pending") {
    return next(new ApiError(400, "Only pending requests can be accepted"));
  }

  // Update request status
  request.status = "accepted";
  await request.save();

  // Add user to project collaborators
  const project = await Project.findById(request.projectId);
  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }

  // Check if user is already a collaborator
  if (!project.collaborators.some((id) => id.toString() === userID)) {
    project.collaborators.push(userID);
    await project.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Request accepted successfully", { request, project }));
});

export const rejectRequest = asyncHandler(async (req, res, next) => {
  const { requestID, userID } = req.params;
  // TODO: Implement reject request logic
  if (!requestID.trim() || !userID.trim()) {
    return next(new ApiError(400, "Request ID and User ID are required"));
  }
  const request = await Request.findById(requestID);
  if (!request) {
    return next(new ApiError(404, "Request not found"));
  }
  if (request.receiverId.toString() !== userID) {
    return next(new ApiError(403, "Only the request receiver can reject it"));
  }
  if (request.status !== "pending") {
    return next(new ApiError(400, "Only pending requests can be rejected"));
  }
  request.status = "rejected";
  await request.save();
  return res.status(200).json(new ApiResponse(200, "Request rejected successfully", {}));
});
