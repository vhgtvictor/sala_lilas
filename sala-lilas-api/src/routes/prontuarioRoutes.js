const express = require("express");
const { salvarProntuario, obterProntuario } = require("../controllers/prontuarioController");

const router = express.Router();

router.get("/:pacienteId", obterProntuario);
router.post("/:pacienteId", salvarProntuario);

module.exports = router;
