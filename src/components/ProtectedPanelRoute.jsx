import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedPanelRoute({ allowedProfiles, children }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hasAccess = allowedProfiles.includes(profile);

  useEffect(() => {
    if (!hasAccess) {
      toast.error("Acesso negado para o seu perfil atual");
      navigate("/painel", { replace: true });
    }
  }, [hasAccess, location.pathname, navigate]);

  if (!hasAccess) {
    return null;
  }

  return children;
}
