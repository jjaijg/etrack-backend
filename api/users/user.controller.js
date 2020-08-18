const { genSaltSync, hashSync, compareSync } = require("bcryptjs");

const {
  create,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
} = require("./user.service");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    create(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUserById: (req, res) => {
    const id = req.params.id;

    getUserById(id, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (!result) {
        return res.json({
          success: 0,
          message: "Record not found!",
        });
      }
      return res.json({
        success: 1,
        data: result,
      });
    });
  },
  getUsers: (req, res) => {
    getUsers((err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!result) {
        return res.json({
          success: 0,
          message: "Records not found!",
          data: result,
        });
      }
      return res.json({
        success: 1,
        data: result,
      });
    });
  },
  deleteUser: (req, res) => {
    const { body } = req;
    deleteUser(body, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: "Profile Deleted successfully!!!",
      });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    getUserByEmail(email, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!result.length) {
        return res.json({
          success: 0,
          message: "Invalid email/password",
        });
      }
    });
  },
};
