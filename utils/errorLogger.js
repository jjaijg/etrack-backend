const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const logToFile = (data) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path.join('logs', 'errors.log'), data, (err) => {
      if (err) reject(err);
      resolve('The "data to append" was appended to file!');
    });
  });
};

const _checkSqlError = (err) => {
  const errObj = { statusCode: 400, status: 'fail' };
  if (err.errno === 1062) {
    const [value, key] = err.sqlMessage.match(/'(.*?)'/g);
    errObj.message = `${value} is already taken, please try different ${key}`;
    errObj.stack = err.stack;
  } else if (err.errno === 1452) {
    const value = Array.from(
      err.sqlMessage.matchAll(/CONSTRAINT (.*?) FOREIGN/g),
      (msg) => msg[1]
    );
    errObj.message =
      value === 'uid'
        ? 'Invalid user profile'
        : `Please select a valid ${value}`;
    errObj.stack = err.stack;
  }
  return errObj;
};

const errorLogger = async (err, _req, res, next) => {
  try {
    console.log('Error message');
    const isSqlError = err.errno || err.sqlMessage ? _checkSqlError(err) : null;
    let errObj = isSqlError ? isSqlError : err;

    const { status, statusCode, message, stack } = errObj;

    const errLog = `[${new Date().toISOString()}] :: Error occured :: ${
      stack ? stack : err.stack
    } \n`;
    await logToFile(errLog);

    // send err details
    const resStatus = statusCode ? statusCode : 500;
    return res.status(resStatus).json({
      status: status ? status : 'fail',
      message: message ? message : err.message,
    });
  } catch (error) {
    console.log('Error in logging data...');
  }
  next();
};

module.exports = errorLogger;
