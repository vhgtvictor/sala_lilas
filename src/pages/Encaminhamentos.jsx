import { AlertTriangle, ArrowRightLeft, Circle } from "lucide-react";
import toast from "react-hot-toast";

const patients = [
  {
    id: "p1",
    name: "Joana Almeida",
    priority: "Alta",
    status: "Aguardando Triagem"
  },
  {
    id: "p2",
    name: "Camila Ferreira",
    priority: "Média",
    status: "Aguardando Triagem"
  },
  {
    id: "p3",
    name: "Patrícia Silva",
    priority: "Alta",
    status: "Em Atendimento Psicológico"
  },
  {
    id: "p4",
    name: "Luciana Barbosa",
    priority: "Média",
    status: "Em Atendimento Psicológico"
  },
  {
    id: "p5",
    name: "Fernanda Rocha",
    priority: "Alta",
    status: "Em Análise (NPJ)"
  }
];

const columns = [
  { title: "Aguardando Triagem", className: "bg-gray-50" },
  { title: "Em Atendimento Psicológico", className: "bg-purple-50" },
  { title: "Em Análise (NPJ)", className: "bg-slate-50" }
];

function PatientCard({ patient, onMoveQueue }) {
  const isHighPriority = patient.priority === "Alta";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800">{patient.name}</h3>

      <div className="mt-2 flex items-center gap-2 text-xs">
        {isHighPriority ? (
          <AlertTriangle size={14} className="text-amber-500" />
        ) : (
          <Circle size={14} className="text-purple-500" />
        )}
        <span className={isHighPriority ? "font-semibold text-amber-600" : "font-semibold text-purple-600"}>
          Prioridade {patient.priority}
        </span>
      </div>

      <button
        type="button"
        onClick={onMoveQueue}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-purple-200 px-2.5 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-50"
      >
        <ArrowRightLeft size={14} />
        Mover Fila
      </button>
    </article>
  );
}

export default function Encaminhamentos() {
  const handleMoveQueue = () => {
    toast("A funcionalidade de mover pacientes será ativada após a integração com o banco de dados", {
      icon: "ℹ️"
    });
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Encaminhamentos</h1>
        <p className="mt-1 text-sm text-slate-600">
          Quadro visual de triagem e acompanhamento interno.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => {
          const columnPatients = patients.filter(
            (patient) => patient.status === column.title
          );

          return (
            <div
              key={column.title}
              className={`rounded-xl border border-slate-200 p-4 ${column.className}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-700">{column.title}</h2>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                  {columnPatients.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onMoveQueue={handleMoveQueue}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
