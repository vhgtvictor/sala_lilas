const prisma = require("../../config/prismaClient");

async function listarEncaminhamentos(req, res, next) {
  try {
    const encaminhamentos = await prisma.encaminhamento.findMany({
      where: {
        status: {
          not: "FINALIZADO"
        }
      },
      include: {
        paciente: {
          select: {
            nome: true,
            cpf: true
          }
        }
      },
      orderBy: {
        criadoEm: "desc"
      }
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Encaminhamentos listados com sucesso.",
      dados: encaminhamentos
    });
  } catch (error) {
    return next(error);
  }
}

async function moverEncaminhamento(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { setorDestino, status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de encaminhamento invalido.",
        dados: null
      });
    }

    if (
      typeof setorDestino !== "string" ||
      typeof status !== "string" ||
      !setorDestino.trim() ||
      !status.trim()
    ) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "setorDestino e status sao obrigatorios.",
        dados: null
      });
    }

    const encaminhamentoAtualizado = await prisma.encaminhamento.update({
      where: { id },
      data: {
        setorDestino: setorDestino.trim(),
        status: status.trim()
      }
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Encaminhamento atualizado com sucesso.",
      dados: encaminhamentoAtualizado
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listarEncaminhamentos,
  moverEncaminhamento
};
