require("dotenv").config();
const express = require("express");
const app = express();

const userRouter = require("./api/users/user.router");

app.use(express.json());
app.use("*", (req, res, next) => {
  console.log(req.originalUrl);
  next();
});
app.use("/api/users", userRouter);

app.listen(process.env.APP_PORT || 3000, () => {
  console.log("Server started at 3000");
});
