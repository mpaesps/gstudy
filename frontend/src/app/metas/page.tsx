import { AppShell } from '@/components/app-shell';
import { goals } from '@/lib/mock-data';

export default function GoalsPage() {
  return (
    <AppShell title="Metas pedagogicas">
      <div className="grid gap-4 md:grid-cols-3">
        {goals.map((goal) => (
          <section key={goal.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-950">{goal.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{goal.status}</p>
            <p className="mt-4 text-sm font-medium text-slate-700">Prazo: {goal.due}</p>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
