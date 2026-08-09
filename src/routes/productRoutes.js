const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  authorize("vendedor", "administrador"),
  createProduct,
);
router.put(
  "/:id",
  protect,
  authorize("vendedor", "administrador"),
  updateProduct,
);
router.delete(
  "/:id",
  protect,
  authorize("vendedor", "administrador"),
  deleteProduct,
);

module.exports = router;
