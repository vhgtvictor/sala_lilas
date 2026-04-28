const indicators = [
  { label: "Atendimentos Hoje", value: 12 },
  { label: "Prontuários Ativos", value: 48 },
  { label: "Pendências", value: 7 }
];

const upcomingAppointments = [
  { time: "09:00", name: "Mariana Souza", type: "Atendimento psicológico" },
  { time: "10:30", name: "Ana Beatriz Lima", type: "Escuta inicial" },
  { time: "14:00", name: "Carla Mendes", type: "Retorno" },
  { time: "16:15", name: "Fernanda Rocha", type: "Orientação jurídica" }
];

export default function DashboardInicio() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Início do Painel</h1>
        <p className="mt-1 text-sm text-slate-600">
          Visão rápida dos atendimentos e atividades do dia.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {indicators.map((item) => (
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
              {upcomingAppointments.map((appointment) => (
                <tr key={`${appointment.time}-${appointment.name}`} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium text-purple-700">
                    {appointment.time}
                  </td>
                  <td className="px-3 py-2">{appointment.name}</td>
                  <td className="px-3 py-2 text-slate-600">{appointment.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
