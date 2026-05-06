import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CardKanban from "../components/CardKanban";

export default function Encaminhamentos() {
  const [encaminhamentos, setEncaminhamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFinalizados, setMostrarFinalizados] = useState(false);

  const SETOR_PSICOLOGIA = "PSICOLOGIA";
  const SETOR_NPJ = "NPJ";

  // 1. Função para buscar os dados reais no Backend
  const buscarEncaminhamentos = async () => {
    const token = localStorage.getItem("sala_lilas_token");
    if (!token) {
      toast.error("Você precisa estar logado.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/encaminhamentos?incluirFinalizados=${mostrarFinalizados}`, {
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

  // Roda a busca assim que a tela abre ou quando mostrarFinalizados muda
  useEffect(() => {
    buscarEncaminhamentos();
  }, [mostrarFinalizados]);

  // 2. Função para mover o card (PUT na API)
  const handleMoverFila = async (id, setorAtual, statusAtual) => {
    const token = localStorage.getItem("sala_lilas_token");

    let novoStatus = "EM_ATENDIMENTO";
    let novoSetor = SETOR_PSICOLOGIA;

    if (statusAtual === "AGUARDANDO") {
      novoStatus = "EM_ATENDIMENTO";
      novoSetor = SETOR_PSICOLOGIA;
    } else if (statusAtual === "EM_ATENDIMENTO" && setorAtual === SETOR_PSICOLOGIA) {
      novoStatus = "EM_ATENDIMENTO";
      novoSetor = SETOR_NPJ;
    } else if (statusAtual === "EM_ATENDIMENTO" && setorAtual === SETOR_NPJ) {
      novoStatus = "FINALIZADO";
      novoSetor = SETOR_NPJ;
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
    (e) => e.status === "EM_ATENDIMENTO" && e.setorDestino === SETOR_PSICOLOGIA
  );
  const filaNPJ = encaminhamentos.filter(
    (e) => e.status === "EM_ATENDIMENTO" && e.setorDestino === SETOR_NPJ
  );
  const filaFinalizados = encaminhamentos.filter((e) => e.status === "FINALIZADO");

  if (carregando) {
    return <div className="flex h-full items-center justify-center text-purple-700">Carregando quadro...</div>;
  }

  return (
    <div className="h-full">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quadro de Encaminhamentos</h1>
          <p className="text-slate-600">Gestão de fluxo entre os setores da Sala Lilás.</p>
        </div>
        <button
          onClick={() => setMostrarFinalizados(!mostrarFinalizados)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors ${
            mostrarFinalizados
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
          }`}
          title={mostrarFinalizados ? "Ocultar encaminhamentos finalizados" : "Mostrar encaminhamentos finalizados"}
        >
          {mostrarFinalizados ? (
            <>
              <EyeOff size={18} />
              Ocultar Finalizados
            </>
          ) : (
            <>
              <Eye size={18} />
              Mostrar Finalizados
            </>
          )}
        </button>
      </header>

      {/* Grid do Kanban */}
      <div className={`grid h-[calc(100vh-200px)] gap-6 ${mostrarFinalizados ? 'md:grid-cols-4' : 'md:grid-cols-3'} grid-cols-1`}>
        
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
              <CardKanban key={item.id} {...item} onMover={handleMoverFila} />
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
              <CardKanban key={item.id} {...item} onMover={handleMoverFila} />
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
              <CardKanban key={item.id} {...item} onMover={handleMoverFila} />
            ))}
            {filaNPJ.length === 0 && (
              <p className="text-center text-sm text-blue-400/70 mt-4">Fila vazia.</p>
            )}
          </div>
        </div>

        {/* Coluna 4: Finalizados (condicional) */}
        {mostrarFinalizados && (
          <div className="flex flex-col rounded-xl border border-green-200 bg-green-50/50 p-4">
            <div className="mb-4 flex items-center justify-between border-b border-green-200 pb-2">
              <h2 className="font-semibold text-green-800">Finalizados</h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800">
                {filaFinalizados.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {filaFinalizados.map((item) => (
                <CardKanban key={item.id} {...item} onMover={handleMoverFila} />
              ))}
              {filaFinalizados.length === 0 && (
                <p className="text-center text-sm text-green-400/70 mt-4">Nenhum finalizado.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}