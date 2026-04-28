import { CalendarDays, Clock3, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const initialForm = {
  fullName: "",
  phone: "",
  date: "",
  time: ""
};

export default function Agendamento() {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { fullName, phone, date, time } = formData;
    if (!fullName.trim() || !phone.trim() || !date || !time) {
      toast.error("Por favor, preencha todos os dados para o agendamento.");
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Não é possível agendar em datas passadas.");
      return;
    }

    toast.success("Agendamento pré-aprovado com sucesso! Entraremos em contato.");
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
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Telefone (ou WhatsApp)
            </span>
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
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
                  name="date"
                  value={formData.date}
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
                  name="time"
                  value={formData.time}
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
