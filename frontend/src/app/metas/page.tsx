'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/services/api';

type Goal = {
  id: string;
  title: string;
  status: string;
  dueDate?: string | null;
};

export default function GoalsPage() {
  const { user } = useAuth(['STUDENT', 'TUTOR', 'COORDINATOR', 'ADMIN']);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    async function loadGoals() {
      if (!user?.student?.id) {
        setGoals([]);
        return;
      }

      const response = await api.get<Goal[]>(`/students/${user.student.id}/goals`);
      setGoals(response.data);
    }

    void loadGoals();
  }, [user]);

  return (
    <AppShell title="Metas pedagogicas">
      <div className="grid gap-4 md:grid-cols-3">
        {goals.length ? goals.map((goal) => (
          <section key={goal.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-950">{goal.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{goal.status}</p>
            <p className="mt-4 text-sm font-medium text-slate-700">
              Prazo: {goal.dueDate ? new Intl.DateTimeFormat('pt-BR').format(new Date(goal.dueDate)) : 'Nao informado'}
            </p>
          </section>
        )) : <p className="text-sm text-slate-500">Nenhuma meta cadastrada para este usuario.</p>}
      </div>
    </AppShell>
  );
}
