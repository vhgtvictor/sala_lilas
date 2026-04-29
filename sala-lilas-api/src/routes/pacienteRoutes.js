const express = require("express");
const {
  listarPacientes,
  buscarPacientePorId
} = require("../controllers/pacienteController");

const router = express.Router();

router.get("/", listarPacientes);
router.get("/:id", buscarPacientePorId);

module.exports = router;
