const express = require("express");
const cors = require("cors");
const statusRoutes = require("./routes/statusRoutes");
const authRoutes = require("./src/routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", statusRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  return res.status(404).json({
    sucesso: false,
    dados: null,
    mensagem: "Rota nao encontrada."
  });
});

app.use(errorHandler);

module.exports = app;
