import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AgendamentoPage from "./pages/AgendamentoPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PainelPage from "./pages/PainelPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/agendamento" element={<AgendamentoPage />} />
        <Route path="/painel" element={<PainelPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
