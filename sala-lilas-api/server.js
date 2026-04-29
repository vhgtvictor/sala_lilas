require("dotenv").config();
const app = require("./app");
const pacienteRoutes = require("./src/routes/pacienteRoutes");
const prontuarioRoutes = require("./src/routes/prontuarioRoutes");
const encaminhamentoRoutes = require("./src/routes/encaminhamentoRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const authMiddleware = require("./src/middlewares/authMiddleware");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

process.on("uncaughtException", (error) => {
  console.error("Erro nao tratado:", error.message);
});

process.on("unhandledRejection", (error) => {
  console.error("Promessa rejeitada sem tratamento:", error?.message || error);
});

app.use("/api/pacientes", authMiddleware, pacienteRoutes);
app.use("/api/prontuarios", authMiddleware, prontuarioRoutes);
app.use("/api/encaminhamentos", authMiddleware, encaminhamentoRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

app.use((req, res) => {
  return res.status(404).json({
    sucesso: false,
    dados: null,
    mensagem: "Rota nao encontrada."
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});
