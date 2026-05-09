import { SessionRow } from '@/types/domain';
import { StatusBadge } from './status-badge';

export function SessionTable({ rows }: { rows: SessionRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Aluno</th>
            <th className="px-4 py-3">Tutor</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={`${row.student}-${row.date}`} className="text-slate-700">
              <td className="px-4 py-3 font-medium text-slate-950">{row.student}</td>
              <td className="px-4 py-3">{row.tutor}</td>
              <td className="px-4 py-3">{row.type}</td>
              <td className="px-4 py-3">{row.date}</td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
