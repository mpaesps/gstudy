import { ApiSession, SessionRow } from '@/types/domain';

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Agendada',
  COMPLETED: 'Concluida',
  CANCELED: 'Cancelada',
  MISSED: 'Perdida',
};

export function formatDate(value?: string | Date) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function toSessionRow(session: ApiSession): SessionRow {
  const students = session.participants
    ?.map((participant) => participant.student?.user?.name)
    .filter(Boolean)
    .join(', ');

  return {
    id: session.id,
    student: students || '-',
    tutor: session.tutor?.user?.name ?? '-',
    type: session.type === 'INDIVIDUAL' ? 'Individual' : 'Coletiva',
    status: statusLabels[session.calendarStatus ?? session.status] ?? session.status,
    date: formatDate(session.scheduledAt),
  };
}

export function percent(value?: number | null) {
  return `${Math.round(value ?? 0)}%`;
}
