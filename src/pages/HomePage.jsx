import { useNavigate } from "react-router-dom";
import { HeartHandshake, MessageCircle, Scale, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-purple-100 to-white text-slate-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm shadow-purple-200/50">
              <ShieldCheck size={18} />
              Plataforma de acolhimento seguro
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Sala Lilás - Acolhimento e Proteção
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Sistema integrado de gestão de atendimentos psicossociais e jurídicos, pensado para oferecer um fluxo organizado e acolhedor às pessoas em situação de vulnerabilidade.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/agendamento")}
                className="inline-flex items-center justify-center rounded-full bg-purple-600 px-7 py-3 text-base font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200"
              >
                Realizar Agendamento
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-purple-200 bg-white/80 p-8 shadow-xl shadow-purple-100/60 backdrop-blur-xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-700 shadow-sm shadow-purple-100">
              <HeartHandshake size={32} />
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-purple-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Missão</p>
                <p className="mt-3 text-slate-600">
                  Conectar atendimento sensível e eficiente para mulheres em busca de apoio emocional e orientação legal.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-purple-100 p-4">
                  <p className="text-sm font-semibold text-purple-700">Fluxo humanizado</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Atendimento pensado para respeito, cuidado e escuta qualificada.
                  </p>
                </div>
                <div className="rounded-3xl bg-purple-100 p-4">
                  <p className="text-sm font-semibold text-purple-700">Gestão integrada</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Dados organizados para equipes psicológicas e jurídicas trabalharem com agilidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="space-y-4 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm shadow-purple-100/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <MessageCircle size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Triagem e Acolhimento Humanizado</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Primeiro contato com foco em escuta ativa e encaminhamento cuidadoso para o apoio certo.
              </p>
            </div>
          </article>

          <article className="space-y-4 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm shadow-purple-100/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <HeartHandshake size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Atendimento Psicológico</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Espaço seguro para acolhimento, acompanhamento emocional e fortalecimento de autonomia.
              </p>
            </div>
          </article>

          <article className="space-y-4 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm shadow-purple-100/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <Scale size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Orientação Jurídica (NPJ)</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Apoio jurídico especializado para orientar nos direitos e caminhos legais disponíveis.
              </p>
            </div>
          </article>
        </section>
      </section>

      <footer className="border-t border-purple-200 bg-purple-50 py-6">
        <div className="mx-auto flex max-w-7xl justify-center px-6 text-sm text-purple-700 sm:px-10 lg:px-16">
          FADERGS / 2026
        </div>
      </footer>
    </main>
  );
}
