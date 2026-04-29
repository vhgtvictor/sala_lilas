import { CalendarDays, Clock3, Fingerprint, UserRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const initialForm = {
  nome: "",
  cpf: "",
  dataNascimento: "",
  dataDesejada: "",
  horario: ""
};

function aplicarMascaraCPF(valor) {
  const numeros = valor.replace(/\D/g, "");
  const parte1 = numeros.slice(0, 3);
  const parte2 = numeros.slice(3, 6);
  const parte3 = numeros.slice(6, 9);
  const parte4 = numeros.slice(9, 11);

  let cpfFormatado = parte1;
  if (parte2) cpfFormatado += `.${parte2}`;
  if (parte3) cpfFormatado += `.${parte3}`;
  if (parte4) cpfFormatado += `-${parte4}`;

  return cpfFormatado;
}

export default function Agendamento() {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValue = name === "cpf" ? aplicarMascaraCPF(value) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { nome, cpf, dataNascimento, dataDesejada, horario } = formData;

    if (!nome.trim() || !cpf.trim() || !dataNascimento || !dataDesejada || !horario) {
      toast.error("Por favor, preencha todos os dados para o agendamento.");
      return;
    }

    if (cpf.length < 14) {
      toast.error("Por favor, digite um CPF válido");
      return;
    }

    const selectedDate = new Date(`${dataDesejada}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Não é possível agendar em datas passadas.");
      return;
    }

    let response;
    try {
      response = await fetch("http://localhost:3000/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: nome.trim(),
          cpf: cpf.trim(),
          dataNascimento,
          dataDesejada,
          horario
        })
      });
    } catch (error) {
      toast.error("Erro de conexão com o servidor. Tente novamente mais tarde.");
      return;
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      toast.error("Erro de conexão com o servidor. Tente novamente mais tarde.");
      return;
    }

    if (!responseData?.sucesso) {
      toast.error(responseData?.mensagem || "Nao foi possivel realizar o agendamento.");
      return;
    }

    toast.success("Agendamento confirmado!");
    setFormData(initialForm);
  };

  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-purple-100 bg-white p-6 shadow-lg shadow-purple-100/60 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-purple-700">Agendamento</h1>
          <p className="mt-2 text-sm text-slate-600">
            Preencha os dados abaixo para solicitar seu atendimento.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Nome Completo
            </span>
            <div className="relative">
              <UserRound
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              CPF
            </span>
            <div className="relative">
              <Fingerprint
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                maxLength={14}
                placeholder="000.000.000-00"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Data de Nascimento
              </span>
              <div className="relative">
                <CalendarDays
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Data Desejada
              </span>
              <div className="relative">
                <CalendarDays
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="date"
                  name="dataDesejada"
                  value={formData.dataDesejada}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Horário
              </span>
              <div className="relative">
                <Clock3
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="time"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
          >
            Solicitar agendamento
          </button>
        </form>
      </div>
    </section>
  );
}
