const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Login de usuario
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Email y contraseña son obligatorios" });
    }

    // Traemos el usuario CON la password (select:false la oculta por defecto)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const passwordCorrecta = await user.compararPassword(password);

    if (!passwordCorrecta) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      usuario: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al iniciar sesión", error: error.message });
  }
};

module.exports = { login };
