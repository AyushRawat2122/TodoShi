import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Project, Message } from "../models/index.js";
import { getSocketServer } from "../config/socket.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

export const handleSendMessage = asyncHandler(async (req, res, next) => {
  const { content, projectId, senderId } = req.body;
  const { roomID } = req.params;
  const attachment = req.files?.attachments?.[0] || null;
  
  if (!roomID.trim() || !content.trim()) {
    return next(new ApiError("Room ID and content are required", 400));
  }
  
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ApiError("Project not found", 404));
  }
  
  if (
    !project.createdBy.equals(senderId) &&
    !project.collaborators.some((id) => id.equals(senderId))
  ) {
    return next(new ApiError("You are not authorized to send messages in this project", 403));
  }
  
  let attachmentData = null;
  if (attachment) {
    const result = await uploadOnCloudinary(attachment.buffer);
    attachmentData = { public_id: result.public_id, url: result.url };
  }
  
  const message = await Message.create({
    project_id: projectId,
    sender: senderId,
    content,
    attachment: attachmentData,
  });

  // Populate sender data before emitting
  await message.populate("sender", "username _id avatar");

  const io = getSocketServer();
  io.to(roomID).emit("new-message", message);

  res.status(201).json(new ApiResponse("Message sent successfully", message));
});

export const getPreviousMessages = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { lastMessageId } = req.query;
  
  if (!projectId || !projectId.trim()) {
    return next(new ApiError("Project ID is required", 400));
  }

  // Build query - if lastMessageId exists and is valid, fetch messages older than it
  const query = {
    project_id: projectId,
    ...(lastMessageId && lastMessageId.trim() && { _id: { $lt: lastMessageId } }),
  };

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("sender", "username _id avatar");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        messages.length === 0
          ? "No previous messages found"
          : "Previous messages fetched successfully",
        messages.reverse()
      )
    );
});

export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { messageId, userId } = req.body;
  const { roomID } = req.params;

  if (!messageId || !messageId.trim()) {
    return next(new ApiError("Message ID is required", 400));
  }

  if (!userId || !userId.trim()) {
    return next(new ApiError("User ID is required", 400));
  }

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new ApiError("Message not found", 404));
  }

  if (!message.sender.equals(userId)) {
    return next(new ApiError("You are not authorized to delete this message", 403));
  }

  if (message.attachment?.public_id) {
    await deleteOnCloudinary(message.attachment.public_id);
  }

  await Message.findByIdAndDelete(messageId);

  const io = getSocketServer();
  io.to(roomID).emit("message-deleted", {
    messageId: message._id,
    projectId: message.project_id,
  });

  res.status(200).json(new ApiResponse("Message deleted successfully", { messageId: message._id }));
});
