const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join('logs', 'requests.log'), {
  flags: 'a',
});

// setup the logger
module.exports = morgan('combined', { stream: accessLogStream });
