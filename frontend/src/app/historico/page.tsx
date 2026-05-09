import { AppShell } from '@/components/app-shell';
import { SessionTable } from '@/components/session-table';
import { sessions } from '@/lib/mock-data';

export default function HistoryPage() {
  return (
    <AppShell title="Historico de tutorias">
      <SessionTable rows={sessions} />
    </AppShell>
  );
}
