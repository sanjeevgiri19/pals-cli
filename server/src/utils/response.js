/**
 * Create a standardized success response object.
 * @param {*} data - Response payload to include under `data`.
 * @param {number} [statusCode=200] - HTTP status code to include as `statusCode`.
 * @returns {{success: true, data: *, statusCode: number}} An object with `success: true`, the provided `data`, and the `statusCode`.
 */
export function sendSuccess(data, statusCode = 200) {
  return {
    success: true,
    data,
    statusCode,
  };
}

/**
 * Create a standardized error response object.
 *
 * Includes an `error` object with `code` and `message`, conditionally includes `details` when provided, and adds an ISO `timestamp`.
 * @param {string} code - Application-specific error code.
 * @param {string} message - Human-readable error message.
 * @param {number} [statusCode=400] - HTTP status code to include in the response.
 * @param {string|null} [details=null] - Optional additional error details; omitted if falsy.
 * @returns {Object} Standardized error response with `success: false`, `error`, `statusCode`, and `timestamp`.
 */
export function sendError(code, message, statusCode = 400, details = null) {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a standardized paginated response object.
 *
 * Includes pagination metadata: `total`, `page`, `limit`, `pages`, and `hasMore`.
 * @param {Array} data - Array of items for the current page.
 * @param {number} total - Total number of items across all pages.
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @param {number} [statusCode=200] - HTTP status code to include in the response.
 * @returns {Object} The response object containing `success`, `data`, `pagination`, and `statusCode`.
 */
export function sendPaginated(data, total, page, limit, statusCode = 200) {
  const pages = Math.ceil(total / limit);
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasMore: page < pages,
    },
    statusCode,
  };
}

/**
 * Builds a standardized list response object.
 *
 * @param {Array} data - The array of items to include in the response.
 * @param {number} total - The total number of items (used as `count` in the response).
 * @param {number} [statusCode=200] - HTTP status code for the response.
 * @returns {Object} The response object containing `success: true`, `data`, `count`, and `statusCode`.
 */
export function sendList(data, total, statusCode = 200) {
  return {
    success: true,
    data,
    count: total,
    statusCode,
  };
}
