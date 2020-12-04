const {
  createUser,
  login,
  updateUser,
  getUserById,
} = require('./user.controller');
const router = require('express').Router();
const { verifyToken } = require('../../middlewares/auth');
const badRequest = require('../../middlewares/404');

// router.get('/', checkToken, getUsers);
router.get('/profile', verifyToken, getUserById);
router.post('/', createUser);
router.put('/', verifyToken, updateUser);
// router.delete('/', checkToken, deleteUser);
router.post('/login', login);
router.all('*', badRequest);

module.exports = router;
