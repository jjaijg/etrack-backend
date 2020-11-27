const router = require('express').Router();

const {
  createTxn,
  updateTxn,
  getTxnById,
  getTxnByUser,
  deleteTxn,
} = require('./transaction.controller');

const { verifyToken } = require('../../middlewares/auth');
const validateTxn = require('../../middlewares/transaction.validator');
const badRequest = require('../../middlewares/404');

router.post('/', verifyToken, validateTxn, createTxn);
router.get('/', verifyToken, getTxnByUser);
router.get('/:id', verifyToken, getTxnById);
router.put('/:id', verifyToken, validateTxn, updateTxn);
router.delete('/:id', verifyToken, deleteTxn);
router.all('*', badRequest);
module.exports = router;
