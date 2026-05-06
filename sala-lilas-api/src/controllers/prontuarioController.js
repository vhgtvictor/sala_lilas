const prisma = require("../../config/prismaClient");

async function salvarProntuario(req, res, next) {
  try {
    if (req.usuario?.perfil === "ATENDENTE") {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Acesso negado. Seu perfil não permite alterar prontuários.",
        dados: null
      });
    }

    const pacienteId = Number(req.params.pacienteId);
    const { evolucaoGeral, obsPsicologia, statusJuridico } = req.body;

    if (!Number.isInteger(pacienteId) || pacienteId <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "pacienteId invalido.",
        dados: null
      });
    }

    const prontuario = await prisma.prontuario.upsert({
      where: { pacienteId },
      update: {
        evolucaoGeral,
        obsPsicologia,
        statusJuridico
      },
      create: {
        pacienteId,
        evolucaoGeral,
        obsPsicologia,
        statusJuridico
      }
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Prontuario salvo com sucesso.",
      dados: prontuario
    });
  } catch (error) {
    return next(error);
  }
}

async function obterProntuario(req, res, next) {
  try {
    const { pacienteId } = req.params;
    const prontuario = await prisma.prontuario.findUnique({
      where: { pacienteId: Number(pacienteId) }
    });

    return res.status(200).json({
      sucesso: true,
      dados: prontuario ?? null
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  salvarProntuario,
  obterProntuario
};
