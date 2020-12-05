const {
  createTxnService,
  updateTxnService,
  deleteTxnService,
  getTxnByIdService,
  getTxnByUserService,
} = require('./transaction.service');
const { createError } = require('../../utils/helpers');

const txnController = {};

txnController.createTxn = async (req, res, next) => {
  try {
    const {
      body: { cid, amount, type, description, tdate },
      user,
    } = req;

    const txn = await createTxnService({
      cid,
      amount,
      type: type.toLowerCase(),
      description,
      tdate,
      uid: user.id,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Transaction added successfully!',
      data: txn,
    });
  } catch (error) {
    next(error);
  }
};

txnController.updateTxn = async (req, res, next) => {
  try {
    const {
      body: { cid, amount, type, description, tdate },
      params: { id },
      user,
    } = req;

    const isUpdated = await updateTxnService(id, {
      cid,
      amount,
      type,
      description,
      tdate,
      uid: user.id,
    });

    if (isUpdated.changedRows) {
      const txnArray = await getTxnByIdService(id, user.id);

      if (txnArray.length) {
        return res.json({
          status: 'success',
          message: 'Transaction updated successfully!',
          data: txnArray[0],
        });
      } else {
        throw createError({
          statusCode: 400,
          status: 'fail',
          message:
            'Error in fetching the transaction, please refresh the page!',
        });
      }
    } else {
      throw createError({
        statusCode: 400,
        status: 'fail',
        message: 'Error in updating the transaction, please try again!',
      });
    }
  } catch (error) {
    next(error);
  }
};

txnController.getTxnById = async (req, res, next) => {
  try {
    const {
      params: { id },
      user,
    } = req;

    const txnArray = await getTxnByIdService(id, user.id);

    if (txnArray.length) {
      return res.json({
        status: 'success',
        message: 'Transaction found!',
        data: txnArray[0],
      });
    } else {
      throw createError({
        statusCode: 404,
        status: 'fail',
        message: 'Transaction not found!',
      });
    }
  } catch (error) {
    next(error);
  }
};

txnController.getTxnByUser = async (req, res, next) => {
  try {
    const { user } = req;

    const txnArray = await getTxnByUserService(user.id);

    if (txnArray.length) {
      return res.json({
        status: 'success',
        message: 'Transactions found!',
        data: txnArray,
      });
    } else {
      throw createError({
        statusCode: 404,
        status: 'fail',
        message: 'No transactions added! Please make your 1st transaction',
      });
    }
  } catch (error) {
    next(error);
  }
};

txnController.deleteTxn = async (req, res, next) => {
  try {
    const {
      params: { id },
      user,
    } = req;

    const isDeleted = await deleteTxnService(id, user.id);

    if (isDeleted.affectedRows) {
      return res.json({
        status: 'success',
        message: 'Transaction deleted successfully!',
      });
    } else {
      throw createError({
        statusCode: 404,
        status: 'fail',
        message: 'No transaction fund! please try again',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = txnController;
