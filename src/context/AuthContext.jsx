import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const profiles = ["Atendente", "NPJ", "Psicologia", "Equipe Técnica"];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfileState] = useState("Atendente");

  const setProfile = (nextProfile) => {
    if (!profiles.includes(nextProfile) || nextProfile === profile) {
      return;
    }

    setProfileState(nextProfile);
    toast.success(`Perfil alterado para ${nextProfile}`);
  };

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      profiles
    }),
    [profile]
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
