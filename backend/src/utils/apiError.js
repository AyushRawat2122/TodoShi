class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export default ApiError;
