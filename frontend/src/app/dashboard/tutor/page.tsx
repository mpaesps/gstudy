'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { MetricCard } from '@/components/metric-card';
import { SessionHistoryList } from '@/components/session-history-list';
import { useAuth } from '@/hooks/use-auth';
import { cachedGet } from '@/services/api';
import { formatDate } from '@/lib/formatters';
import { ApiGoal, ApiSession, ApiStudent, Metric } from '@/types/domain';

type TutorDashboardData = {
  todaySessions: number;
  studentsInTutoring: number;
  pendingGoals: number;
  scheduledSessions: ApiSession[];
  studentsInTutoringList: ApiStudent[];
  pendingGoalsList: ApiGoal[];
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
    { label: 'Tutorias agendadas', value: String(dashboard?.todaySessions ?? 0), change: 'Ver lista', tone: 'blue', href: '#tutorias-agendadas' },
    { label: 'Alunos acompanhados', value: String(dashboard?.studentsInTutoring ?? 0), change: 'Ver alunos', tone: 'green', href: '#alunos-acompanhados' },
    { label: 'Metas pendentes', value: String(dashboard?.pendingGoals ?? 0), change: 'Ver metas', tone: 'orange', href: '#metas-pendentes' },
    { label: 'Registros recentes', value: String(dashboard?.recentSessions?.length ?? 0), change: 'Historico', tone: 'blue', href: '#historico-tutorias' },
  ];

  return (
    <AppShell title="Dashboard do tutor" allowedRoles={['TUTOR', 'COORDINATOR', 'ADMIN']}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <section id="tutorias-agendadas" className="scroll-mt-20 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Tutorias agendadas</h2>
          <div className="mt-4 space-y-3">
            {dashboard?.scheduledSessions?.length ? dashboard.scheduledSessions.map((session) => {
              const students = session.participants
                ?.map((participant) => participant.student?.user?.name)
                .filter(Boolean)
                .join(', ');

              return (
                <article key={session.id} className="rounded-md border border-slate-200 p-3">
                  <p className="font-medium text-slate-950">{session.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{students || 'Aluno nao informado'}</p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{formatDate(session.scheduledAt)}</p>
                </article>
              );
            }) : <p className="text-sm text-slate-500">Nenhuma tutoria agendada.</p>}
          </div>
        </section>

        <section id="alunos-acompanhados" className="scroll-mt-20 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Alunos acompanhados</h2>
          <div className="mt-4 space-y-3">
            {dashboard?.studentsInTutoringList?.length ? dashboard.studentsInTutoringList.map((student) => (
              <article key={student.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-medium text-slate-950">{student.user?.name ?? 'Aluno sem nome'}</p>
                <p className="mt-1 text-sm text-slate-500">{student.classGroup?.name ?? 'Turma nao informada'}</p>
                <p className="mt-2 text-xs font-semibold uppercase text-slate-500">Matricula: {student.registration ?? '-'}</p>
              </article>
            )) : <p className="text-sm text-slate-500">Nenhum aluno acompanhado.</p>}
          </div>
        </section>

        <section id="metas-pendentes" className="scroll-mt-20 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Metas pendentes</h2>
          <div className="mt-4 space-y-3">
            {dashboard?.pendingGoalsList?.length ? dashboard.pendingGoalsList.map((goal) => (
              <article key={goal.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-medium text-slate-950">{goal.title}</p>
                <p className="mt-1 text-sm text-slate-500">{goal.student?.user?.name ?? 'Aluno nao informado'}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  Prazo: {goal.dueDate ? formatDate(goal.dueDate) : 'Nao informado'}
                </p>
              </article>
            )) : <p className="text-sm text-slate-500">Nenhuma meta pendente.</p>}
          </div>
        </section>
      </div>

      <section id="historico-tutorias" className="mt-5 scroll-mt-20">
        <h2 className="text-lg font-semibold text-slate-950">Historico de tutorias</h2>
        <p className="mb-4 text-sm text-slate-500">Registros completos para leitura do professor.</p>
        <SessionHistoryList sessions={sessions} />
      </section>
    </AppShell>
  );
}
