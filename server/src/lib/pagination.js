/**
 * Calculate pagination parameters
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} Pagination parameters
 */
export function getPaginationParams(page, limit) {
  const skip = (page - 1) * limit;
  const take = limit;

  return {
    skip,
    take,
    page,
    limit,
  };
}

/**
 * Format paginated response
 * @param {Array} items - Items from database
 * @param {number} total - Total count from database
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Formatted pagination object
 */
export function formatPagination(items, total, page, limit) {
  const pages = Math.ceil(total / limit);
  const hasMore = page < pages;

  return {
    data: items,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasMore,
      startIndex: (page - 1) * limit + 1,
      endIndex: Math.min(page * limit, total),
    },
  };
}

/**
 * Validate pagination parameters
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {boolean} True if valid
 */
export function isValidPagination(page, limit) {
  return page > 0 && limit > 0 && limit <= 100;
}
