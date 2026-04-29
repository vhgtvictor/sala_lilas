import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const perfilMap = {
  ATENDENTE: "Atendente",
  NPJ: "NPJ",
  PSICOLOGIA: "Psicologia",
  EQUIPE_TECNICA: "Equipe Técnica"
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setProfile } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    let response;
    try {
      response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          senha: password
        })
      });
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
      return;
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
      return;
    }

    if (!responseData?.sucesso) {
      toast.error(responseData?.mensagem || "Falha ao realizar login.");
      return;
    }

    const token = responseData?.dados?.token;
    const perfilBackend = responseData?.dados?.usuario?.perfil;
    const perfilFrontend = perfilMap[perfilBackend];

    if (!token || !perfilFrontend) {
      toast.error("Resposta de autenticacao invalida.");
      return;
    }

    localStorage.setItem("sala_lilas_token", token);
    setProfile(perfilFrontend);
    toast.success(responseData?.mensagem || "Login realizado com sucesso.");
    navigate("/painel");
  };

  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-purple-100 bg-white p-6 shadow-lg shadow-purple-100/60 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-purple-700">Acessar conta</h1>
          <p className="mt-2 text-sm text-slate-600">
            Entre para continuar no sistema Sala Lilás
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              E-mail
            </span>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@exemplo.com"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Senha
            </span>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </label>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}
