'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { SessionHistoryList } from '@/components/session-history-list';
import { cachedGet } from '@/services/api';
import { ApiSession } from '@/types/domain';

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
      <SessionHistoryList sessions={sessions} />
    </AppShell>
  );
}
