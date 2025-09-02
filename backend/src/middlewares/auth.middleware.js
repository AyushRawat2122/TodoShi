import ApiError from "../utils/apiError.js";
import admin from "firebase-admin";

const secureAuthMiddleware = async (req, res, next) => {
  //get bearer token from request
  try {
    const requestToken = req.headers.authorization?.trim()?.split(" ")[1];
    if (!requestToken) {
      return next(new ApiError(401, "Unauthorized bearer token not found"));
    }
    const decodedToken = await admin.auth().verifyIdToken(requestToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired bearer token"));
  }
};

export default secureAuthMiddleware;
