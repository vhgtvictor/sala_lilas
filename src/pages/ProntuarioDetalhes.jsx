import {
  FileArchive,
  Gavel,
  HeartHandshake,
  NotebookText,
  UserRound
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const tabs = [
  { id: "evolucao", label: "Evolução Geral", icon: NotebookText },
  { id: "psicologia", label: "Psicologia", icon: HeartHandshake },
  { id: "juridico", label: "Jurídico (NPJ)", icon: Gavel },
  { id: "arquivos", label: "Arquivos", icon: FileArchive }
];

const patientHeader = {
  name: "Joana Almeida",
  cpf: "123.456.789-10",
  birthDate: "14/08/1994",
  processNumber: "SL-2026-0042"
};

const timeline = [
  { date: "22/04/2026", note: "Acolhimento inicial e registro do relato." },
  { date: "24/04/2026", note: "Retorno psicológico com encaminhamento social." },
  { date: "27/04/2026", note: "Atualização do caso e contato com rede de apoio." }
];

export default function ProntuarioDetalhes() {
  const [activeTab, setActiveTab] = useState("evolucao");
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState({
    evolucaoGeral: "",
    observacoesPsicossociais: "",
    statusProcesso: "",
    encaminhamentosLegais: ""
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const displayName = useMemo(
    () => (id ? decodeURIComponent(id) : patientHeader.name),
    [id]
  );

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    toast.success("Registro atualizado com sucesso (Modo Simulação)");
    setIsDirty(false);
  };

  const handleFinalize = () => {
    toast.success("Registro atualizado com sucesso (Modo Simulação)");
    setIsDirty(false);
  };

  const handleBack = () => {
    if (isDirty) {
      toast("Lembre-se de salvar suas alterações", { icon: "ℹ️" });
      return;
    }

    navigate("/painel/prontuarios");
  };

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-purple-100 bg-purple-50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <UserRound className="text-purple-700" size={20} />
          <h1 className="text-xl font-bold text-purple-800">Detalhes do Prontuário</h1>
        </div>
        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
          <p>
            <span className="font-semibold">Nome:</span> {displayName}
          </p>
          <p>
            <span className="font-semibold">CPF:</span> {patientHeader.cpf}
          </p>
          <p>
            <span className="font-semibold">Data de Nascimento:</span>{" "}
            {patientHeader.birthDate}
          </p>
          <p>
            <span className="font-semibold">N do Processo:</span>{" "}
            {patientHeader.processNumber}
          </p>
        </div>
      </header>

      <div className="rounded-xl border border-purple-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={
                  active
                    ? "flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
                    : "flex items-center gap-2 rounded-lg border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                }
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-6">
          {activeTab === "evolucao" ? (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Relato de atendimento
                </span>
                <textarea
                  rows={5}
                  value={formData.evolucaoGeral}
                  onChange={(event) =>
                    updateField("evolucaoGeral", event.target.value)
                  }
                  placeholder="Registre a evolução geral do caso..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </label>

              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  Timeline de atendimentos anteriores
                </h2>
                <ul className="mt-3 space-y-3">
                  {timeline.map((entry) => (
                    <li
                      key={entry.date}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
                    >
                      <p className="font-semibold text-purple-700">{entry.date}</p>
                      <p className="mt-1 text-slate-700">{entry.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          {activeTab === "psicologia" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Observações psicossociais
              </span>
              <textarea
                rows={8}
                value={formData.observacoesPsicossociais}
                onChange={(event) =>
                  updateField("observacoesPsicossociais", event.target.value)
                }
                placeholder="Descreva aspectos emocionais, rede de apoio e fatores psicossociais."
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </label>
          ) : null}

          {activeTab === "juridico" ? (
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Status do processo
                </span>
                <input
                  type="text"
                  value={formData.statusProcesso}
                  onChange={(event) =>
                    updateField("statusProcesso", event.target.value)
                  }
                  placeholder="Ex: Aguardando audiência"
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Encaminhamentos legais
                </span>
                <textarea
                  rows={6}
                  value={formData.encaminhamentosLegais}
                  onChange={(event) =>
                    updateField("encaminhamentosLegais", event.target.value)
                  }
                  placeholder="Registre as orientações e encaminhamentos jurídicos."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </label>
            </div>
          ) : null}

          {activeTab === "arquivos" ? (
            <div className="rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/40 p-8 text-center">
              <p className="text-sm font-semibold text-purple-700">
                Área de upload de documentos (simulação)
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Arraste arquivos aqui ou clique para selecionar anexos.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <footer className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg border border-purple-300 bg-white px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
        >
          Salvar Rascunho
        </button>
        <button
          type="button"
          onClick={handleFinalize}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          Finalizar Prontuário
        </button>
        <button
          type="button"
          onClick={handleBack}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Voltar
        </button>
      </footer>
    </section>
  );
}
