const router = require('express').Router();
const {
  createxpense,
  getexpense,
  deleteexpense,
  getExpenseById,
  gettotalexpense,
} = require('./expense.controller');
const { checkToken } = require('../../auth/token_validation');

router.post('/', checkToken, createxpense);
router.get('/', checkToken, getexpense);
router.get('/:id', checkToken, getExpenseById);
router.get('/dashboard/total', checkToken, gettotalexpense);
router.delete('/', checkToken, deleteexpense);
module.exports = router;
