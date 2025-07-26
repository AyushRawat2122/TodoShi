import ApiError from "../utils/apiError.js";
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  if (err instanceof ApiError) {
    return res.status(statusCode).json(err);
  } else {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};
