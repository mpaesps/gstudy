import { AppShell } from '@/components/app-shell';

export default function NewTutoringPage() {
  return (
    <AppShell title="Registrar tutoria">
      <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:grid-cols-2">
        {['Titulo', 'Tutor responsavel', 'Aluno(s)', 'Periodicidade'].map((label) => (
          <label key={label} className="text-sm font-medium text-slate-700">
            {label}
            <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600" />
          </label>
        ))}
        <label className="text-sm font-medium text-slate-700">
          Tipo de tutoria
          <select className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600">
            <option>Individual</option>
            <option>Coletiva</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Data e hora
          <input type="datetime-local" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600" />
        </label>
        <label className="text-sm font-medium text-slate-700 xl:col-span-2">
          Observacoes pedagogicas
          <textarea rows={6} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600" />
        </label>
        <button className="rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">
          Salvar registro
        </button>
      </form>
    </AppShell>
  );
}
