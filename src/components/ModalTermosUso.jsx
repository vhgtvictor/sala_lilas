export default function ModalTermosUso({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            Termos de Responsabilidade e Sigilo de Dados
          </h2>
          <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
            <p className="mb-4">
              Ao utilizar esta plataforma, o usuário concorda em manter a confidencialidade de todas as informações e
              dados pessoais ou sensíveis acessados no sistema. Todas as ações realizadas devem respeitar as normas de
              sigilo, privacidade e segurança aplicáveis, assim como a legislação vigente.
            </p>
            <p className="mb-4">
              O usuário também se compromete a utilizar os dados somente para fins autorizados e a não divulgar, copiar
              ou compartilhar qualquer informação sem o devido consentimento. O descumprimento destas regras pode
              resultar em responsabilidade administrativa, civil e criminal.
            </p>
            <p className="mb-4">
              Este termo abrange a obrigação de proteger o acesso ao sistema, não deixar sessões abertas em computadores
              públicos ou não seguros e notificar imediatamente a equipe responsável em caso de qualquer suspeita de
              violação. O usuário declara estar ciente das penalidades previstas em lei e nas políticas internas.
            </p>
            <p className="mb-4">
              Ao clicar em "Li e Aceito", o usuário confirma que leu, entendeu e concorda com os termos de responsabilidade,
              sigilo e uso adequado dos dados, assumindo o compromisso de agir de acordo com os princípios éticos e legais.
            </p>
            <p className="mb-4">
              Estes termos valem para qualquer informação tratada dentro do sistema, incluindo dados de pacientes, contatos,
              agendamentos, relatórios e demais registros relacionados ao atendimento. A aceitação é obrigatória para
              continuar utilizando as funcionalidades do painel.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Li e Aceito
          </button>
        </div>
      </div>
    </div>
  );
}
