import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/agendamento", label: "Agendamento" }
];

const loginNavItem = { to: "/login", label: "Login" };

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="bg-purple-600 px-4 py-3">
        <nav
          className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4"
          aria-label="Navegação principal"
        >
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md px-3 py-1.5 text-sm font-semibold text-white"
                    : "rounded-md px-3 py-1.5 text-sm font-semibold text-purple-100 transition hover:bg-purple-500 hover:text-white"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div>
            <NavLink
              to={loginNavItem.to}
              className={({ isActive }) =>
                isActive
                  ? "rounded-md px-3 py-1.5 text-sm font-semibold text-white"
                  : "rounded-md px-3 py-1.5 text-sm font-semibold text-purple-100 transition hover:bg-purple-500 hover:text-white"
              }
            >
              {loginNavItem.label}
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
