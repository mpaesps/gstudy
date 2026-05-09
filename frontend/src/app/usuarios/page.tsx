import { AppShell } from '@/components/app-shell';

const users = [
  ['Gabriel Rocha', 'COORDINATOR', 'Ativo'],
  ['Prof. Rafael', 'TUTOR', 'Ativo'],
  ['Ana Clara', 'STUDENT', 'Ativo'],
];

export default function UsersPage() {
  return (
    <AppShell title="Gerenciamento de usuarios">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(([name, role, status]) => (
              <tr key={name}>
                <td className="px-4 py-3 font-medium text-slate-950">{name}</td>
                <td className="px-4 py-3">{role}</td>
                <td className="px-4 py-3">{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
