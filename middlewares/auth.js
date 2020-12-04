const { verify } = require('jsonwebtoken');
const { createError } = require('../utils/helpers');
const AUTH_KEY = process.env.AUTH_KEY || 'your Auth key goes here';
const errObj = {
  status: 'fail',
  statusCode: 403,
  message: 'Not Authorised! or invalid token!',
};

const auth = {};

auth.verifyToken = (req, res, next) => {
  let token = req.get('authorization');
  if (token) {
    token = token.slice(7);
    verify(token, AUTH_KEY, (err, decoded) => {
      if (err) {
        next(createError(errObj));
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } else {
    next(createError(errObj));
  }
};

module.exports = auth;
