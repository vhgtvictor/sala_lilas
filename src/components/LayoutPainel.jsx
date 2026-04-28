import {
  ClipboardList,
  House,
  LogOut,
  NotebookPen,
  BarChart3,
  Route as RouteIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileSimulator from "./ProfileSimulator";

const menuItems = [
  {
    to: "/painel",
    label: "Início",
    icon: House,
    end: true,
    profiles: ["Atendente", "NPJ", "Psicologia", "Equipe Técnica"]
  },
  {
    to: "/painel/prontuarios",
    label: "Prontuários",
    icon: NotebookPen,
    profiles: ["Psicologia", "Equipe Técnica"]
  },
  {
    to: "/painel/encaminhamentos",
    label: "Encaminhamentos",
    icon: RouteIcon,
    profiles: ["Atendente", "NPJ", "Psicologia", "Equipe Técnica"]
  },
  {
    to: "/painel/relatorios",
    label: "Relatórios",
    icon: BarChart3,
    profiles: ["Equipe Técnica"]
  }
];

export default function LayoutPainel() {
  const { profile } = useAuth();

  const visibleMenuItems = menuItems.filter((item) =>
    item.profiles.includes(profile)
  );

  const handleFeatureInProgress = () => {
    toast("Funcionalidade em desenvolvimento.", { icon: "ℹ️" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-purple-100 bg-white p-4 shadow-sm">
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
          onClick={handleFeatureInProgress}
          className="mt-6 flex items-center gap-2 rounded-lg border border-purple-200 px-3 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
        >
          <LogOut size={16} />
          Sair
        </button>
      </aside>

      <main className="ml-64 p-6 md:p-8">
        <div className="mb-6 flex justify-end">
          <ProfileSimulator theme="light" />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
