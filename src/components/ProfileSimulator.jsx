import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfileSimulator({ theme = "dark" }) {
  const { profile, profiles, setProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const triggerClassName =
    theme === "light"
      ? "inline-flex items-center gap-2 rounded-md border border-purple-300 bg-white px-3 py-1.5 text-sm font-semibold text-purple-700 hover:bg-purple-50"
      : "inline-flex items-center gap-2 rounded-md border border-purple-300 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/20";

  const handleSelectProfile = (nextProfile) => {
    setProfile(nextProfile);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={triggerClassName}
      >
        Simulador
        <ChevronDown size={16} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-purple-200 bg-white p-2 shadow-lg">
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Perfil ativo: {profile}
          </p>

          <div className="mt-1 space-y-1">
            {profiles.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelectProfile(item)}
                className={
                  item === profile
                    ? "w-full rounded-md bg-purple-100 px-2 py-1.5 text-left text-sm font-semibold text-purple-700"
                    : "w-full rounded-md px-2 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-purple-50"
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
