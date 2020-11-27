const fs = require('fs');
const { genSaltSync, hashSync } = require('bcryptjs');

const helpers = {};

helpers.createError = ({
  status = 'fail',
  statusCode = 500,
  message,
  ...args
}) => {
  const error = new Error();
  error.message = message;
  error.status = status;
  error.statusCode = statusCode;
  error.stack = args.stack;
  return error;
};
helpers.encryptData = (data, ...args) => {
  const salt = genSaltSync(10);
  return hashSync(data, salt);
};

module.exports = helpers;
