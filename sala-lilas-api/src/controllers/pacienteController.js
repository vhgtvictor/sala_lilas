const prisma = require("../../config/prismaClient");

async function listarPacientes(req, res, next) {
  try {
    const pacientes = await prisma.paciente.findMany({
      include: {
        agendamentos: {
          orderBy: {
            criadoEm: "desc"
          }
        },
        encaminhamentos: {
          orderBy: {
            criadoEm: "desc"
          }
        },
        prontuario: true
      },
      orderBy: {
        criadoEm: "desc"
      }
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Pacientes listados",
      dados: pacientes
    });
  } catch (error) {
    return next(error);
  }
}

async function buscarPacientePorId(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de paciente invalido.",
        dados: null
      });
    }

    const paciente = await prisma.paciente.findUnique({
      where: { id },
      include: {
        agendamentos: {
          orderBy: {
            criadoEm: "desc"
          }
        },
        encaminhamentos: {
          orderBy: {
            criadoEm: "desc"
          }
        },
        prontuario: true
      }
    });

    if (!paciente) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Paciente nao encontrado.",
        dados: null
      });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: "Paciente encontrado.",
      dados: paciente
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listarPacientes,
  buscarPacientePorId
};
