const User = require("../models/User");

// @desc    Obtener todos los usuarios
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener los usuarios", error: error.message });
  }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el usuario", error: error.message });
  }
};

// @desc    Crear un nuevo usuario
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe un usuario con ese email" });
    }

    const user = await User.create({ nombre, email, password, role });

    // No devolvemos el objeto completo del create (podría traer password si algo falla),
    // volvemos a buscarlo para asegurarnos de que select:false se aplique
    const userSinPassword = await User.findById(user._id);

    res.status(201).json(userSinPassword);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear el usuario", error: error.message });
  }
};

// @desc    Actualizar un usuario
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { password, ...datosSinPassword } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, datosSinPassword, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(400)
      .json({
        mensaje: "Error al actualizar el usuario",
        error: error.message,
      });
  }
};

// @desc    Eliminar un usuario
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el usuario", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
