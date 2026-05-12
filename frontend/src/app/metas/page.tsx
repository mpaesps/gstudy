'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/hooks/use-auth';
import { cachedGet } from '@/services/api';
import { formatDate } from '@/lib/formatters';
import { ApiGoal } from '@/types/domain';

type LifeProject = {
  interests?: string | null;
  strengths?: string | null;
  dreams?: string | null;
  nextSteps?: string | null;
};

export default function GoalsPage() {
  const { user } = useAuth(['STUDENT', 'TUTOR', 'COORDINATOR', 'ADMIN']);
  const [goals, setGoals] = useState<ApiGoal[]>([]);
  const [lifeProject, setLifeProject] = useState<LifeProject | null>(null);

  useEffect(() => {
    async function loadGoals() {
      if (!user?.student?.id) {
        setGoals([]);
        setLifeProject(null);
        return;
      }

      const [goalsData, lifeProjectData] = await Promise.all([
        cachedGet<ApiGoal[]>(`/students/${user.student.id}/goals`, { ttlMs: 60_000 }),
        cachedGet<LifeProject | null>(`/students/${user.student.id}/life-project`, { ttlMs: 60_000 }),
      ]);

      setGoals(goalsData);
      setLifeProject(lifeProjectData);
    }

    void loadGoals();
  }, [user]);

  return (
    <AppShell title="Metas pedagogicas">
      <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Metas conectadas ao Projeto de Vida</h2>
            <p className="text-sm text-slate-500">Cada meta abaixo funciona como um proximo passo pratico para aproximar o estudante de seus interesses e sonhos.</p>
          </div>
          <a href="/projeto-de-vida" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
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
