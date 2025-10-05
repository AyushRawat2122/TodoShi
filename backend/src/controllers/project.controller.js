import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Project from "../models/project.models.js";
import User from "../models/user.models.js";
import { getSocketServer } from "../config/socket.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
// for projects ...............

export const createProject = asyncHandler(async (req, res, next) => {
  const { title, description, deadline, roomID } = req.body;
  const { userID } = req.params;
  const tokenUID = req.user.uid;

  if (!userID) {
    return next(new ApiError(400, "User ID is required"));
  }
  const user = await User.findById(userID);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  if (user.firebaseUID.toString() !== tokenUID) {
    return next(new ApiError(403, "You are not authorized to access this resource"));
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
  const tokenUID = req.user.uid;

  if (!userID.trim()) {
    return next(new ApiError(400, "User ID is required"));
  }
  const user = await User.findById(userID);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  if (user.firebaseUID.toString() !== tokenUID) {
    return next(new ApiError(403, "You are not authorized to access this resource"));
  }

  const projects = await Project.find({
    $or: [{ createdBy: user._id }, { collaborators: user._id }],
  });
  if (!projects) {
    return next(new ApiError(404, "No projects found"));
  }

  return res.status(200).json(new ApiResponse(200, "Projects retrieved successfully", projects));
});

export const deleteProject = asyncHandler(async (req, res, next) => {
  const { projectID, userID } = req.params; //the user ID provided here is not firebase UID its a mongodb _id
  const tokenUID = req.user.uid;

  if (!projectID.trim() || !userID.trim()) {
    return next(new ApiError(400, "Project ID and User ID are required"));
  }
  const user = await User.findById(userID);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  const project = await Project.findById(projectID);
  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }

  if (user.firebaseUID !== tokenUID || project.createdBy.toString() !== user._id.toString()) {
    return next(new ApiError(403, "You are not authorized to access this resource"));
  }

  const deletedProject = await Project.findByIdAndDelete(projectID);
  if (!deletedProject) {
    return next(new ApiError(404, "Project not found"));
  }

  return res.status(200).json(new ApiResponse(200, "Project deleted successfully", deletedProject));
});

// for workspaces .........................

export const getProjectDetails = asyncHandler(async (req, res, next) => {
  console.log("Fetching project details for projectID:", req.params.projectID);
  const { uid } = req.user; //firebase UID from token
  const { projectID } = req.params;
  if (!projectID.trim()) {
    return next(new ApiError(400, "Project ID is required"));
  }
  const user = await User.findOne({ firebaseUID: uid });
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  const project = await Project.findById(projectID).populate("createdBy");
  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }
  console.log("Project found:", project);
  if (
    project.createdBy._id.toString() !== user._id.toString() &&
    !project.collaborators.some((collab) => collab.equals(user._id))
  ) {
    return next(new ApiError(403, "You are not authorized to access this resource"));
  }

  const isOwner = project.createdBy._id.equals(user._id);
  const projectObject = project.toObject();

  return res
    .status(200)
    .json(new ApiResponse(200, "Project retrieved successfully", { ...projectObject, isOwner }));
});

export const updateProjectDetails = asyncHandler(async (req, res, next) => {
  const { projectID } = req.params;
  const { title, deadline, roomID } = req.body;
  const imageFile = req?.files?.imageFile?.[0];
  const project = await Project.findById(projectID);
  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }
  if (!roomID || roomID?.trim() === "") {
    return next(new ApiError(400, "Room ID is required"));
  }
  const prevImageId = project.ProjectImage?.publicId;

  let updateFields = {};
  if (title.trim() !== "") {
    updateFields.title = title;
  }
  if (imageFile) {
    let result = null;
    try {
      result = await uploadOnCloudinary(imageFile?.buffer);
    } catch (error) {
      console.log(error);
    }
    if (!result) {
      return next(new ApiError(500, "Failed to upload image to Cloudinary"));
    }
    updateFields.ProjectImage = { publicId: result?.public_id, url: result?.secure_url };
  }
  if (deadline.trim() !== "") {
    updateFields.deadline = deadline;
  }

  let updatedProject;
  if (Object.keys(updateFields).length > 0) {
    updatedProject = await Project.findByIdAndUpdate(
      projectID,
      { $set: updateFields },
      { new: true }
    );
  }

  if (!updatedProject) {
    return next(new ApiError(500, "Failed to update project"));
  }

  const io = getSocketServer();
  io.to(roomID).emit("project-details-update", {
    image: updatedProject.ProjectImage,
    title: updatedProject.title,
    deadline: updatedProject.deadline,
  });

  if (prevImageId && imageFile) {
    await deleteOnCloudinary(prevImageId);
  }
  return res.status(200).json(new ApiResponse(200, "Project updated successfully", {}));
});

export const uploadProjectSRS = asyncHandler(async (req, res, next) => {
  const { projectID } = req.params;
  const { roomID } = req.body;
  const srs = req?.files?.srs?.[0];
  if (!srs) {
    return next(new ApiError(400, "SRS file is required"));
  }
  const project = await Project.findById(projectID);
  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }
  if (!roomID || roomID?.trim() === "") {
    return next(new ApiError(400, "Room ID is required"));
  }
  const srsID = project.srsDocFile?.publicId;
  console.log("Uploading SRS file for projectID:", projectID, "in roomID:", roomID, srs);
  let result = null;
  try {
    console.log("Srs:", srs);
    result = await uploadOnCloudinary(srs?.buffer, {
      resource_type: "raw",
      use_filename: true,
      unique_filename: false,
      filename_override: srs?.originalname || "SRS.pdf", // 👈 important!
    });
  } catch (error) {
    console.log(error);
  }
  console.log("Cloudinary upload result:", result);
  if (!result) {
    return next(new ApiError(500, "Failed to upload doc file to Cloudinary"));
  }

  console.log("Updating project with new SRS file info");
  const updatedProject = await Project.findByIdAndUpdate(
    projectID,
    { srsDocFile: { publicId: result?.public_id, url: result?.secure_url } },
    { new: true }
  );

  console.log("Updated project:", updatedProject);
  if (!updatedProject) {
    return next(new ApiError(500, "Failed to update project"));
  }

  console.log("Emitting SRS update to room:", roomID);
  const io = getSocketServer();
  io.to(roomID).emit("project-srs-update", {
    srs: updatedProject.srsDocFile,
  });
  console.log("Emitted SRS update event");
  if (srsID) {
    await deleteOnCloudinary(srsID);
  }
  return res.status(200).json(new ApiResponse(200, "Project updated successfully", {}));
});
