require('dotenv').config();
const express = require('express');
const app = express();
var cors = require('cors');
const port = process.env.APP_PORT || 3000;

const userRouter = require('./api/users/user.router');
const categoryRouter = require('./api/categories/category.router');
const txnRouter = require('./api/transactions/transaction.router');

// App Middleware
app.use(express.json(), cors());
app.use(require('./utils/requestLogger'));

// App Router
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/transactions', txnRouter);

// Error middleware
app.use(require('./utils/errorLogger'));

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
