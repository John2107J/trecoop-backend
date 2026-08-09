require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

// Registrar todos los modelos para que populate() funcione correctamente
require("./models/User");
require("./models/Category");
require("./models/Product");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de Trecoop funcionando correctamente");
});

const categoryRoutes = require("./routes/categoryRoutes");

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
