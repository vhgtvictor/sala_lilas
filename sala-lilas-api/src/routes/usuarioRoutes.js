const express = require("express");
const {
  listarUsuarios,
  criarUsuario,
  deletarUsuario
} = require("../controllers/authController");
const { aceitarTermos } = require("../controllers/usuarioController");
const { authMiddleware, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.patch("/aceitar-termos", authMiddleware, aceitarTermos);

router.use(authMiddleware, checkRole(["ADMINISTRADOR", "EQUIPE_TECNICA"]));

router.get("/", listarUsuarios);
router.post("/", criarUsuario);
router.delete("/:id", deletarUsuario);

module.exports = router;
