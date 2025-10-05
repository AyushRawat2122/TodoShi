import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Log } from "../models/index.js";

export const getLogsByProjectID = asyncHandler(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID.trim()) {
    return next(new ApiError(400, "ProjectID is required"));
  }
  const logs = await Log.find({ projectId: projectID }).sort({ createdAt: 1 });
  if (!logs) {
    return next(new ApiError(404, "Logs not found"));
  }
  return res.status(200).json(new ApiResponse(200, "Logs retrieved successfully", logs));
});
