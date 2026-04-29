import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function ProntuariosLista() {
  const [search, setSearch] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  const buscarPacientes = async () => {
    const token = localStorage.getItem("sala_lilas_token");

    if (!token) {
      toast.error("Sessao expirada. Faca login novamente.");
      navigate("/login");
      return;
    }

    let response;
    try {
      response = await fetch("http://localhost:3000/api/pacientes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
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
      toast.error(responseData?.mensagem || "Falha ao buscar pacientes.");
      if (response.status === 401) {
        navigate("/login");
      }
      return;
    }

    setPacientes(Array.isArray(responseData?.dados) ? responseData.dados : []);
  };

  useEffect(() => {
    buscarPacientes();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return pacientes;
    }

    return pacientes.filter((patient) =>
      (patient.nome || "").toLowerCase().includes(query)
    );
  }, [search, pacientes]);

  const getSituacaoPaciente = (patient) => {
    const ultimoEncaminhamento = Array.isArray(patient.encaminhamentos)
      ? patient.encaminhamentos[0]
      : null;

    if (ultimoEncaminhamento?.status === "FINALIZADO") {
      return "Encerrado";
    }

    if (patient.prontuario) {
      return "Com prontuario";
    }

    return "Somente agendamento";
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Prontuários</h1>
        <p className="mt-1 text-sm text-slate-600">
          Consulte os registros e acompanhe os status de atendimento.
        </p>
      </header>

      <div className="max-w-md">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Pesquisar paciente
          </span>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Digite o nome da paciente"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </label>
      </div>

      <article className="overflow-x-auto rounded-xl border border-purple-100 bg-white p-5 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="px-3 py-2 font-semibold">Nome</th>
              <th className="px-3 py-2 font-semibold">CPF</th>
              <th className="px-3 py-2 font-semibold">Situação</th>
              <th className="px-3 py-2 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-b border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-800">{patient.nome}</td>
                <td className="px-3 py-2 text-slate-600">{patient.cpf}</td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                    {getSituacaoPaciente(patient)}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <Link
                    to={`/painel/prontuarios/${patient.id}`}
                    className="inline-block rounded-md bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700"
                  >
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 ? (
          <p className="px-3 py-4 text-sm text-slate-500">
            Nenhum prontuário encontrado para essa busca.
          </p>
        ) : null}
      </article>
    </section>
  );
}
