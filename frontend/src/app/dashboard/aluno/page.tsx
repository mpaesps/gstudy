'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { DashboardChart } from '@/components/dashboard-chart';
import { MetricCard } from '@/components/metric-card';
import { useAuth } from '@/hooks/use-auth';
import { cachedGet } from '@/services/api';
import { Metric } from '@/types/domain';
import { percent } from '@/lib/formatters';

type Goal = {
  id: string;
  title: string;
  status: string;
  dueDate?: string | null;
};

type StudentDashboardData = {
  upcomingSessions: unknown[];
  openGoals: Goal[];
  indicators: Array<{
    referenceMonth: string;
    academicPerformance: number;
    participation: number;
    attendanceRate: number;
    behaviorEvolution: number;
    goalCompletion: number;
  }>;
};

export default function StudentDashboard() {
  const { user } = useAuth(['STUDENT']);
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user?.student?.id) {
        return;
      }

      const data = await cachedGet<StudentDashboardData>(`/dashboards/student/${user.student.id}`, { ttlMs: 30_000 });
      setDashboard(data);
    }

    void loadData();
  }, [user]);

  const latestIndicator = dashboard?.indicators?.at(-1);
  const studentMetrics: Metric[] = [
    { label: 'Frequencia', value: percent(latestIndicator?.attendanceRate), change: 'Atual', tone: 'green' },
    { label: 'Metas abertas', value: String(dashboard?.openGoals?.length ?? 0), change: 'Acompanhar', tone: 'orange' },
    { label: 'Desempenho', value: String(latestIndicator?.academicPerformance ?? 0), change: 'Academico', tone: 'blue' },
    { label: 'Tutorias', value: String(dashboard?.upcomingSessions?.length ?? 0), change: 'Agendadas', tone: 'blue' },
  ];

  const chartData = dashboard?.indicators?.map((indicator) => ({
    month: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(indicator.referenceMonth)),
    desempenho: indicator.academicPerformance,
    participacao: indicator.participation,
  })) ?? [];

  return (
    <AppShell title="Dashboard do aluno" allowedRoles={['STUDENT']}>
      <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Dados do aluno</h2>
        <dl className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-xs font-semibold uppercase text-slate-500">Nome</dt>
            <dd className="mt-1 font-medium text-slate-950">{user?.name ?? 'Nao informado'}</dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-xs font-semibold uppercase text-slate-500">E-mail</dt>
            <dd className="mt-1 font-medium text-slate-950">{user?.email ?? 'Nao informado'}</dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-xs font-semibold uppercase text-slate-500">Matricula</dt>
            <dd className="mt-1 font-medium text-slate-950">{user?.student?.registration ?? 'Nao informada'}</dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-xs font-semibold uppercase text-slate-500">Turma</dt>
            <dd className="mt-1 font-medium text-slate-950">{user?.student?.classGroup?.name ?? 'Nao informada'}</dd>
          </div>
        </dl>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {studentMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardChart data={chartData} />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Metas atuais</h2>
          <div className="mt-4 space-y-3">
            {dashboard?.openGoals?.length ? dashboard.openGoals.map((goal) => (
              <div key={goal.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-medium text-slate-950">{goal.title}</p>
                <p className="text-sm text-slate-500">{goal.status}</p>
              </div>
            )) : <p className="text-sm text-slate-500">Nenhuma meta aberta.</p>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
