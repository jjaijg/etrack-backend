const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const {
  create,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
} = require('./user.service');

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    console.log(body.password);
    create(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'User already exist!!!',
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
        message: 'Registration successful!!!!',
      });
    });
  },
  getUserById: (req, res) => {
    const id = req.user.id;

    getUserById(id, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (!result) {
        return res.json({
          success: 0,
          message: 'Record not found!',
        });
      }
      return res.json({
        success: 1,
        data: result,
        message: 'Registration successful!!!',
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
          message: 'Records not found!',
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
    const { id } = req.user;
    deleteUser(id, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      req.user = null;
      return res.json({
        success: 1,
        data: 'Profile Deleted successfully!!!',
      });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    getUserByEmail(email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: 'Invalid email/password',
        });
      }
      // console.log(password, results.password);

      const result = compareSync(password, results.password);
      if (result) {
        const { password, ...userDetails } = results;
        const jsontoken = sign({ result: userDetails }, 'qwe123', {
          expiresIn: '12h',
        });
        return res.json({
          success: 1,
          message: 'logged in succssfully',
          token: jsontoken,
          user: userDetails,
        });
      } else {
        return res.json({
          success: 0,
          message: 'Invalid email or password',
        });
      }
    });
  },
};
