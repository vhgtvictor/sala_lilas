import { BarChart3, FileText, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Relatorios() {
  const [relatorio, setRelatorio] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const SETOR_PSICOLOGIA = "PSICOLOGIA";
  const SETOR_NPJ = "NPJ";

  // Função para buscar relatório (usada no useEffect e ao aplicar filtros)
  const buscarRelatorio = async (inicio = '', fim = '') => {
    const token = localStorage.getItem("sala_lilas_token");
    if (!token) {
      toast.error("Você precisa estar logado.");
      setCarregando(false);
      return;
    }

    setCarregando(true);
    try {
      let url = "http://localhost:3000/api/relatorios/completo?";
      if (inicio && fim) {
        url += `dataInicio=${inicio}&dataFim=${fim}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.sucesso) {
        setRelatorio(data.dados);
        toast.success("Relatório carregado com sucesso!");
      } else {
        toast.error(data.mensagem || "Erro ao buscar relatório");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro de conexão com a API.");
    } finally {
      setCarregando(false);
    }
  };

  // Aplicar filtro com datas
  const aplicarFiltro = () => {
    if (!dataInicio || !dataFim) {
      toast.error("Por favor, preencha ambas as datas.");
      return;
    }
    buscarRelatorio(dataInicio, dataFim);
  };

  // Limpar filtros
  const limparFiltros = () => {
    setDataInicio('');
    setDataFim('');
    buscarRelatorio('', '');
  };

  // Buscar dados do relatório ao montar o componente
  useEffect(() => {
    buscarRelatorio();
  }, []);

  if (carregando) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mb-4 inline-block animate-spin text-purple-600" size={32} />
          <p className="text-slate-600">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6">
        <p className="text-red-700">Não foi possível carregar o relatório.</p>
      </div>
    );
  }

  // Extrair dados de fila por setor
  const filaPsicologia = relatorio.filaPsicologia || 0;
  const filaNPJ = relatorio.filaNPJ || 0;

  // Card genérico para KPIs
  const CardKPI = ({ titulo, valor, icon: Icon, cor }) => (
    <div className={`rounded-lg border ${cor} p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{titulo}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{valor}</p>
        </div>
        <Icon size={40} className={`text-${cor.split("-")[1]}-500`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Barra de Filtros por Data - Escondida na Impressão */}
      <div className="print:hidden flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-center md:gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="dataInicio" className="text-sm font-medium text-slate-700">
            Data Inicial
          </label>
          <input
            id="dataInicio"
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="dataFim" className="text-sm font-medium text-slate-700">
            Data Final
          </label>
          <input
            id="dataFim"
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div className="flex gap-2 md:mt-6">
          <button
            onClick={aplicarFiltro}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 active:bg-purple-800"
          >
            Filtrar
          </button>
          <button
            onClick={limparFiltros}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Header com botão de impressão */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios Gerenciais</h1>
          <p className="text-sm text-slate-600">
            Relatório gerado em {new Date(relatorio.dataRelatorio).toLocaleString("pt-BR")}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          title="Imprimir ou salvar como PDF"
        >
          <FileText size={18} />
          Imprimir Relatório
        </button>
      </div>

      {/* Parte Superior: KPIs em Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <CardKPI
          titulo="Total de Pacientes"
          valor={relatorio.totalPacientes}
          icon={Users}
          cor="border-purple-200 bg-purple-50"
        />
        <CardKPI
          titulo="Prontuários Finalizados"
          valor={relatorio.prontuariosFinalizados}
          icon={BarChart3}
          cor="border-green-200 bg-green-50"
        />
        <CardKPI
          titulo="Fila Psicologia"
          valor={filaPsicologia}
          icon={BarChart3}
          cor="border-blue-200 bg-blue-50"
        />
        <CardKPI
          titulo="Fila NPJ"
          valor={filaNPJ}
          icon={BarChart3}
          cor="border-orange-200 bg-orange-50"
        />
      </div>

      {/* Parte Inferior: Tabelas de Resumo */}
      <div className="grid grid-cols-1 gap-6">
        {/* Tabela de Encaminhamentos por Setor */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Encaminhamentos por Setor</h2>
          <div className="space-y-3">
            {relatorio.encaminhamentosPorSetor && relatorio.encaminhamentosPorSetor.length > 0 ? (
              relatorio.encaminhamentosPorSetor.map((item) => (
                <div
                  key={item.setor}
                  className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-700">
                      {item.setor === SETOR_PSICOLOGIA ? "Psicologia" : "NPJ"}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-blue-600">{item.total}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Nenhum encaminhamento registrado.</p>
            )}
          </div>
        </div>
      </div>

      {/* Resumo Executivo (rodapé) */}
      <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">Resumo Executivo</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-600">Taxa de Finalização</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {relatorio.totalPacientes > 0
                ? Math.round((relatorio.prontuariosFinalizados / relatorio.totalPacientes) * 100)
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Total em Fila</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {filaPsicologia + filaNPJ}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Últimas 24h</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {relatorio.agendamentosPorStatus?.reduce((acc, item) => acc + item.total, 0) || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
