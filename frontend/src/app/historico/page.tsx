'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { SessionTable } from '@/components/session-table';
import { cachedGet } from '@/services/api';
import { ApiSession } from '@/types/domain';
import { toSessionRow } from '@/lib/formatters';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<ApiSession[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await cachedGet<ApiSession[]>('/tutoring-sessions', { ttlMs: 30_000 });
      setSessions(data);
    }

    void loadData();
  }, []);

  return (
    <AppShell title="Historico de tutorias">
      <SessionTable rows={sessions.map(toSessionRow)} />
    </AppShell>
  );
}
