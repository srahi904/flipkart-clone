const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!parsed.success) {
    return next(
      new ApiError(
        400,
        'Validation failed',
        parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      ),
    );
  }

  req.validated = parsed.data;
  return next();
};

module.exports = validate;
