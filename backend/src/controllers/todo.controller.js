import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Todo } from "../models/index.js";
import mongoose from "mongoose";

export const getTodosByProjectIdAndDate = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { date } = req.query;

  console.log("📥 getTodosByProjectIdAndDate called:", { projectId, date });

  // Validate date
  if (!date) {
    console.error("❌ Date parameter missing");
    return next(new ApiError("Date is required", 400));
  }

  // Simple query using the date field (no timezone issues!)
  const todos = await Todo.find({
    projectId: new mongoose.Types.ObjectId(projectId),
    date: date // Direct string comparison: "2025-10-06"
  }).populate("createdBy", "username avatar _id");

  console.log(`✅ Found ${todos.length} todos for date ${date}`);

  // Respond with todos
  res.status(200).json(new ApiResponse(200, "Todos fetched successfully", todos));
});