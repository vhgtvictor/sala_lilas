require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

process.on("uncaughtException", (error) => {
  console.error("Erro nao tratado:", error.message);
});

process.on("unhandledRejection", (error) => {
  console.error("Promessa rejeitada sem tratamento:", error?.message || error);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});
