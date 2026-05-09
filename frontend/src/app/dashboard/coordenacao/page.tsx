import { AppShell } from '@/components/app-shell';
import { DashboardChart } from '@/components/dashboard-chart';
import { MetricCard } from '@/components/metric-card';
import { SessionTable } from '@/components/session-table';
import { metrics, sessions } from '@/lib/mock-data';

export default function CoordinatorDashboard() {
  return (
    <AppShell title="Dashboard da coordenacao">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardChart />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Alunos em atencao</h2>
          <div className="mt-4 space-y-3">
            {['Ana Clara', 'Diego Alves', 'Mariana Costa'].map((name) => (
              <div key={name} className="rounded-md border border-slate-200 p-3">
                <p className="font-medium text-slate-950">{name}</p>
                <p className="text-sm text-slate-500">Sem acompanhamento nos ultimos 30 dias</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-5">
        <SessionTable rows={sessions} />
      </div>
    </AppShell>
  );
}
