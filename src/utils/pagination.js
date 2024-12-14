export const getPaginationOptions = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const createPaginationResult = (items, total, options) => {
  return {
    items,
    pagination: {
      total,
      pages: Math.ceil(total / options.limit),
      currentPage: options.page,
      limit: options.limit,
    },
  };
};
