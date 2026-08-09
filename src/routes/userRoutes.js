const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", protect, authorize("administrador"), getUsers);
router.get("/:id", protect, authorize("administrador"), getUserById);
router.post("/", createUser); // el registro público sigue siendo libre
router.put("/:id", protect, authorize("administrador"), updateUser);
router.delete("/:id", protect, authorize("administrador"), deleteUser);

module.exports = router;
