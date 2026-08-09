const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ mensaje: "No autorizado, token no encontrado" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ mensaje: "No autorizado, usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ mensaje: "No autorizado, token inválido o expirado" });
  }
};

const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.role)) {
      return res
        .status(403)
        .json({ mensaje: "No tenés permisos para realizar esta acción" });
    }
    next();
  };
};

module.exports = { protect, authorize };
