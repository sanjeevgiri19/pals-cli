import chalk from "chalk";

/**
 * Standardized Express error-handling middleware that logs an error and sends a JSON error response.
 * @param {Error|Object} err - Error object; may include `statusCode`, `status`, `code`, `name`, and `message`.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware (unused).
 * @returns {import('express').Response} The HTTP response containing a standardized error payload (`success`, `error`, `statusCode`, `timestamp`).
 */

export function errorHandler(err, req, res, next) {
  // Log error
  console.error(chalk.red("\n❌ ERROR:"), {
    message: err.message,
    code: err.code || "UNKNOWN_ERROR",
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });

  if (err.stack) {
    console.error(chalk.dim(err.stack));
  }

  // Determine status code
  let statusCode = err.statusCode || err.status || 500;
  let errorCode = err.code || "INTERNAL_SERVER_ERROR";
  let message = err.message || "An unexpected error occurred";

  // Specific error type handling
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = err.message || "Validation failed";
  }

  if (err.name === "UnauthorizedError") {
    statusCode = 401;
    errorCode = "UNAUTHORIZED";
    message = "Authentication required";
  }

  if (err.name === "ForbiddenError") {
    statusCode = 403;
    errorCode = "FORBIDDEN";
    message = "Access denied";
  }

  if (err.name === "NotFoundError") {
    statusCode = 404;
    errorCode = "NOT_FOUND";
    message = err.message || "Resource not found";
  }

  // Prisma errors
  if (err.code === "P2025") {
    statusCode = 404;
    errorCode = "NOT_FOUND";
    message = "Record not found";
  }

  if (err.code === "P2002") {
    statusCode = 409;
    errorCode = "DUPLICATE_ENTRY";
    message = "Record already exists";
  }

  // Return standardized error response
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    },
    statusCode,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send a standardized 404 JSON response for unmatched routes.
 *
 * @param {import('express').Request} req - Incoming request; `req.method` and `req.path` are used in the error message.
 * @param {import('express').Response} res - Response object used to send the 404 payload.
 * @returns {import('express').Response} The response containing `{ success: false, error: { code: "NOT_FOUND", message }, statusCode: 404, timestamp }`.
 */
export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.path}`,
    },
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
}
