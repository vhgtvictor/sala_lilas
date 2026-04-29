const prisma = require("../../config/prismaClient");

async function criarAgendamento(req, res, next) {
  try {
    const { nome, cpf, dataNascimento, dataDesejada, horario } = req.body;

    if (!nome || !cpf || !dataNascimento || !dataDesejada || !horario) {
      return res.status(400).json({
        sucesso: false,
        mensagem:
          "Nome, CPF, data de nascimento, data desejada e horario sao obrigatorios.",
        dados: null
      });
    }

    const dataNascimentoDate = new Date(dataNascimento);
    const dataDesejadaDate = new Date(`${dataDesejada}T12:00:00-03:00`);

    if (
      Number.isNaN(dataNascimentoDate.getTime()) ||
      Number.isNaN(dataDesejadaDate.getTime())
    ) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Datas informadas sao invalidas.",
        dados: null
      });
    }

    let paciente = await prisma.paciente.findUnique({
      where: { cpf }
    });

    if (!paciente) {
      paciente = await prisma.paciente.create({
        data: {
          nome,
          cpf,
          dataNascimento: dataNascimentoDate,
          numeroProcesso: "Aguardando"
        }
      });
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        dataDesejada: dataDesejadaDate,
        horario,
        status: "PENDENTE",
        pacienteId: paciente.id
      }
    });

    const encaminhamento = await prisma.encaminhamento.create({
      data: {
        pacienteId: paciente.id,
        setorDestino: "PSICOLOGIA",
        status: "AGUARDANDO",
        prioridade: "MEDIA",
        notas: "Entrada automática via Agendamento"
      }
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Agendamento realizado com sucesso.",
      dados: {
        agendamento,
        encaminhamento
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  criarAgendamento
};
