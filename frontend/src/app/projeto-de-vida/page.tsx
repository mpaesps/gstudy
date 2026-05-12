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

export default function LifeProjectPage() {
  const { user } = useAuth(['STUDENT', 'TUTOR', 'COORDINATOR', 'ADMIN']);
  const [lifeProject, setLifeProject] = useState<LifeProject | null>(null);
  const [goals, setGoals] = useState<ApiGoal[]>([]);

  useEffect(() => {
    async function loadLifeProject() {
      if (!user?.student?.id) {
        setLifeProject(null);
        setGoals([]);
        return;
      }

      const [lifeProjectData, goalsData] = await Promise.all([
        cachedGet<LifeProject | null>(`/students/${user.student.id}/life-project`, { ttlMs: 60_000 }),
        cachedGet<ApiGoal[]>(`/students/${user.student.id}/goals`, { ttlMs: 60_000 }),
      ]);

      setLifeProject(lifeProjectData);
      setGoals(goalsData);
    }

    void loadLifeProject();
  }, [user]);

  const fields = [
    ['Interesses', lifeProject?.interests],
    ['Pontos fortes', lifeProject?.strengths],
    ['Sonhos', lifeProject?.dreams],
  ];

  const activeGoals = goals.filter((goal) => ['OPEN', 'IN_PROGRESS'].includes(goal.status));

  return (
    <AppShell title="Projeto de Vida">
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

      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Proximos passos</h2>
            <p className="text-sm text-slate-500">As metas pedagogicas abertas representam os proximos passos do Projeto de Vida.</p>
          </div>
          <a href="/metas" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Ver metas
          </a>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {activeGoals.length ? activeGoals.map((goal) => (
            <article key={goal.id} className="rounded-md border border-slate-200 p-4">
              <p className="font-semibold text-slate-950">{goal.title}</p>
              {goal.description ? <p className="mt-2 text-sm text-slate-500">{goal.description}</p> : null}
              <p className="mt-3 text-sm font-medium text-slate-700">
                Prazo: {goal.dueDate ? formatDate(goal.dueDate) : 'Nao informado'}
              </p>
            </article>
          )) : <p className="text-sm text-slate-500">Nenhuma meta aberta para usar como proximo passo.</p>}
        </div>

        {lifeProject?.nextSteps ? (
          <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Anotacoes anteriores de proximos passos</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{lifeProject.nextSteps}</p>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}
