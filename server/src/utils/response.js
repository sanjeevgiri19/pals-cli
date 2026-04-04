/**
 * Send success response with data
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Standardized success response
 */
export function sendSuccess(data, statusCode = 200) {
  return {
    success: true,
    data,
    statusCode,
  };
}

/**
 * Send error response
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} details - Additional error details
 * @returns {Object} Standardized error response
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
 * Send paginated response
 * @param {Array} data - Array of items
 * @param {number} total - Total count of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Standardized paginated response
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
 * Send list response without pagination
 * @param {Array} data - Array of items
 * @param {number} total - Total count of items
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Standardized list response
 */
export function sendList(data, total, statusCode = 200) {
  return {
    success: true,
    data,
    count: total,
    statusCode,
  };
}
