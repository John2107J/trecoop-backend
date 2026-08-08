const Product = require("../models/Product");

// @desc    Obtener todos los productos
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoria", "nombre slug")
      .populate("vendedor", "nombre email");
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({
        mensaje: "Error al obtener los productos",
        error: error.message,
      });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoria", "nombre slug")
      .populate("vendedor", "nombre email");

    if (!product) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el producto", error: error.message });
  }
};

// @desc    Crear un nuevo producto
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, stock, categoria, vendedor } =
      req.body;

    const product = await Product.create({
      nombre,
      precio,
      descripcion,
      stock,
      categoria,
      vendedor,
    });

    res.status(201).json(product);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear el producto", error: error.message });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res
      .status(400)
      .json({
        mensaje: "Error al actualizar el producto",
        error: error.message,
      });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el producto", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
