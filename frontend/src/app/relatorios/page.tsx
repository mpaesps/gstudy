'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { cachedGet } from '@/services/api';

const reports = [
  { title: 'Relatorio de tutorias', endpoint: '/reports/tutoring' },
  { title: 'Relatorio de frequencia', endpoint: '/reports/attendance' },
  { title: 'Alunos sem acompanhamento', endpoint: '/reports/students-without-followup' },
];

export default function ReportsPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadReports() {
      const responses = await Promise.all(reports.map((report) => cachedGet<unknown[]>(report.endpoint, { ttlMs: 60_000 })));
      setCounts(Object.fromEntries(reports.map((report, index) => [report.endpoint, responses[index].length])));
    }

    void loadReports();
  }, []);

  return (
    <AppShell title="Relatorios" allowedRoles={['COORDINATOR', 'ADMIN']}>
      <div className="grid gap-4 md:grid-cols-3">
        {reports.map((report) => (
          <section key={report.endpoint} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-950">{report.title}</h2>
            <p className="mt-2 text-sm text-slate-500">Filtros por escola, turma, aluno, tutor e periodo.</p>
            <p className="mt-5 text-3xl font-semibold text-slate-950">{counts[report.endpoint] ?? 0}</p>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
