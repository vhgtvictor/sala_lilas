import { AlertCircle, ArrowRight, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Encaminhamentos() {
  const [encaminhamentos, setEncaminhamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 1. Função para buscar os dados reais no Backend
  const buscarEncaminhamentos = async () => {
    const token = localStorage.getItem("sala_lilas_token");
    if (!token) {
      toast.error("Você precisa estar logado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/encaminhamentos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.sucesso) {
        setEncaminhamentos(data.dados);
      } else {
        toast.error(data.mensagem || "Erro ao buscar encaminhamentos");
      }
    } catch (error) {
      toast.error("Erro de conexão com a API.");
    } finally {
      setCarregando(false);
    }
  };

  // Roda a busca assim que a tela abre
  useEffect(() => {
    buscarEncaminhamentos();
  }, []);

  // 2. Função para mover o card (PUT na API)
  const handleMoverFila = async (id, setorAtual, statusAtual) => {
    const token = localStorage.getItem("sala_lilas_token");

    let novoStatus = "EM_ATENDIMENTO";
    let novoSetor = "PSICOLOGIA";

    if (statusAtual === "AGUARDANDO") {
      novoStatus = "EM_ATENDIMENTO";
      novoSetor = "PSICOLOGIA";
    } else if (statusAtual === "EM_ATENDIMENTO" && setorAtual === "PSICOLOGIA") {
      novoStatus = "EM_ATENDIMENTO";
      novoSetor = "NPJ";
    } else if (statusAtual === "EM_ATENDIMENTO" && setorAtual === "NPJ") {
      novoStatus = "FINALIZADO";
      novoSetor = "NPJ";
    }

    try {
      const response = await fetch(`http://localhost:3000/api/encaminhamentos/${id}/mover`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          setorDestino: novoSetor,
          status: novoStatus
        }),
      });

      const data = await response.json();

      if (data.sucesso) {
        toast.success(`Paciente movido para: ${novoSetor} (${novoStatus})`);
        // Recarrega a lista para o card mudar de coluna visualmente
        buscarEncaminhamentos(); 
      } else {
        toast.error(data.mensagem || "Erro ao mover paciente");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    }
  };

  // 3. Distribuição das Colunas (Filtros)
  const filaAguardando = encaminhamentos.filter((e) => e.status === "AGUARDANDO");
  const filaPsicologia = encaminhamentos.filter(
    (e) => e.status === "EM_ATENDIMENTO" && e.setorDestino === "PSICOLOGIA"
  );
  const filaNPJ = encaminhamentos.filter(
    (e) => e.status === "EM_ATENDIMENTO" && e.setorDestino === "NPJ"
  );

  // Componente interno do Card para não repetirmos código
  const CardPaciente = ({ paciente, setorDestino, prioridade, id, status }) => (
    <div className="mb-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-purple-100 p-2 text-purple-700">
            <User size={18} />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{paciente.nome}</p>
            <p className="text-xs text-slate-500">CPF: {paciente.cpf}</p>
          </div>
        </div>
        {prioridade === "ALTA" && (
          <AlertCircle size={18} className="text-red-500" title="Prioridade Alta" />
        )}
      </div>
      <button
        onClick={() => handleMoverFila(id, setorDestino, status)}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-purple-50 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100 hover:text-purple-800"
      >
        {status === "AGUARDANDO" ? "Iniciar Atendimento" : "Finalizar Etapa"}
        <ArrowRight size={16} />
      </button>
    </div>
  );

  if (carregando) {
    return <div className="flex h-full items-center justify-center text-purple-700">Carregando quadro...</div>;
  }

  return (
    <div className="h-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quadro de Encaminhamentos</h1>
        <p className="text-slate-600">Gestão de fluxo entre os setores da Sala Lilás.</p>
      </header>

      {/* Grid do Kanban */}
      <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-6 md:grid-cols-3">
        
        {/* Coluna 1: Aguardando */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-semibold text-slate-700">Aguardando Triagem</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
              {filaAguardando.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {filaAguardando.map((item) => (
              <CardPaciente key={item.id} {...item} />
            ))}
            {filaAguardando.length === 0 && (
              <p className="text-center text-sm text-slate-400 mt-4">Nenhum paciente aguardando.</p>
            )}
          </div>
        </div>

        {/* Coluna 2: Psicologia */}
        <div className="flex flex-col rounded-xl border border-purple-200 bg-purple-50/50 p-4">
          <div className="mb-4 flex items-center justify-between border-b border-purple-200 pb-2">
            <h2 className="font-semibold text-purple-800">Atendimento Psicológico</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-200 text-xs font-bold text-purple-800">
              {filaPsicologia.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {filaPsicologia.map((item) => (
              <CardPaciente key={item.id} {...item} />
            ))}
            {filaPsicologia.length === 0 && (
              <p className="text-center text-sm text-purple-400/70 mt-4">Fila vazia.</p>
            )}
          </div>
        </div>

        {/* Coluna 3: NPJ */}
        <div className="flex flex-col rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="mb-4 flex items-center justify-between border-b border-blue-200 pb-2">
            <h2 className="font-semibold text-blue-800">Análise Jurídica (NPJ)</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-800">
              {filaNPJ.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {filaNPJ.map((item) => (
              <CardPaciente key={item.id} {...item} />
            ))}
            {filaNPJ.length === 0 && (
              <p className="text-center text-sm text-blue-400/70 mt-4">Fila vazia.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}