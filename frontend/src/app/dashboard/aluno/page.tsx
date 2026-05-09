import { AppShell } from '@/components/app-shell';
import { DashboardChart } from '@/components/dashboard-chart';
import { MetricCard } from '@/components/metric-card';
import { goals, studentMetrics } from '@/lib/mock-data';

export default function StudentDashboard() {
  return (
    <AppShell title="Dashboard do aluno">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {studentMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardChart />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Metas atuais</h2>
          <div className="mt-4 space-y-3">
            {goals.map((goal) => (
              <div key={goal.title} className="rounded-md border border-slate-200 p-3">
                <p className="font-medium text-slate-950">{goal.title}</p>
                <p className="text-sm text-slate-500">{goal.status} - {goal.due}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
