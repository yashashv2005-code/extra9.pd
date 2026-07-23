const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: result.array().map(({ path, msg }) => ({ field: path, message: msg }))
    });
  }
  return next();
};

module.exports = validate;
