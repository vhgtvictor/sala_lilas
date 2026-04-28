const express = require("express");
const { checkDatabaseConnection } = require("../config/database");

const router = express.Router();

router.get("/status", async (req, res, next) => {
  try {
    await checkDatabaseConnection();

    return res.status(200).json({
      sucesso: true,
      dados: {
        api: "online",
        banco: "conectado"
      },
      mensagem: "API e banco de dados operacionais."
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
