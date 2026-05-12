'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/hooks/use-auth';
import { api, cachedGet, clearApiCache } from '@/services/api';
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

export default function LifeProjectPage() {
  const { user } = useAuth(['STUDENT', 'TUTOR', 'COORDINATOR', 'ADMIN']);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [lifeProject, setLifeProject] = useState<LifeProject | null>(null);
  const [goals, setGoals] = useState<ApiGoal[]>([]);
  const [goalMessage, setGoalMessage] = useState('');
  const [goalError, setGoalError] = useState('');
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

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
    async function loadLifeProject() {
      if (!selectedStudentId) {
        setLifeProject(null);
        setGoals([]);
        return;
      }

      const [lifeProjectData, goalsData] = await Promise.all([
        cachedGet<LifeProject | null>(`/students/${selectedStudentId}/life-project`, { ttlMs: 60_000 }),
        cachedGet<ApiGoal[]>(`/students/${selectedStudentId}/goals`, { ttlMs: 60_000 }),
      ]);

      setLifeProject(lifeProjectData);
      setGoals(goalsData);
    }

    void loadLifeProject();
  }, [selectedStudentId]);

  const fields = [
    ['Interesses', lifeProject?.interests],
    ['Pontos fortes', lifeProject?.strengths],
    ['Sonhos', lifeProject?.dreams],
  ];

  const activeGoals = goals.filter((goal) => ['OPEN', 'IN_PROGRESS'].includes(goal.status));
  const canCreateGoals = user?.role === 'TUTOR';
  const isCoordinationView = user?.role === 'COORDINATOR' || user?.role === 'ADMIN';
  const selectedStudent = students.find((student) => student.id === selectedStudentId);

  async function handleCreateGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGoalMessage('');
    setGoalError('');

    if (!selectedStudentId) {
      setGoalError('Selecione um aluno antes de criar a meta.');
      return;
    }

    try {
      await api.post('/goals', {
        studentId: selectedStudentId,
        title: goalForm.title,
        description: goalForm.description,
        dueDate: goalForm.dueDate || undefined,
      });
      clearApiCache();
      const updatedGoals = await cachedGet<ApiGoal[]>(`/students/${selectedStudentId}/goals`, { ttlMs: 60_000 });
      setGoals(updatedGoals);
      setGoalForm({ title: '', description: '', dueDate: '' });
      setGoalMessage('Meta criada e adicionada aos proximos passos.');
    } catch {
      setGoalError('Nao foi possivel criar a meta.');
    }
  }

  return (
    <AppShell title="Projeto de Vida">
      {user?.role !== 'STUDENT' && !isCoordinationView ? (
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
              Projeto de Vida de <span className="font-semibold text-slate-700">{selectedStudent.user?.name ?? selectedStudent.registration}</span>
              {selectedStudent.classGroup?.name ? ` - ${selectedStudent.classGroup.name}` : ''}
            </p>
          ) : null}
        </section>
      ) : null}

      {!isCoordinationView ? (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map(([label, value]) => (
              <label key={label} className="text-sm font-medium text-slate-700">
                {label}
                <textarea
                  rows={5}
                  readOnly
                  value={value ?? ''}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
                />
              </label>
            ))}
          </div>
        </section>
      ) : null}

      <section className={`${isCoordinationView ? '' : 'mt-5'} rounded-lg border border-slate-200 bg-white p-5 shadow-sm`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Proximos passos</h2>
            <p className="text-sm text-slate-500">
              Interesses, pontos fortes, sonhos e metas abertas orientam os proximos passos do Projeto de Vida.
            </p>
          </div>
        </div>

        {isCoordinationView ? (
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Aluno
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
        ) : null}

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {activeGoals.length ? activeGoals.map((goal) => (
            <article key={goal.id} className="rounded-md border border-slate-200 p-4">
              {isCoordinationView ? (
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500">Aluno</dt>
                    <dd className="mt-1 font-medium text-slate-950">{goal.student?.user?.name ?? selectedStudent?.user?.name ?? 'Nao informado'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500">Professor</dt>
                    <dd className="mt-1 font-medium text-slate-950">{goal.createdBy?.name ?? 'Nao informado'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500">Registro</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-slate-700">
                      {goal.description ? `${goal.title}\n${goal.description}` : goal.title}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500">Prazo</dt>
                    <dd className="mt-1 font-medium text-slate-950">{goal.dueDate ? formatDate(goal.dueDate) : 'Nao informado'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500">Interesses</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-slate-700">{lifeProject?.interests || 'Nao informado'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500">Sonhos</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-slate-700">{lifeProject?.dreams || 'Nao informado'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500">Pontos Fortes</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-slate-700">{lifeProject?.strengths || 'Nao informado'}</dd>
                  </div>
                </dl>
              ) : (
                <>
                  <p className="font-semibold text-slate-950">{goal.title}</p>
                  <p className="mt-1 text-sm text-slate-500">Aluno: {goal.student?.user?.name ?? selectedStudent?.user?.name ?? 'Nao informado'}</p>
                  <p className="text-sm text-slate-500">Professor: {goal.createdBy?.name ?? 'Nao informado'}</p>
                  {goal.description ? <p className="mt-2 text-sm text-slate-500">{goal.description}</p> : null}
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Prazo: {goal.dueDate ? formatDate(goal.dueDate) : 'Nao informado'}
                  </p>
                </>
              )}
            </article>
          )) : <p className="text-sm text-slate-500">Nenhuma meta aberta para usar como proximo passo.</p>}
        </div>

      </section>

      {canCreateGoals ? (
        <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Adicionar meta aos proximos passos</h2>
          <p className="text-sm text-slate-500">A meta criada aqui aparece automaticamente em Proximos passos do aluno selecionado.</p>
          <form onSubmit={handleCreateGoal} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Titulo da meta
              <input
                required
                value={goalForm.title}
                onChange={(event) => setGoalForm({ ...goalForm, title: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Prazo
              <input
                type="date"
                value={goalForm.dueDate}
                onChange={(event) => setGoalForm({ ...goalForm, dueDate: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
              />
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Descricao
              <textarea
                rows={4}
                value={goalForm.description}
                onChange={(event) => setGoalForm({ ...goalForm, description: event.target.value })}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
              />
            </label>
            {goalMessage ? <p className="text-sm font-medium text-green-700 md:col-span-2">{goalMessage}</p> : null}
            {goalError ? <p className="text-sm font-medium text-red-700 md:col-span-2">{goalError}</p> : null}
            <button className="rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 md:col-span-2">
              Criar meta
            </button>
          </form>
        </section>
      ) : null}
    </AppShell>
  );
}
