const express = require("express");
const { salvarProntuario } = require("../controllers/prontuarioController");

const router = express.Router();

router.post("/:pacienteId", salvarProntuario);

module.exports = router;
