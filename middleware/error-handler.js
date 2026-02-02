const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // Mongoose duplicate key error (email)
  if (err.code === 11000) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = `Duplicate value entered for ${Object.keys(err.keyValue)} field`;
  }

  // CastError
  if (err.name === "CastError") {
    statusCode = StatusCodes.NOT_FOUND;
    message = `Resource not found`;
  }

  return res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
};

module.exports = errorHandlerMiddleware;
