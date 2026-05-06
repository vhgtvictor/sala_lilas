import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardInicio() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("sala_lilas_token");

    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/dashboard/estatisticas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do dashboard");
      }

      const data = await response.json();

      if (data.sucesso) {
        setDashboardData(data.dados);
        console.log(data.dados);
      } else {
        toast.error(data.mensagem || "Erro ao carregar dados do dashboard");
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const alterarStatus = async (id, novoStatus) => {
    const token = localStorage.getItem("sala_lilas_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/agendamentos/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: novoStatus })
      });

      const data = await response.json();

      if (response.ok && data.sucesso) {
        console.log('Atualizou o status:', novoStatus);
        toast.success("Status atualizado com sucesso.");

        setDashboardData((prev) => {
          if (!prev) return prev;

          const proximosAgendamentos = prev.proximosAgendamentos
            .map((item) => {
              if (item.id !== id) return item;
              return { ...item, status: novoStatus };
            })
            .filter((item) => !(item.id === id && novoStatus === "CANCELADO"));

          return { ...prev, proximosAgendamentos };
        });

        await fetchDashboardData();
      } else {
        toast.error(data.mensagem || "Erro ao atualizar status.");
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  const currentIndicators = dashboardData ? [
    { label: "Atendimentos Hoje", value: dashboardData.totalAgendamentosHoje },
    { label: "Prontuários Ativos", value: dashboardData.totalProntuarios },
    { label: "Pendências", value: dashboardData.totalPendencias }
  ] : [
    { label: "Atendimentos Hoje", value: 0 },
    { label: "Prontuários Ativos", value: 0 },
    { label: "Pendências", value: 0 }
  ];

  const currentAppointments = dashboardData ? dashboardData.proximosAgendamentos : [];

  if (loading) {
    return (
      <section className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">Início do Painel</h1>
          <p className="mt-1 text-sm text-slate-600">
            Carregando dados...
          </p>
        </header>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Início do Painel</h1>
        <p className="mt-1 text-sm text-slate-600">
          Visão rápida dos atendimentos e atividades do dia.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {currentIndicators.map((item) => (
          <article
            key={item.label}
            className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-600">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-purple-700">{item.value}</p>
          </article>
        ))}
      </div>

      <article className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Próximos Atendimentos do Dia
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-3 py-2 font-semibold">Horário</th>
                <th className="px-3 py-2 font-semibold">Nome</th>
                <th className="px-3 py-2 font-semibold">Tipo</th>
                <th className="px-3 py-2 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appointment) => {
                  const horarioData = new Date(appointment.dataDesejada);
                  const estaAtrasado = new Date() > horarioData && appointment.status !== "ATENDIDO";
                  const horaExibicao = appointment.horario || horarioData.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

                  return (
                    <tr
                      key={appointment.id}
                      className={`border-b border-slate-100 ${appointment.status === "ATENDIDO" ? "bg-green-100 transition-colors" : "hover:bg-gray-50 transition-colors"}`}
                    >
                      <td className={`px-3 py-2 font-medium ${estaAtrasado ? "text-red-600 font-bold" : "text-purple-700"}`}>
                        {horaExibicao}
                      </td>
                      <td className="px-3 py-2">{appointment.nome}</td>
                      <td className="px-3 py-2 text-slate-600">{appointment.type || "Agendamento"}</td>
                      <td className="px-3 py-2">
                        {appointment.status !== "ATENDIDO" ? (
                          <div className="space-x-2">
                            <button
                              type="button"
                              onClick={() => alterarStatus(appointment.id, "ATENDIDO")}
                              className="rounded-full border border-green-500 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                            >
                              Atendido
                            </button>
                            <button
                              type="button"
                              onClick={() => alterarStatus(appointment.id, "CANCELADO")}
                              className="rounded-full border border-red-500 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                            >
                              Não Veio
                            </button>
                          </div>
                        ) : (
                          <span className="text-green-700 font-bold">Concluído</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-3 py-4 text-center text-slate-500">
                    Nenhum agendamento para hoje.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
