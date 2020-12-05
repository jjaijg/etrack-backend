const {
  validateAmount,
  validateDescription,
  validateType,
} = require('../utils/validator');
const { createError } = require('../utils/helpers');

const txnValidator = (validatorName, dataToValidate) => {
  const { isValid, ...errProps } = validatorName(dataToValidate);
  if (!isValid) {
    throw createError(errProps);
  }
};

const validateTransactionData = async (req, res, next) => {
  try {
    const { amount, type, description } = req.body;

    if (!amount || !type || !description) {
      throw createError({
        status: 'fail',
        statusCode: 400,
        message: 'All fields are required.',
      });
    }

    txnValidator(validateAmount, amount);
    txnValidator(validateType, type);
    txnValidator(validateDescription, description);

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = validateTransactionData;
