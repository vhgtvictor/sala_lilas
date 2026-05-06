import { AlertCircle, ArrowRight, ChevronDown, ChevronUp, User } from "lucide-react";
import { useState } from "react";

export default function CardKanban({ paciente, setorDestino, prioridade, id, status, onMover }) {
  const [expandido, setExpandido] = useState(false);

  // Extrai o prontuário com segurança
  const prontuario = paciente?.prontuario;

  // Renderiza um bloco de campo do prontuário com validação rigorosa
  const renderizarBloco = (titulo, conteudo) => {
    if (!conteudo || (typeof conteudo === "string" && conteudo.trim() === "")) {
      return null;
    }
    return (
      <div className="mb-3">
        <p className="font-bold text-slate-700">{titulo}</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{conteudo}</p>
      </div>
    );
  };

  return (
    <div className="mb-3 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Cabeçalho do Card */}
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-purple-100 p-2 text-purple-700">
              <User size={18} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{paciente.nome}</p>
              <p className="text-xs text-slate-500">CPF: {paciente.cpf}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {prioridade === "ALTA" && (
              <AlertCircle size={18} className="text-red-500" title="Prioridade Alta" />
            )}
            <button
              onClick={() => setExpandido(!expandido)}
              className="rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-800"
              title={expandido ? "Ocultar prontuário" : "Ver prontuário"}
              aria-label={expandido ? "Ocultar prontuário" : "Ver prontuário"}
            >
              {expandido ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {/* Botão de ação */}
        <button
          onClick={() => onMover(id, setorDestino, status)}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-purple-50 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100 hover:text-purple-800"
        >
          {status === "AGUARDANDO"
            ? "Iniciar Atendimento"
            : status === "FINALIZADO"
            ? "Retornar para Atendimento Psicológico"
            : "Finalizar Etapa"}
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Área Expansível - Prontuário */}
      {expandido && (
        <div className="border-t border-slate-200 bg-gray-50 p-3">
          {prontuario ? (
            <div className="space-y-3">
              {renderizarBloco("Relatos de Atendimento", prontuario.evolucaoGeral)}
              {renderizarBloco("Observações Psicossociais", prontuario.obsPsicologia)}
              {renderizarBloco("Status Jurídico", prontuario.statusJuridico)}
            </div>
          ) : (
            <p className="italic text-slate-500">Nenhum prontuário iniciado.</p>
          )}
        </div>
      )}
    </div>
  );
}
