'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/services/api';

type LifeProject = {
  interests?: string | null;
  strengths?: string | null;
  dreams?: string | null;
  nextSteps?: string | null;
};

export default function LifeProjectPage() {
  const { user } = useAuth(['STUDENT', 'TUTOR', 'COORDINATOR', 'ADMIN']);
  const [lifeProject, setLifeProject] = useState<LifeProject | null>(null);

  useEffect(() => {
    async function loadLifeProject() {
      if (!user?.student?.id) {
        setLifeProject(null);
        return;
      }

      const response = await api.get<LifeProject | null>(`/students/${user.student.id}/life-project`);
      setLifeProject(response.data);
    }

    void loadLifeProject();
  }, [user]);

  const fields = [
    ['Interesses', lifeProject?.interests],
    ['Pontos fortes', lifeProject?.strengths],
    ['Sonhos', lifeProject?.dreams],
    ['Proximos passos', lifeProject?.nextSteps],
  ];

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
    </AppShell>
  );
}
