const { compareSync } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { createError, encryptData } = require('../../utils/helpers');
const {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} = require('../../utils/validator');
const { createToken, verifyPass } = require('../../utils/auth');

const {
  createUserService,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
} = require('./user.service');
const userService = require('./user.service');

const userValidator = (validatorName, dataToValidate) => {
  const { isValid, ...errProps } = validatorName(dataToValidate);
  if (!isValid) {
    throw createError(errProps);
  }
};

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;

    userValidator(validateName, username);
    userValidator(validateEmail, email);
    userValidator(validatePhone, phone);
    userValidator(validatePassword, password);

    const data = {
      username,
      email,
      phone,
      password: encryptData(password),
    };

    const user = await createUserService(data);
    const token = createToken(user);

    return res.status(201).json({
      status: 'success',
      message: `Welcome ${username}!!!`,
      token,
      data: user,
    });
  } catch (error) {
    console.log('user error : ', error);
    next(error);
  }
};

userController.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    userValidator(validateEmail, email);

    const user = await getUserByEmail(email);

    if (user) {
      if (verifyPass(password, user.password)) {
        const { password, activated, ...userDetails } = user;
        const token = createToken(userDetails);

        return res.status(200).json({
          status: 'success',
          message: `Welcome back, ${user.username}!!!`,
          token,
          data: userDetails,
        });
      }
    }
    throw createError({
      status: 'fail',
      statusCode: 404,
      message: 'invalid email/password',
    });
  } catch (error) {
    next(error);
  }
};

userController.updateUser = async (req, res, next) => {
  try {
    const errObj = {
      statusCode: 400,
      status: 'fail',
      message: 'No Details updated!',
    };
    const {
      body: { username, phone },
      user,
    } = req;

    userValidator(validateName, username);
    userValidator(validatePhone, phone);

    console.log('user : ', username, user.username, phone, user.phone);

    if (username === user.username && phone.toString() === user.phone) {
      throw createError({
        ...errObj,
      });
    }

    const userDetails = { id: user.id, username, phone };

    const isUpdated = await userService.updateUser(userDetails);

    if (isUpdated.changedRows) {
      const updatedUser = await userService.getUserByIdService(user.id);
      const token = createToken(updatedUser);

      return res.status(201).json({
        status: 'success',
        message: `Profile details updated successfully!`,
        token,
        data: updatedUser,
      });
    } else {
      throw createError({
        ...errObj,
        message: 'Error in updating the details!, Please try again!',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = userController;

/*

  getUserById: (req, res) => {
    const id = req.user.id;

    getUserById(id, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (!result) {
        return res.json({
          success: 0,
          message: 'Not Authorised!',
        });
      }
      return res.json({
        success: 1,
        data: result,
        message: 'Authentication successful!!!',
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

*/
