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
  getUserByEmail,
  getUserByIdService,
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

    if (username === user.username && phone.toString() === user.phone) {
      throw createError({
        ...errObj,
      });
    }

    const userDetails = { ...user, username, phone };

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

userController.changePassword = async (req, res, next) => {
  try {
    const {
      user: { id, email },
      body: { oldPassword, password },
    } = req;

    userValidator(validatePassword, password);

    const user = await getUserByEmail(email);

    if (user) {
      if (verifyPass(oldPassword, user.password)) {
        if (user.password === password) {
          throw createError({
            status: 'fail',
            statusCode: 400,
            message: 'Old password and New password are same!',
          });
        }

        const isUpdated = await userService.updateUserPass(
          id,
          encryptData(password)
        );
        if (isUpdated.changedRows) {
          // const { password: oldPass, activated, ...userDetails } = user;
          // const token = createToken(userDetails);

          return res.status(200).json({
            status: 'success',
            message: `Password updated successfully!!!`,
          });
        } else {
          throw createError({
            status: 'fail',
            statusCode: 400,
            message: 'Error in updating the password, please try again!',
          });
        }
      } else {
        throw createError({
          status: 'fail',
          statusCode: 400,
          message: 'Old password is invalid!',
        });
      }
    }
    throw createError({
      status: 'fail',
      statusCode: 400,
      message: 'Error in updating the password, please try again!!',
    });
  } catch (error) {
    next(error);
  }
};

userController.getUserById = async (req, res, next) => {
  try {
    const id = req.user.id;

    const user = await getUserByIdService(id);

    if (user) {
      return res.json({
        status: 'success',
        message: 'profile obtained successflly!',
        data: user,
      });
    } else {
      throw createError({
        statusCode: 403,
        status: 'fail',
        message: 'Invalid token or token expired!',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = userController;

/*

  getUsers: (req, res) => {
    getUsers((err, result) => {
      if (err) {
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
