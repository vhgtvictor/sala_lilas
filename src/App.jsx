import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LayoutPainel from "./components/LayoutPainel";
import ProtectedPanelRoute from "./components/ProtectedPanelRoute";
import Agendamento from "./pages/Agendamento";
import DashboardInicio from "./pages/DashboardInicio";
import Encaminhamentos from "./pages/Encaminhamentos";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ProntuarioDetalhes from "./pages/ProntuarioDetalhes";
import ProntuariosLista from "./pages/ProntuariosLista";
import Relatorios from "./pages/Relatorios";

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
        <Route
          path="prontuarios"
          element={
            <ProtectedPanelRoute allowedProfiles={["Psicologia", "Equipe Técnica"]}>
              <ProntuariosLista />
            </ProtectedPanelRoute>
          }
        />
        <Route
          path="prontuarios/:id"
          element={
            <ProtectedPanelRoute allowedProfiles={["Psicologia", "Equipe Técnica"]}>
              <ProntuarioDetalhes />
            </ProtectedPanelRoute>
          }
        />
        <Route path="encaminhamentos" element={<Encaminhamentos />} />
        <Route
          path="relatorios"
          element={
            <ProtectedPanelRoute allowedProfiles={["Equipe Técnica", "Administrador"]}>
              <Relatorios />
            </ProtectedPanelRoute>
          }
        />
        <Route
          path="usuarios"
          element={
            <ProtectedPanelRoute allowedProfiles={["Equipe Técnica", "Administrador"]}>
              <GestaoUsuarios />
            </ProtectedPanelRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
