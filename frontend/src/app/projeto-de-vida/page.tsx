import { AppShell } from '@/components/app-shell';

export default function LifeProjectPage() {
  return (
    <AppShell title="Projeto de Vida">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          {['Interesses', 'Pontos fortes', 'Sonhos', 'Proximos passos'].map((label) => (
            <label key={label} className="text-sm font-medium text-slate-700">
              {label}
              <textarea rows={5} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600" />
            </label>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
