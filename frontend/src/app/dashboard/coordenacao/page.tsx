'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { DashboardChart } from '@/components/dashboard-chart';
import { MetricCard } from '@/components/metric-card';
import { SessionTable } from '@/components/session-table';
import { cachedGet } from '@/services/api';
import { ApiGoal, ApiSession, ApiStudent, ApiTutor, Metric } from '@/types/domain';
import { formatDate, percent, toSessionRow } from '@/lib/formatters';

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

type TutorDashboardData = {
  todaySessions: number;
  studentsInTutoring: number;
  pendingGoals: number;
  scheduledSessions: ApiSession[];
  studentsInTutoringList: ApiStudent[];
  pendingGoalsList: ApiGoal[];
};

type StudentDashboardData = {
  student?: ApiStudent;
  upcomingSessions: Array<{ session?: ApiSession }>;
  openGoals: ApiGoal[];
  indicators: Array<{
    referenceMonth: string;
    academicPerformance: number;
    participation: number;
    attendanceRate: number;
    behaviorEvolution: number;
    goalCompletion: number;
  }>;
};

export default function CoordinatorDashboard() {
  const [dashboard, setDashboard] = useState<CoordinatorDashboardData | null>(null);
  const [sessions, setSessions] = useState<ApiSession[]>([]);
  const [studentsWithoutFollowup, setStudentsWithoutFollowup] = useState<StudentWithoutFollowup[]>([]);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [tutors, setTutors] = useState<ApiTutor[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [studentDashboard, setStudentDashboard] = useState<StudentDashboardData | null>(null);
  const [tutorDashboard, setTutorDashboard] = useState<TutorDashboardData | null>(null);

  useEffect(() => {
    async function loadData() {
      const [dashboardResponse, sessionsResponse, studentsResponse, allStudentsResponse, allTutorsResponse] = await Promise.all([
        cachedGet<CoordinatorDashboardData>('/dashboards/coordinator', { ttlMs: 30_000 }),
        cachedGet<ApiSession[]>('/tutoring-sessions', { ttlMs: 30_000 }),
        cachedGet<StudentWithoutFollowup[]>('/reports/students-without-followup', { ttlMs: 60_000 }),
        cachedGet<ApiStudent[]>('/students', { ttlMs: 60_000 }),
        cachedGet<ApiTutor[]>('/tutors', { ttlMs: 60_000 }),
      ]);

      setDashboard(dashboardResponse);
      setSessions(sessionsResponse);
      setStudentsWithoutFollowup(studentsResponse);
      setStudents(allStudentsResponse);
      setTutors(allTutorsResponse);
      setSelectedStudentId((current) => current || allStudentsResponse[0]?.id || '');
      setSelectedTutorId((current) => current || allTutorsResponse[0]?.id || '');
    }

    void loadData();
  }, []);

  useEffect(() => {
    async function loadIndividualStudent() {
      if (!selectedStudentId) {
        setStudentDashboard(null);
        return;
      }

      const data = await cachedGet<StudentDashboardData>(`/dashboards/student/${selectedStudentId}`, { ttlMs: 30_000 });
      setStudentDashboard(data);
    }

    void loadIndividualStudent();
  }, [selectedStudentId]);

  useEffect(() => {
    async function loadIndividualTutor() {
      if (!selectedTutorId) {
        setTutorDashboard(null);
        return;
      }

      const data = await cachedGet<TutorDashboardData>('/dashboards/tutor', {
        params: { tutorId: selectedTutorId },
        ttlMs: 30_000,
      });
      setTutorDashboard(data);
    }

    void loadIndividualTutor();
  }, [selectedTutorId]);

  const metrics: Metric[] = [
    { label: 'Tutorias realizadas', value: String(dashboard?.completedSessions ?? 0), change: 'Concluidas', tone: 'blue' },
    { label: 'Alunos cadastrados', value: String(dashboard?.totalStudents ?? 0), change: 'Ativos', tone: 'green' },
    { label: 'Sem acompanhamento', value: String(dashboard?.studentsWithoutFollowup ?? 0), change: '30 dias', tone: 'red' },
    { label: 'Frequencia media', value: `${dashboard?.averageAttendance ?? 0}%`, change: 'Presencas', tone: 'orange' },
  ];

  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const selectedTutor = tutors.find((tutor) => tutor.id === selectedTutorId);
  const latestIndicator = studentDashboard?.indicators?.at(-1);
  const studentChartData = studentDashboard?.indicators?.map((indicator) => ({
    month: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(indicator.referenceMonth)),
    desempenho: indicator.academicPerformance,
    participacao: indicator.participation,
  })) ?? [];

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

      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Visao individual</h2>
            <p className="text-sm text-slate-500">Acompanhe um professor e um aluno especifico sem perder a visao geral da rede.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Professor
              <select
                value={selectedTutorId}
                onChange={(event) => setSelectedTutorId(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
              >
                {tutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.user?.name ?? tutor.id}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Aluno
              <select
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.user?.name ?? student.registration ?? student.id}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-950">{selectedTutor?.user?.name ?? 'Professor nao selecionado'}</h3>
            <p className="text-sm text-slate-500">{selectedTutor?.subject ?? 'Area nao informada'}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Tutorias</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{tutorDashboard?.todaySessions ?? 0}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Alunos</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{tutorDashboard?.studentsInTutoring ?? 0}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Metas</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{tutorDashboard?.pendingGoals ?? 0}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {tutorDashboard?.studentsInTutoringList?.length ? tutorDashboard.studentsInTutoringList.map((student) => (
                <a
                  key={student.id}
                  href={`/projeto-de-vida?studentId=${student.id}`}
                  className="block rounded-md border border-slate-200 p-3 text-sm hover:border-brand-500"
                >
                  <span className="font-medium text-slate-950">{student.user?.name ?? 'Aluno sem nome'}</span>
                  <span className="ml-2 text-slate-500">{student.classGroup?.name ?? ''}</span>
                </a>
              )) : <p className="text-sm text-slate-500">Nenhum aluno vinculado a este professor.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-950">{selectedStudent?.user?.name ?? 'Aluno nao selecionado'}</h3>
            <p className="text-sm text-slate-500">{selectedStudent?.classGroup?.name ?? 'Turma nao informada'}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Frequencia</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{percent(latestIndicator?.attendanceRate)}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Metas abertas</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{studentDashboard?.openGoals?.length ?? 0}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Desempenho</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{latestIndicator?.academicPerformance ?? 0}</p>
              </div>
            </div>
            <div className="mt-4">
              <DashboardChart data={studentChartData} />
            </div>
            <div className="mt-4 space-y-2">
              {studentDashboard?.openGoals?.length ? studentDashboard.openGoals.map((goal) => (
                <a
                  key={goal.id}
                  href={`/projeto-de-vida?studentId=${selectedStudentId}`}
                  className="block rounded-md border border-slate-200 p-3 text-sm hover:border-brand-500"
                >
                  <span className="font-medium text-slate-950">{goal.title}</span>
                  <span className="ml-2 text-slate-500">{goal.dueDate ? formatDate(goal.dueDate) : 'Sem prazo'}</span>
                </a>
              )) : <p className="text-sm text-slate-500">Nenhuma meta aberta para este aluno.</p>}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
