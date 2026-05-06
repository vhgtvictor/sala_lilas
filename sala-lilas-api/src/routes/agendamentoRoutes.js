const express = require("express");
const { criarAgendamento, atualizarStatusExpress } = require("../controllers/agendamentoController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", criarAgendamento);
router.patch("/:id/status", authMiddleware, atualizarStatusExpress);

module.exports = router;
