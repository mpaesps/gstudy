'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { MetricCard } from '@/components/metric-card';
import { SessionTable } from '@/components/session-table';
import { useAuth } from '@/hooks/use-auth';
import { cachedGet } from '@/services/api';
import { ApiSession, Metric } from '@/types/domain';
import { toSessionRow } from '@/lib/formatters';

type TutorDashboardData = {
  todaySessions: number;
  studentsInTutoring: number;
  pendingGoals: number;
  recentSessions: ApiSession[];
};

export default function TutorDashboard() {
  const { user } = useAuth(['TUTOR', 'COORDINATOR', 'ADMIN']);
  const [dashboard, setDashboard] = useState<TutorDashboardData | null>(null);
  const [sessions, setSessions] = useState<ApiSession[]>([]);

  useEffect(() => {
    async function loadData() {
      const tutorId = user?.role === 'TUTOR' ? user.tutor?.id : undefined;
      const [dashboardResponse, sessionsResponse] = await Promise.all([
        cachedGet<TutorDashboardData>('/dashboards/tutor', { params: tutorId ? { tutorId } : {}, ttlMs: 30_000 }),
        cachedGet<ApiSession[]>('/tutoring-sessions', { ttlMs: 30_000 }),
      ]);

      setDashboard(dashboardResponse);
      setSessions(sessionsResponse);
    }

    if (user) {
      void loadData();
    }
  }, [user]);

  const metrics: Metric[] = [
    { label: 'Tutorias agendadas', value: String(dashboard?.todaySessions ?? 0), change: 'Calendario', tone: 'blue' },
    { label: 'Alunos acompanhados', value: String(dashboard?.studentsInTutoring ?? 0), change: 'Vinculos', tone: 'green' },
    { label: 'Metas pendentes', value: String(dashboard?.pendingGoals ?? 0), change: 'Abertas', tone: 'orange' },
    { label: 'Registros recentes', value: String(dashboard?.recentSessions?.length ?? 0), change: 'Historico', tone: 'blue' },
  ];

  return (
    <AppShell title="Dashboard do tutor" allowedRoles={['TUTOR', 'COORDINATOR', 'ADMIN']}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Atendimentos do tutor</h2>
        <p className="mb-4 text-sm text-slate-500">Tutorias registradas, pendentes e alunos acompanhados.</p>
        <SessionTable rows={sessions.map(toSessionRow)} />
      </section>
    </AppShell>
  );
}
