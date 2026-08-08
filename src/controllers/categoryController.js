const Category = require("../models/Category");

// @desc    Obtener todas las categorías
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({
        mensaje: "Error al obtener las categorías",
        error: error.message,
      });
  }
};

// @desc    Obtener una categoría por ID
// @route   GET /api/categories/:id
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener la categoría", error: error.message });
  }
};

// @desc    Crear una nueva categoría
// @route   POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { nombre, slug } = req.body;

    const category = await Category.create({ nombre, slug });

    res.status(201).json(category);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear la categoría", error: error.message });
  }
};

// @desc    Actualizar una categoría
// @route   PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    res
      .status(400)
      .json({
        mensaje: "Error al actualizar la categoría",
        error: error.message,
      });
  }
};

// @desc    Eliminar una categoría
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        mensaje: "Error al eliminar la categoría",
        error: error.message,
      });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
