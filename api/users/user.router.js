const {
  createUser,
  login,
  updateUser,
  changePassword,
  getUserById,
} = require('./user.controller');
const router = require('express').Router();
const { verifyToken } = require('../../middlewares/auth');
const badRequest = require('../../middlewares/404');

// router.get('/', checkToken, getUsers);
router.get('/profile', verifyToken, getUserById);
router.post('/', createUser);
router.put('/', verifyToken, updateUser);
router.put('/changepassword', verifyToken, changePassword);
router.post('/login', login);
router.all('*', badRequest);

module.exports = router;
