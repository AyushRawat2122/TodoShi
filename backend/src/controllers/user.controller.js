import asyncHandller from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

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
    next(new ApiError(400, "User generation failed at the server end"));
  }
  console.log("User details fetched successfully:", user);
  return res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});


