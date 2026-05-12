'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/hooks/use-auth';
import { cachedGet } from '@/services/api';
import { formatDate } from '@/lib/formatters';
import { ApiGoal, ApiStudent } from '@/types/domain';

type LifeProject = {
  interests?: string | null;
  strengths?: string | null;
  dreams?: string | null;
  nextSteps?: string | null;
};

type TutorDashboardData = {
  studentsInTutoringList: ApiStudent[];
};

export default function GoalsPage() {
  const { user } = useAuth(['STUDENT', 'TUTOR', 'COORDINATOR', 'ADMIN']);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [goals, setGoals] = useState<ApiGoal[]>([]);
  const [lifeProject, setLifeProject] = useState<LifeProject | null>(null);
  const selectedStudent = students.find((student) => student.id === selectedStudentId);

  useEffect(() => {
    async function loadStudents() {
      if (!user) {
        return;
      }

      const requestedStudentId = new URLSearchParams(window.location.search).get('studentId');

      if (user.role === 'STUDENT') {
        const ownStudent = user.student ? [{ id: user.student.id, registration: user.student.registration }] : [];
        setStudents(ownStudent);
        setSelectedStudentId(user.student?.id ?? '');
        return;
      }

      const loadedStudents =
        user.role === 'TUTOR'
          ? (await cachedGet<TutorDashboardData>('/dashboards/tutor', {
              params: user.tutor?.id ? { tutorId: user.tutor.id } : {},
              ttlMs: 30_000,
            })).studentsInTutoringList
          : await cachedGet<ApiStudent[]>('/students', { ttlMs: 60_000 });

      setStudents(loadedStudents);
      setSelectedStudentId(
        requestedStudentId && loadedStudents.some((student) => student.id === requestedStudentId)
          ? requestedStudentId
          : loadedStudents[0]?.id ?? '',
      );
    }

    void loadStudents();
  }, [user]);

  useEffect(() => {
    async function loadGoals() {
      if (!selectedStudentId) {
        setGoals([]);
        setLifeProject(null);
        return;
      }

      const [goalsData, lifeProjectData] = await Promise.all([
        cachedGet<ApiGoal[]>(`/students/${selectedStudentId}/goals`, { ttlMs: 60_000 }),
        cachedGet<LifeProject | null>(`/students/${selectedStudentId}/life-project`, { ttlMs: 60_000 }),
      ]);

      setGoals(goalsData);
      setLifeProject(lifeProjectData);
    }

    void loadGoals();
  }, [selectedStudentId]);

  return (
    <AppShell title="Metas pedagogicas">
      {user?.role !== 'STUDENT' ? (
        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <label className="text-sm font-medium text-slate-700">
            Aluno registrado
            <select
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600 md:max-w-md"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.user?.name ?? student.registration ?? student.id}
                </option>
              ))}
            </select>
          </label>
          {selectedStudent ? (
            <p className="mt-3 text-sm text-slate-500">
              Metas de <span className="font-semibold text-slate-700">{selectedStudent.user?.name ?? selectedStudent.registration}</span>
              {selectedStudent.classGroup?.name ? ` - ${selectedStudent.classGroup.name}` : ''}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Metas conectadas ao Projeto de Vida</h2>
            <p className="text-sm text-slate-500">Cada meta abaixo funciona como um proximo passo pratico para aproximar o estudante de seus interesses e sonhos.</p>
          </div>
          <a href={`/projeto-de-vida${selectedStudentId ? `?studentId=${selectedStudentId}` : ''}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Ver Projeto de Vida
          </a>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Interesses</p>
            <p className="mt-2 text-sm text-slate-700">{lifeProject?.interests || 'Nao informado'}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Pontos fortes</p>
            <p className="mt-2 text-sm text-slate-700">{lifeProject?.strengths || 'Nao informado'}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Sonhos</p>
            <p className="mt-2 text-sm text-slate-700">{lifeProject?.dreams || 'Nao informado'}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {goals.length ? goals.map((goal) => (
          <section key={goal.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-950">{goal.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{goal.status}</p>
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <p>Aluno: <span className="font-medium text-slate-950">{goal.student?.user?.name ?? selectedStudent?.user?.name ?? 'Nao informado'}</span></p>
              <p>Professor: <span className="font-medium text-slate-950">{goal.createdBy?.name ?? 'Nao informado'}</span></p>
            </div>
            {goal.description ? <p className="mt-3 text-sm text-slate-700">{goal.description}</p> : null}
            <p className="mt-4 text-sm font-medium text-slate-700">
              Proximo passo ate: {goal.dueDate ? formatDate(goal.dueDate) : 'Nao informado'}
            </p>
          </section>
        )) : <p className="text-sm text-slate-500">Nenhuma meta cadastrada para este usuario.</p>}
      </div>
    </AppShell>
  );
}
