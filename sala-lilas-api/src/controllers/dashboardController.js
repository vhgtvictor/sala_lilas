const prisma = require("../../config/prismaClient");

async function obterDadosDashboard(req, res, next) {
  try {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    const inicioDia = new Date(`${ano}-${mes}-${dia}T00:00:00-03:00`);
    const fimDia = new Date(`${ano}-${mes}-${dia}T23:59:59-03:00`);

    const [agendamentosHoje, totalProntuarios, pendencias, proximosAgendamentos] = await Promise.all([
      prisma.agendamento.count({
        where: {
          dataDesejada: {
            gte: inicioDia,
            lte: fimDia
          },
          status: {
            not: "CANCELADO"
          }
        }
      }),
      prisma.prontuario.count(),
      prisma.encaminhamento.count({
        where: {
          status: "AGUARDANDO"
        }
      }),
      prisma.agendamento.findMany({
        where: {
          dataDesejada: {
            gte: inicioDia,
            lte: fimDia
          },
          status: {
            not: "CANCELADO"
          }
        },
        orderBy: {
          horario: "asc"
        },
        include: {
          paciente: {
            select: {
              nome: true
            }
          }
        }
      })
    ]);

    console.log('Agendamentos hoje:', agendamentosHoje);
    console.log('Próximos agendamentos:', proximosAgendamentos);

    const proximos = proximosAgendamentos.map((agendamento) => ({
      id: agendamento.id,
      nome: agendamento.paciente.nome,
      horario: agendamento.horario
    }));

    return res.json({
      sucesso: true,
      dados: {
        totalAgendamentosHoje: agendamentosHoje,
        totalProntuarios: totalProntuarios,
        totalPendencias: pendencias,
        proximosAgendamentos: proximos
      },
      mensagem: "Dados do dashboard obtidos com sucesso."
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  obterDadosDashboard
};
