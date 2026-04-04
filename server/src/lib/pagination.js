/**
 * Compute skip/take offsets for 1-indexed pagination.
 * @param {number} page - Current page number (1-indexed).
 * @param {number} limit - Number of items per page.
 * @returns {{skip: number, take: number, page: number, limit: number}} Object containing `skip` (items to skip), `take` (items to take), and the provided `page` and `limit`.
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
 * Build a standardized paginated response object for API responses.
 * @param {Array} items - Array of result items for the current page.
 * @param {number} total - Total number of items across all pages.
 * @param {number} page - Current page number (1-indexed).
 * @param {number} limit - Number of items per page.
 * @returns {{data: Array, pagination: {total: number, page: number, limit: number, pages: number, hasMore: boolean, startIndex: number, endIndex: number}}} An object containing the page's data and a `pagination` summary with total counts, page/limit, total pages, whether more pages exist, and the 1-based start and end item indices for the current page.
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
 * Determine whether pagination inputs are within accepted bounds.
 * @param {number} page - 1-indexed page number (must be greater than 0).
 * @param {number} limit - Number of items per page (must be between 1 and 100).
 * @returns {boolean} `true` if `page` > 0 and `limit` is between 1 and 100 inclusive, `false` otherwise.
 */
export function isValidPagination(page, limit) {
  return page > 0 && limit > 0 && limit <= 100;
}
