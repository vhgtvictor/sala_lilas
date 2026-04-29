const express = require("express");
const {
  listarEncaminhamentos,
  moverEncaminhamento
} = require("../controllers/encaminhamentoController");

const router = express.Router();

router.get("/", listarEncaminhamentos);
router.put("/:id/mover", moverEncaminhamento);

module.exports = router;
