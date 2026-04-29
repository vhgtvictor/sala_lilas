const express = require("express");
const { obterDadosDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/estatisticas", obterDadosDashboard);

module.exports = router;
