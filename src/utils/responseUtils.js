export const successResponse = (res, { statusCode = 200, message = 'Success', data = null }) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

export const paginatedResponse = (res, { items, total, page, limit }) => {
  return res.status(200).json({
    status: 'success',
    data: items,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit
    }
  });
};