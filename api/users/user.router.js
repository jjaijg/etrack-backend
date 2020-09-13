const {
  createUser,
  getUserById,
  getUsers,
  deleteUser,
  login,
} = require('./user.controller');
const router = require('express').Router();
const { checkToken } = require('../../auth/token_validation');

router.get('/', checkToken, getUsers);
router.get('/profile', checkToken, getUserById);
router.post('/', createUser);
// router.patch("/", createUser);
router.delete('/', checkToken, deleteUser);
router.post('/login', login);

module.exports = router;
