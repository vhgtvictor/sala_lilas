const express = require("express");
const cors = require("cors");
const statusRoutes = require("./routes/statusRoutes");
const authRoutes = require("./src/routes/authRoutes");
const agendamentoRoutes = require("./src/routes/agendamentoRoutes");
const relatorioRoutes = require("./src/routes/relatorioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", statusRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/agendamentos", agendamentoRoutes);
app.use("/api/relatorios", relatorioRoutes);

module.exports = app;
