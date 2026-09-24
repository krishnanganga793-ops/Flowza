export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Server error";

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Resource not found or invalid format";
  }

  res.status(statusCode).json({
    message,
    errors: error.errors,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
}

