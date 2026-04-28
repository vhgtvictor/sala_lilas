import {
  ClipboardList,
  House,
  LogOut,
  NotebookPen,
  Route as RouteIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { NavLink, Outlet } from "react-router-dom";

const menuItems = [
  { to: "/painel", label: "Início", icon: House, end: true },
  { to: "/painel/prontuarios", label: "Prontuários", icon: NotebookPen },
  {
    to: "/painel/encaminhamentos",
    label: "Encaminhamentos",
    icon: RouteIcon
  }
];

export default function LayoutPainel() {
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
          {menuItems.map((item) => {
            const Icon = item.icon;

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
                {item.label}
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
        <Outlet />
      </main>
    </div>
  );
}
