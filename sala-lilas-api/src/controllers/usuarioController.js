const prisma = require("../../config/prismaClient");

async function aceitarTermos(req, res, next) {
  try {
    console.log("[aceitarTermos] req.usuarioId:", req.usuarioId);
    console.log("[aceitarTermos] req.usuario:", req.usuario);

    const usuarioId = Number(req.usuarioId);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      console.error("[aceitarTermos] ID de usuário inválido:", usuarioId);
      return res.status(400).json({
        sucesso: false,
        mensagem: "Usuario id invalido.",
        dados: null
      });
    }

    console.log("[aceitarTermos] Atualizando usuário com ID:", usuarioId);

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        termosAceitos: true,
        dataAceiteTermos: new Date()
      }
    });

    console.log("[aceitarTermos] Usuário atualizado com sucesso:", usuarioAtualizado.id);

    return res.status(200).json({
      sucesso: true,
      mensagem: "Termos de responsabilidade aceitos com sucesso.",
      dados: {
        usuario: {
          id: usuarioAtualizado.id,
          termosAceitos: usuarioAtualizado.termosAceitos,
          dataAceiteTermos: usuarioAtualizado.dataAceiteTermos
        }
      }
    });
  } catch (error) {
    console.error("[aceitarTermos] Erro ao processar requisição:", error.message);
    return next(error);
  }
}

module.exports = {
  aceitarTermos
};
