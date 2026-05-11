'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { DashboardChart } from '@/components/dashboard-chart';
import { MetricCard } from '@/components/metric-card';
import { SessionTable } from '@/components/session-table';
import { api } from '@/services/api';
import { ApiSession, Metric } from '@/types/domain';
import { toSessionRow } from '@/lib/formatters';

type CoordinatorDashboardData = {
  completedSessions: number;
  totalStudents: number;
  studentsWithoutFollowup: number;
  averageAttendance: number;
  overdueGoals: number;
};

type StudentWithoutFollowup = {
  id: string;
  user?: { name: string };
  classGroup?: { name: string };
};

export default function CoordinatorDashboard() {
  const [dashboard, setDashboard] = useState<CoordinatorDashboardData | null>(null);
  const [sessions, setSessions] = useState<ApiSession[]>([]);
  const [studentsWithoutFollowup, setStudentsWithoutFollowup] = useState<StudentWithoutFollowup[]>([]);

  useEffect(() => {
    async function loadData() {
      const [dashboardResponse, sessionsResponse, studentsResponse] = await Promise.all([
        api.get<CoordinatorDashboardData>('/dashboards/coordinator'),
        api.get<ApiSession[]>('/tutoring-sessions'),
        api.get<StudentWithoutFollowup[]>('/reports/students-without-followup'),
      ]);

      setDashboard(dashboardResponse.data);
      setSessions(sessionsResponse.data);
      setStudentsWithoutFollowup(studentsResponse.data);
    }

    void loadData();
  }, []);

  const metrics: Metric[] = [
    { label: 'Tutorias realizadas', value: String(dashboard?.completedSessions ?? 0), change: 'Concluidas', tone: 'blue' },
    { label: 'Alunos cadastrados', value: String(dashboard?.totalStudents ?? 0), change: 'Ativos', tone: 'green' },
    { label: 'Sem acompanhamento', value: String(dashboard?.studentsWithoutFollowup ?? 0), change: '30 dias', tone: 'red' },
    { label: 'Frequencia media', value: `${dashboard?.averageAttendance ?? 0}%`, change: 'Presencas', tone: 'orange' },
  ];

  return (
    <AppShell title="Dashboard da coordenacao" allowedRoles={['COORDINATOR', 'ADMIN']}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardChart data={[]} />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Alunos em atencao</h2>
          <div className="mt-4 space-y-3">
            {studentsWithoutFollowup.length ? studentsWithoutFollowup.map((student) => (
              <div key={student.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-medium text-slate-950">{student.user?.name ?? 'Aluno sem nome'}</p>
                <p className="text-sm text-slate-500">Sem acompanhamento nos ultimos 30 dias</p>
              </div>
            )) : <p className="text-sm text-slate-500">Nenhum aluno em alerta no momento.</p>}
          </div>
        </section>
      </div>
      <div className="mt-5">
        <SessionTable rows={sessions.map(toSessionRow)} />
      </div>
    </AppShell>
  );
}
