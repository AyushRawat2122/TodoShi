import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Project from "../models/project.models.js";
import User from "../models/user.models.js";

// for projects ...............

export const createProject = asyncHandler(async (req, res, next) => {
  const { title, description, deadline } = req.body;
  const { userID } = req.params;

  if (!userID) {
    return next(new ApiError(400, "User ID is required"));
  }
  const user = await User.findById(userID);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  console.log("Creating project:", { title, description, deadline, createdBy: user._id });

  const newProject = await Project.create({
    title: title,
    description: description,
    deadline: deadline,
    createdBy: user._id,
  });

  if (!newProject) {
    return next(new ApiError(500, "Failed to create project"));
  }

  return res.status(201).json(new ApiResponse(201, "Project created successfully", newProject));
});

export const getAllProjects = asyncHandler(async (req, res, next) => {
  const { userID } = req.params;
  if (!userID) {
    return next(new ApiError(400, "User ID is required"));
  }
  const projects = await Project.find({ createdBy: userID });

  if (!projects) {
    return next(new ApiError(404, "No projects found"));
  }

  return res.status(200).json(new ApiResponse(200, "Projects retrieved successfully", projects));
});

export const deleteProject = asyncHandler(async (req, res, next) => {
  const { projectID } = req.params;
  if (!projectID) {
    return next(new ApiError(400, "Project ID is required"));
  }
  const deletedProject = await Project.findByIdAndDelete(projectID);
  if (!deletedProject) {
    return next(new ApiError(404, "Project not found"));
  }

  return res.status(200).json(new ApiResponse(200, "Project deleted successfully", deletedProject));
});

// for workspaces .........................

