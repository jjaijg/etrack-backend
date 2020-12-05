const handleInvalidReq = (req, res, next) => {
  return res.status(404).json({
    status: 'fail',
    statusCode: 404,
    message: 'Resource not found!',
  });
};

module.exports = handleInvalidReq;
