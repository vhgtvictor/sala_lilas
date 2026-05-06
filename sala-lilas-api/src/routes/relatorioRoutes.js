const express = require("express");
const { obterRelatorioCompleto } = require("../controllers/relatorioController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// GET /api/relatorios/completo - Obtém o relatório completo com KPIs
router.get("/completo", authMiddleware, obterRelatorioCompleto);

module.exports = router;
