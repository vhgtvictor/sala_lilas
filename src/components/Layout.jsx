import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/login", label: "Login" },
  { to: "/agendamento", label: "Agendamento" },
  { to: "/painel", label: "Painel" }
];

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="navbar">
        <nav className="nav-content" aria-label="Navegação principal">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
