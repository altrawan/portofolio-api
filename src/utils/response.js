const httpStatus = require('http-status');

module.exports = {
  success: (res, payload) => {
    const { code, message, data, pagination = false, token = false } = payload;

    const response = {
      code: code || httpStatus.OK,
      status: 'success',
      message,
      data,
    };

    // success with pagination
    if (pagination) {
      response.pagination = pagination;
    }

    // sucess with token
    if (token) {
      response.token = token;
      delete response.data;
    }

    res.status(code).json(response);
  },
  failed: (res, payload) => {
    const { code, message, error } = payload;

    const response = {
      code: code || httpStatus.INTERNAL_SERVER_ERROR,
      status: 'failed',
      message,
      error,
    };

    res.status(code).json(response);
  },
};
