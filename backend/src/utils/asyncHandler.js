const asyncHandler = (fn) => {
  // Return a new function that wraps the original function
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;
