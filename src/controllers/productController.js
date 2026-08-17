const Product = require("../models/Product");

// @desc    Obtener todos los productos (con búsqueda y filtro opcional)
// @route   GET /api/products?buscar=texto&categoria=ID
const getProducts = async (req, res) => {
  try {
    const { buscar, categoria } = req.query;

    const filtro = {};

    if (buscar) {
      filtro.nombre = { $regex: buscar, $options: "i" };
    }

    if (categoria) {
      filtro.categoria = categoria;
    }

    const products = await Product.find(filtro)
      .populate("categoria", "nombre slug")
      .populate("vendedor", "nombre email");

    res.json(products);
  } catch (error) {
    res.status(500).json({
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
    const { nombre, precio, descripcion, stock, categoria } = req.body;

    const product = await Product.create({
      nombre,
      precio,
      descripcion,
      stock,
      categoria,
      vendedor: req.user._id,
    });

    const productoConDetalle = await Product.findById(product._id)
      .populate("categoria", "nombre slug")
      .populate("vendedor", "nombre email");

    res.status(201).json(productoConDetalle);
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
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    // El admin puede editar cualquier producto; el vendedor solo los suyos
    const esDueño = product.vendedor.toString() === req.user._id.toString();
    if (req.user.role !== "administrador" && !esDueño) {
      return res
        .status(403)
        .json({ mensaje: "No podés editar productos de otro vendedor" });
    }
    const productActualizado = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("categoria", "nombre slug")
      .populate("vendedor", "nombre email");

    res.json(productActualizado);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const esDueño = product.vendedor.toString() === req.user._id.toString();
    if (req.user.role !== "administrador" && !esDueño) {
      return res
        .status(403)
        .json({ mensaje: "No podés eliminar productos de otro vendedor" });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el producto", error: error.message });
  }
};

// @desc    Finalizar compra: descuenta stock de todos los productos del carrito
// @route   POST /api/products/comprar
const comprarProductos = async (req, res) => {
  try {
    const { items } = req.body; // [{ productoId, cantidad }]

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "El carrito está vacío o es inválido" });
    }

    // Primero validamos que TODOS los productos tengan stock suficiente,
    // antes de descontar nada (para no dejar la compra a medio hacer)
    for (const item of items) {
      const producto = await Product.findById(item.productoId);

      if (!producto) {
        return res
          .status(404)
          .json({ mensaje: `Producto no encontrado (${item.productoId})` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`,
        });
      }
    }

    // descontamos el stock real de los productos
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productoId, {
        $inc: { stock: -item.cantidad },
      });
    }

    res.json({ mensaje: "Compra realizada con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al procesar la compra", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  comprarProductos,
};
