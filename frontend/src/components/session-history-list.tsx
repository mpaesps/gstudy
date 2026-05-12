import { ApiSession } from '@/types/domain';
import { formatDate, toSessionRow } from '@/lib/formatters';
import { StatusBadge } from './status-badge';

export function SessionHistoryList({ sessions }: { sessions: ApiSession[] }) {
  if (!sessions.length) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        Nenhuma tutoria encontrada no historico.
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const row = toSessionRow(session);
        const observations = session.observations || session.description || 'Sem observacoes registradas.';

        return (
          <article key={session.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Titulo</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">{session.title}</h2>
              </div>
              <StatusBadge status={row.status} />
            </div>

            <dl className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Tutor responsavel</dt>
                <dd className="mt-1 text-sm font-medium text-slate-950">{row.tutor}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Aluno</dt>
                <dd className="mt-1 text-sm font-medium text-slate-950">{row.student}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Periodicidade</dt>
                <dd className="mt-1 text-sm font-medium text-slate-950">{session.periodicity || 'Nao informada'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Tipo de tutoria</dt>
                <dd className="mt-1 text-sm font-medium text-slate-950">{row.type}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Data e hora</dt>
                <dd className="mt-1 text-sm font-medium text-slate-950">{formatDate(session.scheduledAt)}</dd>
              </div>
            </dl>

            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Observacoes pedagogicas</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{observations}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
