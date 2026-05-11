const statusClass: Record<string, string> = {
  Concluida: 'bg-green-50 text-green-700 ring-green-200',
  Agendada: 'bg-blue-50 text-blue-700 ring-blue-200',
  Pendente: 'bg-orange-50 text-orange-700 ring-orange-200',
  Alerta: 'bg-red-50 text-red-700 ring-red-200',
  Perdida: 'bg-red-50 text-red-700 ring-red-200',
  Cancelada: 'bg-slate-50 text-slate-700 ring-slate-200',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${statusClass[status] ?? statusClass.Pendente}`}>
      {status}
    </span>
  );
}
