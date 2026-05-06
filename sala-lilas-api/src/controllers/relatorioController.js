const prisma = require("../../config/prismaClient");

async function obterRelatorioCompleto(req, res, next) {
  try {
    const { dataInicio, dataFim } = req.query;

    let filtroData = {};

    if (dataInicio && dataFim) {
      filtroData.criadoEm = {
        gte: new Date(dataInicio),
        lte: new Date(`${dataFim}T23:59:59.999Z`)
      };
    }

    // 1. Total de Pacientes
    const totalPacientes = await prisma.paciente.count({
      where: filtroData
    });

    // 2. Agendamentos por Status
    const agendamentosPorStatus = await prisma.agendamento.groupBy({
      by: ["status"],
      _count: {
        id: true
      },
      where: filtroData
    });

    // 3. Encaminhamentos por Setor
    const encaminhamentosPorSetor = await prisma.encaminhamento.groupBy({
      by: ["setorDestino"],
      _count: {
        id: true
      },
      where: Object.keys(filtroData).length
        ? {
            AND: [filtroData, { status: { not: "FINALIZADO" } }]
          }
        : {
            status: { not: "FINALIZADO" }
          }
    });

    // 4. Filas específicas (sem triagem)
    const filaPsicologia = await prisma.encaminhamento.count({
      where: Object.keys(filtroData).length
        ? {
            AND: [
              filtroData,
              {
                setorDestino: "PSICOLOGIA",
                status: { notIn: ["FINALIZADO", "AGUARDANDO"] }
              }
            ]
          }
        : {
            setorDestino: "PSICOLOGIA",
            status: { notIn: ["FINALIZADO", "AGUARDANDO"] }
          }
    });

    const filaNPJ = await prisma.encaminhamento.count({
      where: Object.keys(filtroData).length
        ? {
            AND: [
              filtroData,
              {
                setorDestino: "NPJ",
                status: { notIn: ["FINALIZADO", "AGUARDANDO"] }
              }
            ]
          }
        : {
            setorDestino: "NPJ",
            status: { notIn: ["FINALIZADO", "AGUARDANDO"] }
          }
    });

    // 5. Prontuários Finalizados (encaminhamentos com status FINALIZADO)
    const prontuariosFinalizados = await prisma.encaminhamento.count({
      where: Object.keys(filtroData).length
        ? {
            AND: [filtroData, { status: "FINALIZADO" }]
          }
        : {
            status: "FINALIZADO"
          }
    });

    // Formatar os dados para facilitar a leitura
    const agendamentosFormatado = agendamentosPorStatus.map((item) => ({
      status: item.status,
      total: item._count.id
    }));

    const encaminhamentosFormatado = encaminhamentosPorSetor.map((item) => ({
      setor: item.setorDestino,
      total: item._count.id
    }));

    const dados = {
      totalPacientes,
      agendamentosPorStatus: agendamentosFormatado,
      encaminhamentosPorSetor: encaminhamentosFormatado,
      prontuariosFinalizados,
      filaPsicologia,
      filaNPJ,
      dataRelatorio: new Date().toISOString()
    };

    return res.status(200).json({
      sucesso: true,
      mensagem: "Relatório completo obtido com sucesso.",
      dados
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  obterRelatorioCompleto
};
