import { AppShell } from '@/components/app-shell';
import { MetricCard } from '@/components/metric-card';
import { SessionTable } from '@/components/session-table';
import { metrics, sessions } from '@/lib/mock-data';

export default function TutorDashboard() {
  return (
    <AppShell title="Dashboard do tutor">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Atendimentos do tutor</h2>
        <p className="mb-4 text-sm text-slate-500">Tutorias registradas, pendentes e alunos acompanhados.</p>
        <SessionTable rows={sessions} />
      </section>
    </AppShell>
  );
}
