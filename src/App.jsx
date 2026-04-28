import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LayoutPainel from "./components/LayoutPainel";
import Agendamento from "./pages/Agendamento";
import DashboardInicio from "./pages/DashboardInicio";
import Encaminhamentos from "./pages/Encaminhamentos";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ProntuarioDetalhes from "./pages/ProntuarioDetalhes";
import ProntuariosLista from "./pages/ProntuariosLista";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agendamento" element={<Agendamento />} />
      </Route>

      <Route path="/painel" element={<LayoutPainel />}>
        <Route index element={<DashboardInicio />} />
        <Route path="prontuarios" element={<ProntuariosLista />} />
        <Route path="prontuarios/:id" element={<ProntuarioDetalhes />} />
        <Route path="encaminhamentos" element={<Encaminhamentos />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
