// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, error: message });
};

module.exports = errorHandler;
