const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", protect, authorize("administrador"), createCategory);
router.put("/:id", protect, authorize("administrador"), updateCategory);
router.delete("/:id", protect, authorize("administrador"), deleteCategory);

module.exports = router;
