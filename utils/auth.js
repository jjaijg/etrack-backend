const { compareSync } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const AUTH_KEY = process.env.AUTH_KEY || 'Your auth key goes here';

const auth = {};

auth.createToken = (data) => {
  return sign({ user: data }, AUTH_KEY, {
    expiresIn: '12h',
  });
};

auth.verifyPass = (password, encrypted) => {
  return compareSync(password, encrypted);
};

module.exports = auth;
