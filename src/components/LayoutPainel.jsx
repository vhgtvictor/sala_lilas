import {
  ClipboardList,
  House,
  LogOut,
  NotebookPen,
  BarChart3,
  Route as RouteIcon,
  Users
} from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModalTermosUso from "./ModalTermosUso";

const menuItems = [
  {
    to: "/painel",
    label: "Início",
    icon: House,
    end: true,
    profiles: ["Atendente", "NPJ", "Psicologia", "Equipe Técnica", "Administrador"]
  },
  {
    to: "/painel/prontuarios",
    label: "Prontuários",
    icon: NotebookPen,
    profiles: ["Psicologia", "Equipe Técnica", "Administrador"]
  },
  {
    to: "/painel/encaminhamentos",
    label: "Encaminhamentos",
    icon: RouteIcon,
    profiles: ["Atendente", "NPJ", "Psicologia", "Equipe Técnica", "Administrador"]
  },
  {
    to: "/painel/relatorios",
    label: "Relatórios",
    icon: BarChart3,
    profiles: ["Equipe Técnica", "Administrador"]
  },
  {
    to: "/painel/usuarios",
    label: "Gestão de Usuários",
    icon: Users,
    profiles: ["Equipe Técnica", "Administrador"]
  }
];

export default function LayoutPainel() {
  const { profile, logout, user, token, updateUser } = useAuth();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const navigate = useNavigate();

  const visibleMenuItems = menuItems.filter((item) =>
    item.profiles.includes(profile)
  );

  useEffect(() => {
    if (user && user.termosAceitos === false) {
      setIsTermsOpen(true);
    } else {
      setIsTermsOpen(false);
    }
  }, [user]);

  const handleAcceptTerms = async () => {
    if (!token) {
      toast.error("Token de autenticação indisponível.");
      console.error("[aceitarTermos] Token não encontrado no contexto");
      return;
    }

    try {
      console.log("[aceitarTermos] Iniciando requisição...");
      console.log("[aceitarTermos] Token:", token.substring(0, 20) + "...");

      const response = await fetch("http://localhost:3000/api/usuarios/aceitar-termos", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("[aceitarTermos] Status da resposta:", response.status);
      console.log("[aceitarTermos] Headers da resposta:", response.headers);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        console.error("[aceitarTermos] Erro HTTP:", response.status, errorBody);
        throw new Error(errorBody?.mensagem || "Não foi possível aceitar os termos.");
      }

      const data = await response.json();
      console.log("[aceitarTermos] Dados recebidos:", data);

      updateUser({
        termosAceitos: true,
        dataAceiteTermos: data?.dados?.usuario?.dataAceiteTermos || new Date().toISOString()
      });
      setIsTermsOpen(false);
      toast.success("Termos aceitos com sucesso.");
    } catch (error) {
      console.error("[aceitarTermos] Erro na requisição:", error);
      console.error("[aceitarTermos] Stack trace:", error.stack);
      toast.error(error.message || "Erro ao aceitar os termos.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="print:hidden fixed inset-y-0 left-0 flex w-64 flex-col border-r border-purple-100 bg-white p-4 shadow-sm">
        <div className="mb-6 flex items-center gap-2 px-2">
          <ClipboardList className="text-purple-600" size={20} />
          <strong className="text-sm text-purple-700">Painel Sala Lilás</strong>
        </div>

        <nav className="flex-1 space-y-1" aria-label="Menu interno">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const menuLabel =
              profile === "NPJ" && item.to === "/painel/encaminhamentos"
                ? "Encaminhamentos (NPJ)"
                : item.label;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-2 text-sm font-semibold text-purple-700"
                    : "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-700"
                }
              >
                <Icon size={16} />
                {menuLabel}
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-6 flex items-center gap-2 rounded-lg border border-purple-200 px-3 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
        >
          <LogOut size={16} />
          Sair
        </button>
      </aside>

      <main className="ml-64 p-6 print:ml-0 md:p-8">
        <Outlet />
      </main>

      <ModalTermosUso isOpen={isTermsOpen} onClose={handleAcceptTerms} />
    </div>
  );
}
