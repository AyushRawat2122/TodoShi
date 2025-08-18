import asyncHandller from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

export const getUserDetails = asyncHandller(async (req, res, next) => {
  const userId = req?.params?.firebaseUID; // extract user ID from request parameters

  // search for the user in the database
  let user = await User.findOne({ firebaseUID: userId });
  if (!user) {
    //if no user exists with this UID , create a new user
    const username = "Guest" + Math.floor(Math.random() * 1000); // generate a random username
    user = await User.create({ firebaseUID: userId, username });
  }
  if (!user) {
    return next(new ApiError(400, "User generation failed at the server end"));
  }
  console.log("User details fetched successfully:", user);
  return res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});

export const updateAbout = asyncHandller(async (req, res, next) => {
  const userId = req?.params?.firebaseUID; // extract user ID from request parameters
  const { about } = req.body; // extract about information from request body
});

export const updateBasicInfo = asyncHandller(async (req, res, next) => {
  const userId = req?.params?.firebaseUID; // extract user ID from request parameters
  const { username, role } = req.body; // extract username and role from request body
});

export const updateSkills = asyncHandller(async (req, res, next) => {
  const userId = req?.params?.firebaseUID; // extract user ID from request parameters
  const { skills } = req.body; // extract skills from request body
});

export const updateAvatar = asyncHandller(async (req, res, next) => {
  const userId = req?.params?.firebaseUID; // extract user ID from request parameters
  const avatar = req?.files?.avatar?.[0]; // extract avatar file from request files
  console.log("Avatar file received:", avatar, "User ID:", userId);
  if (!avatar) {
    return next(new ApiError(400, "Avatar file is required"));
  }
  const user = await User.findOne({ firebaseUID: userId });
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  const prevAvatarPublicID = user?.avatar?.public_id;
  const avatarBuffer = avatar.buffer; // get the buffer of the avatar file
  const uploadResult = await uploadOnCloudinary(avatarBuffer); // upload the avatar to Cloudinary
  if (!uploadResult) {
    return next(new ApiError(500, "Failed to upload avatar to Cloudinary"));
  }

  const updatedUser = await User.findOneAndUpdate(
    { firebaseUID: userId },
    { avatar: { public_id: uploadResult.public_id, url: uploadResult.url } },
    { new: true }
  );
  if (!updatedUser) {
    return next(new ApiError(500, "Failed to update user avatar"));
  }
  // delete the old avatar from cloudinary if it exists
  // at the very last when everthing is successful we will delete the previous user avatar in the database becuase we re on free plan -_+ broke.
  if (prevAvatarPublicID) {
    await deleteOnCloudinary(prevAvatarPublicID);
  }

  return res.status(200).json({
    status: "success",
    message: "Avatar updated successfully",
    data: updatedUser,
  });
});

export const updateBanner = asyncHandller(async (req, res, next) => {
  const userId = req?.params?.firebaseUID; // extract user ID from request parameters
  const banner = req?.files?.banner?.[0]; // extract banner file from request files
  console.log("Banner file received:", banner, "User ID:", userId);

  if (!banner) {
    return next(new ApiError(400, "Banner file is required"));
  }

  const user = await User.findOne({ firebaseUID: userId });
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  const prevBannerPublicID = user?.banner?.public_id;

  const uploadResult = await uploadOnCloudinary(banner.buffer); // upload the banner to Cloudinary
  if (!uploadResult) {
    return next(new ApiError(500, "Failed to upload banner to Cloudinary"));
  }

  const updatedUser = await User.findOneAndUpdate(
    { firebaseUID: userId },
    { banner: { public_id: uploadResult.public_id, url: uploadResult.url } },
    { new: true }
  );
  if (!updatedUser) {
    return next(new ApiError(500, "Failed to update user banner"));
  }

  // delete the old banner from cloudinary if it exists
  if (prevBannerPublicID) {
    await deleteOnCloudinary(prevBannerPublicID);
  }

  return res.status(200).json({
    status: "success",
    message: "Banner updated successfully",
    data: updatedUser,
  });
});
