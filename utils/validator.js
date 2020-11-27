/*
If all success return {isValid: true, status: "success"}
If error return {isValid: false, message: "", statusCode: 400, status: "error"}
*/
const validator = {};
const SUCCESS_OBJ = { isValid: true, status: 'success' };
const ERROR_OBJ = {
  isValid: false,
  statusCode: 400,
  status: 'error',
};

// ------------------------------ User validation ------------------------------

// validate name
/*
1. name should contain 2 char atleast
2. should contain alphabets
3. should not contain only spaces
*/
validator.validateName = (name) => {
  if (!name || name?.trim().length < 2)
    return {
      ...ERROR_OBJ,
      message: 'Name should contain minimum 2 characters',
    };
  if (name && /^[0-9]+$/.test(name))
    return { ...ERROR_OBJ, message: 'Name should contain alphabets' };
  return SUCCESS_OBJ;
};

// validate email - regex
validator.validateEmail = (email) => {
  if (
    email &&
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    return SUCCESS_OBJ;
  }
  return { ...ERROR_OBJ, message: 'Please enter a valid mail id' };
};

// validate mobile
/*
1. lenght should be 10
2. should not start with zeros
3. should not contain only zeros
*/
validator.validatePhone = (phone) => {
  if (phone && phone.toString().length === 10) return SUCCESS_OBJ;
  return { ...ERROR_OBJ, message: 'Phone number must contain 10 digits' };
};

// validate password
/*
1. lenght should be minimum 5, maximum 12
2. should contain alphabets
3. should contain numbers
4. should contain symbols
*/
validator.validatePassword = (pass) => {
  if (
    pass &&
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,12}$/.test(pass)
  )
    return SUCCESS_OBJ;
  return {
    ...ERROR_OBJ,
    message: [
      'Password length should be 5 to 12',
      'Should contain alphabets',
      'Should contain number',
      'Should contain symbol',
    ],
  };
};

// -------------------------- transaction validation ---------------------------

// Validate amount
/*
1. check amount is b/w 1 to 1000000
2. check amount is not empty
3. check amount is not invalid value
*/
validator.validateAmount = (amount) => {
  const MIN_AMOUNT = process.env.MIN_AMOUNT || 1;
  const MAX_AMOUNT = process.env.MAX_AMOUNT || 10000;

  if (amount && typeof amount === 'number') {
    if (amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return {
        ...ERROR_OBJ,
        message: `Amount should be between ${MIN_AMOUNT} and ${MAX_AMOUNT}`,
      };
    }
    return SUCCESS_OBJ;
  } else {
    return {
      ...ERROR_OBJ,
      message: `Amount field is invalid, Please enter a valid amount`,
    };
  }
};

// Validate Transaction type
validator.validateType = (transType) => {
  if (!transType) {
    return {
      ...ERROR_OBJ,
      message: `Type field is invalid, Please enter a valid Type`,
    };
  }
  const parsedType = transType.trim().toLowerCase();

  if (parsedType === 'income' || parsedType === 'expense') {
    return SUCCESS_OBJ;
  }
  return {
    ...ERROR_OBJ,
    message: `Transaction type should be Income/Expense`,
  };
};

// Validate Transaction description
validator.validateDescription = (desc) => {
  if (!desc || desc?.trim().length < 2)
    return {
      ...ERROR_OBJ,
      message: 'Description should contain minimum 2 characters',
    };

  return SUCCESS_OBJ;
};

module.exports = validator;
