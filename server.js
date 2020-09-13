require('dotenv').config();
const express = require('express');
const app = express();
var cors = require('cors');

const userRouter = require('./api/users/user.router');
const expenseRouter = require('./api/expenses/expense.router');

app.use(cors());
app.use(express.json());
app.use('*', (req, res, next) => {
  console.log(req.originalUrl);
  next();
});
app.use('/api/users', userRouter);
app.use('/api/expenses', expenseRouter);

app.listen(process.env.APP_PORT || 3000, () => {
  console.log('Server started at 3100');
});
