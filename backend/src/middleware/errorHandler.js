const { Prisma } = require('../../generated/prisma');
const ApiError = require('../utils/ApiError');

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with the same unique field already exists.',
      errors: error.meta,
    });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid database query.',
      errors: [error.message],
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong',
    errors: process.env.NODE_ENV === 'development' ? [error.stack] : [],
  });
};

module.exports = { errorHandler };
