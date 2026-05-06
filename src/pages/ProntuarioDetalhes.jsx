import { FileArchive, Gavel, HeartHandshake, NotebookText, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const tabs = [
  { id: "evolucao", label: "Evolução Geral", icon: NotebookText },
  { id: "psicologia", label: "Psicologia", icon: HeartHandshake },
  { id: "juridico", label: "Jurídico (NPJ)", icon: Gavel },
  { id: "arquivos", label: "Arquivos", icon: FileArchive }
];

export default function ProntuarioDetalhes() {
  const [activeTab, setActiveTab] = useState("evolucao");
  const [isDirty, setIsDirty] = useState(false);
  const [pacienteInfo, setPacienteInfo] = useState(null);
  const [carregandoDados, setCarregandoDados] = useState(true);
  
  // Nomes de variáveis alinhados com o Backend
  const [formData, setFormData] = useState({
    evolucaoGeral: "",
    obsPsicologia: "",
    statusProcesso: "",
    encaminhamentosLegais: ""
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const { profile } = useAuth();

  const isNpjProfile = profile === "NPJ";
  const visibleTabs = useMemo(
    () => (isNpjProfile ? tabs.filter((tab) => tab.id !== "psicologia") : tabs),
    [isNpjProfile]
  );

  const pacienteId = useMemo(() => {
    const parsedId = Number(id);
    return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
  }, [id]);

  useEffect(() => {
    const buscarPaciente = async () => {
      if (!pacienteId) {
        setCarregandoDados(false);
        toast.error("Paciente invalido.");
        return;
      }

      const token = localStorage.getItem("sala_lilas_token");
      if (!token) {
        toast.error("Sessao expirada. Faca login novamente.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/pacientes/${pacienteId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const responseData = await response.json();

        if (!responseData?.sucesso) {
          toast.error(responseData?.mensagem || "Erro ao carregar dados do paciente.");
          setCarregandoDados(false);
          return;
        }

        setPacienteInfo(responseData.dados || null);
      } catch (error) {
        toast.error("Erro de conexão com o servidor.");
      } finally {
        setCarregandoDados(false);
      }
    };

    buscarPaciente();
  }, [pacienteId, navigate]);

  const dataNascimentoFormatada = useMemo(() => {
    if (!pacienteInfo?.dataNascimento) {
      return "-";
    }

    const data = new Date(pacienteInfo.dataNascimento);
    if (Number.isNaN(data.getTime())) {
      return "-";
    }

    return data.toLocaleDateString("pt-BR");
  }, [pacienteInfo]);

  const agendamentosPaciente = useMemo(() => {
    return Array.isArray(pacienteInfo?.agendamentos) ? pacienteInfo.agendamentos : [];
  }, [pacienteInfo]);

  const encaminhamentosPaciente = useMemo(() => {
    return Array.isArray(pacienteInfo?.encaminhamentos)
      ? pacienteInfo.encaminhamentos
      : [];
  }, [pacienteInfo]);

  const encaminhamentoAtual = encaminhamentosPaciente[0] || null;

  const setorLabelAtual = useMemo(() => {
    if (!encaminhamentoAtual) return "-";
    if (encaminhamentoAtual.status === "FINALIZADO") return "Finalizado";
    if (encaminhamentoAtual.setorDestino === "PSICOLOGIA")
      return "Atendimento psicológico";
    if (encaminhamentoAtual.setorDestino === "NPJ") return "Atendimento jurídico";
    return "-";
  }, [encaminhamentoAtual]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const carregarDadosSalvos = async () => {
    if (!pacienteId) {
      return;
    }

    const token = localStorage.getItem("sala_lilas_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/prontuarios/${pacienteId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();
      if (!responseData?.sucesso || !responseData?.dados) {
        return;
      }

      const {
        evolucaoGeral = "",
        obsPsicologia = "",
        statusJuridico = ""
      } = responseData.dados;

      let statusProcesso = "";
      let encaminhamentosLegais = "";

      if (typeof statusJuridico === "string" && statusJuridico.trim()) {
        const match = statusJuridico.match(/Status:\s*([\s\S]*?)\s*Encaminhamentos:\s*([\s\S]*)/i);
        if (match) {
          statusProcesso = match[1].trim();
          encaminhamentosLegais = match[2].trim();
        } else {
          encaminhamentosLegais = statusJuridico.trim();
        }
      }

      setFormData({
        evolucaoGeral,
        obsPsicologia,
        statusProcesso,
        encaminhamentosLegais
      });
    } catch (error) {
      toast.error("Erro ao carregar o prontuário salvo.");
    }
  };

  useEffect(() => {
    if (!pacienteId) {
      return;
    }

    carregarDadosSalvos();
  }, [pacienteId, navigate]);

  // Agora recebe a flag de rascunho via parâmetro
  const salvarProntuario = async (isRascunhoParam) => {
    if (!pacienteId) {
      toast.error("Paciente inválido para salvar prontuário.");
      return;
    }

    const token = localStorage.getItem("sala_lilas_token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }

    // Junta as duas caixas de texto do Jurídico em uma única string pro banco
    const textoJuridico = `Status: ${formData.statusProcesso}\nEncaminhamentos: ${formData.encaminhamentosLegais}`;

    let response;
    try {
      response = await fetch(`http://localhost:3000/api/prontuarios/${pacienteId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          evolucaoGeral: formData.evolucaoGeral,
          obsPsicologia: isNpjProfile
            ? "Não aplicável para o perfil NPJ."
            : formData.obsPsicologia,
          statusJuridico: textoJuridico,
          isRascunho: isRascunhoParam // Envia true ou false para a API
        })
      });
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
      return;
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      toast.error("Erro ao processar resposta da API.");
      return;
    }

    if (!responseData?.sucesso) {
      toast.error(responseData?.mensagem || "Erro ao salvar prontuário.");
      return;
    }

    toast.success(responseData.mensagem); // Mostra a mensagem exata que veio da API
    setIsDirty(false);
  };

  // Botões agora repassam a intenção correta
  const handleSave = async () => {
    await salvarProntuario(true); // É rascunho
  };

  const handleFinalize = async () => {
    await salvarProntuario(false); // É finalização
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
        {carregandoDados || !pacienteInfo ? (
          <p className="text-sm text-slate-700">Carregando dados do paciente...</p>
        ) : (
          <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
            <p><span className="font-semibold">Nome:</span> {pacienteInfo.nome}</p>
            <p><span className="font-semibold">CPF:</span> {pacienteInfo.cpf}</p>
            <p><span className="font-semibold">Data Nasc.:</span> {dataNascimentoFormatada}</p>
            <p><span className="font-semibold">Processo:</span> {pacienteInfo.numeroProcesso || "-"}</p>
          </div>
        )}
      </header>

      <div className="rounded-xl border border-purple-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {visibleTabs.map((tab) => {
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
                <span className="mb-2 block text-sm font-semibold text-slate-700">Relato de atendimento</span>
                <textarea
                  rows={5}
                  value={formData.evolucaoGeral}
                  onChange={(e) => updateField("evolucaoGeral", e.target.value)}
                  placeholder="Registre a evolução geral do caso..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </label>

              <div>
                <h2 className="text-sm font-semibold text-slate-700">Timeline de atendimentos anteriores</h2>
                {agendamentosPaciente.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">
                    Nenhum atendimento anterior registrado.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {agendamentosPaciente.map((agendamento) => {
                      const dataAgendamento = new Date(agendamento.dataDesejada);
                      const dataFormatada = Number.isNaN(dataAgendamento.getTime())
                        ? "-"
                        : dataAgendamento.toLocaleDateString("pt-BR");

                      return (
                        <li
                          key={agendamento.id}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
                        >
                          <p className="font-semibold text-purple-700">{dataFormatada}</p>
                          <p className="mt-1 text-slate-700">
                            Encaminhamento - {encaminhamentoAtual?.status || agendamento.status} ({setorLabelAtual})
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          ) : null}

          {activeTab === "psicologia" && !isNpjProfile ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Observações psicossociais</span>
              <textarea
                rows={8}
                value={formData.obsPsicologia} // Corrigido para match com o state
                onChange={(e) => updateField("obsPsicologia", e.target.value)}
                placeholder="Descreva aspectos emocionais, rede de apoio e fatores psicossociais."
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </label>
          ) : null}

          {activeTab === "juridico" ? (
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Status do processo</span>
                <input
                  type="text"
                  value={formData.statusProcesso}
                  onChange={(e) => updateField("statusProcesso", e.target.value)}
                  placeholder="Ex: Aguardando audiência"
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Encaminhamentos legais</span>
                <textarea
                  rows={6}
                  value={formData.encaminhamentosLegais}
                  onChange={(e) => updateField("encaminhamentosLegais", e.target.value)}
                  placeholder="Registre as orientações e encaminhamentos jurídicos."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </label>
            </div>
          ) : null}

          {activeTab === "arquivos" ? (
            <div className="rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/40 p-8 text-center">
              <p className="text-sm font-semibold text-purple-700">Área de upload de documentos (simulação)</p>
              <p className="mt-2 text-sm text-slate-600">Arraste arquivos aqui ou clique para selecionar anexos.</p>
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
