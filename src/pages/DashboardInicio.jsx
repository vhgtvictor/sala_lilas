import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardInicio() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchDashboardData();
  }, []);

  const currentIndicators = dashboardData ? [
    { label: "Atendimentos Hoje", value: dashboardData.totalAgendamentosHoje },
    { label: "Prontuários Ativos", value: dashboardData.totalProntuarios },
    { label: "Pendências", value: dashboardData.totalPendencias }
  ] : [
    { label: "Atendimentos Hoje", value: 0 },
    { label: "Prontuários Ativos", value: 0 },
    { label: "Pendências", value: 0 }
  ];

  const currentAppointments = dashboardData ? dashboardData.proximosAgendamentos.map((appointment) => ({
    time: appointment.horario,
    name: appointment.nome,
    type: "Agendamento"
  })) : [];

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
              </tr>
            </thead>
            <tbody>
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appointment) => (
                  <tr key={`${appointment.time}-${appointment.name}`} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-purple-700">
                      {appointment.time}
                    </td>
                    <td className="px-3 py-2">{appointment.name}</td>
                    <td className="px-3 py-2 text-slate-600">{appointment.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-3 py-4 text-center text-slate-500">
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
