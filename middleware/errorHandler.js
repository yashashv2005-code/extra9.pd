module.exports = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Malformed JSON request body', errors: [] });
  }

  console.error(err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : 'Internal server error',
    errors: []
  });
};
