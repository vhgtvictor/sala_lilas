import { Plus, Trash2, Users, Check, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const perfisDisponiveis = [
  { value: "ATENDENTE", label: "Atendente" },
  { value: "PSICOLOGIA", label: "Psicologia" },
  { value: "NPJ", label: "NPJ" },
  { value: "EQUIPE_TECNICA", label: "Equipe Técnica" },
  { value: "ADMINISTRADOR", label: "Administrador" }
];

export default function GestaoUsuarios() {
  const { profile, token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "ATENDENTE"
  });

  const buscarUsuarios = async () => {
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();

      if (!responseData?.sucesso) {
        toast.error(responseData?.mensagem || "Erro ao carregar usuários.");
        return;
      }

      setUsuarios(responseData.dados || []);
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.nome.trim() || !formData.email.trim() || !formData.senha.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (!responseData?.sucesso) {
        toast.error(responseData?.mensagem || "Erro ao criar usuário.");
        return;
      }

      toast.success("Usuário criado com sucesso.");
      setModalAberto(false);
      setFormData({ nome: "", email: "", senha: "", perfil: "ATENDENTE" });
      buscarUsuarios(); // Recarregar lista
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  const handleDelete = async (usuarioId, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${nome}"?`)) {
      return;
    }

    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();

      if (!responseData?.sucesso) {
        toast.error(responseData?.mensagem || "Erro ao excluir usuário.");
        return;
      }

      toast.success("Usuário excluído com sucesso.");
      buscarUsuarios(); // Recarregar lista
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  if (!["Equipe Técnica", "Administrador"].includes(profile)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="mt-2 text-slate-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-purple-100 bg-purple-50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-purple-700" size={20} />
            <h1 className="text-xl font-bold text-purple-800">Gestão de Usuários</h1>
          </div>
          <button
            type="button"
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            <Plus size={16} />
            Novo Usuário
          </button>
        </div>
      </header>

      <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
        {carregando ? (
          <p className="text-center text-slate-600">Carregando usuários...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-center text-slate-600">Nenhum usuário cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Nome</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">E-mail</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Perfil</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Criado em</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Compliance</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-sm text-slate-900">{usuario.nome}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{usuario.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {perfisDisponiveis.find(p => p.value === usuario.perfil)?.label || usuario.perfil}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(usuario.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      {usuario.termosAceitos ? (
                        <div
                          className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 w-fit"
                          title={usuario.dataAceiteTermos ? new Date(usuario.dataAceiteTermos).toLocaleString("pt-BR") : ""}
                        >
                          <Check size={14} className="text-green-700" />
                          <span className="text-xs font-semibold text-green-700">Aceito</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 w-fit">
                          <AlertCircle size={14} className="text-yellow-700" />
                          <span className="text-xs font-semibold text-yellow-700">Pendente</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(usuario.id, usuario.nome)}
                        className="rounded-lg p-1 text-red-600 hover:bg-red-50"
                        title="Excluir usuário"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Novo Usuário</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Nome</span>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">E-mail</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Senha</span>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Perfil</span>
                <select
                  value={formData.perfil}
                  onChange={(e) => setFormData(prev => ({ ...prev, perfil: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                >
                  {perfisDisponiveis.map(perfil => (
                    <option key={perfil.value} value={perfil.value}>
                      {perfil.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Criar
                </button>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}