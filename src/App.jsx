import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Agendamento from "./pages/Agendamento";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import PainelPage from "./pages/PainelPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/painel" element={<PainelPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
