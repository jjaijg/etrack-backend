const {
  createUser,
  getUserById,
  getUsers,
  deleteUser,
} = require("./user.controller");
const router = require("express").Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
// router.patch("/", createUser);
router.delete("/", deleteUser);

module.exports = router;
