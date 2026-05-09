import { AppShell } from '@/components/app-shell';

const reports = ['Relatorio de tutorias', 'Relatorio de frequencia', 'Alunos sem acompanhamento'];

export default function ReportsPage() {
  return (
    <AppShell title="Relatorios">
      <div className="grid gap-4 md:grid-cols-3">
        {reports.map((report) => (
          <section key={report} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-950">{report}</h2>
            <p className="mt-2 text-sm text-slate-500">Filtros por escola, turma, aluno, tutor e periodo.</p>
            <button className="mt-5 rounded-md border border-brand-600 px-3 py-2 text-sm font-semibold text-brand-700">
              Gerar
            </button>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
