import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const backendToFrontendProfile = {
  ATENDENTE: "Atendente",
  NPJ: "NPJ",
  PSICOLOGIA: "Psicologia",
  EQUIPE_TECNICA: "Equipe Técnica",
  ADMINISTRADOR: "Administrador"
};

function mapPerfil(perfilBackend) {
  return backendToFrontendProfile[perfilBackend] || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("sala_lilas_token");
    const storedUser = localStorage.getItem("sala_lilas_user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const mappedProfile = mapPerfil(parsedUser.perfil);

        if (mappedProfile) {
          setToken(storedToken);
          setUser(parsedUser);
          setProfile(mappedProfile);
        } else {
          localStorage.removeItem("sala_lilas_token");
          localStorage.removeItem("sala_lilas_user");
        }
      } catch {
        localStorage.removeItem("sala_lilas_token");
        localStorage.removeItem("sala_lilas_user");
      }
    }
  }, []);

  const login = (authToken, userData) => {
    const mappedProfile = mapPerfil(userData?.perfil);

    if (!authToken || !userData || !mappedProfile) {
      throw new Error("Dados de autenticacao invalidos.");
    }

    localStorage.setItem("sala_lilas_token", authToken);
    localStorage.setItem("sala_lilas_user", JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setProfile(mappedProfile);
  };

  const logout = () => {
    localStorage.removeItem("sala_lilas_token");
    localStorage.removeItem("sala_lilas_user");
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateUser = (updates) => {
    if (!user) return;
    const usuarioAtualizado = { ...user, ...updates };
    localStorage.setItem("sala_lilas_user", JSON.stringify(usuarioAtualizado));
    setUser(usuarioAtualizado);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      profile,
      login,
      logout,
      updateUser
    }),
    [profile, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
