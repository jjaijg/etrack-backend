const router = require('express').Router();

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getDefaultCategories,
  getUserCategories,
} = require('./category.controller');

const { verifyToken } = require('../../middlewares/auth');
const badRequest = require('../../middlewares/404');

router.post('/', verifyToken, createCategory);
router.get('/', verifyToken, getAllCategories);
router.get('/default', verifyToken, getDefaultCategories);
router.get('/user', verifyToken, getUserCategories);
router.get('/:id', verifyToken, getCategoryById);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);
router.all('*', badRequest);
module.exports = router;
