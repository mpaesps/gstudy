'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { api } from '@/services/api';

type UserRow = {
  id: string;
  name: string;
  role: string;
  status: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get<UserRow[]>('/users');
      setUsers(response.data);
    }

    void loadUsers();
  }, []);

  return (
    <AppShell title="Gerenciamento de usuarios" allowedRoles={['COORDINATOR', 'ADMIN']}>
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
            {users.map(({ id, name, role, status }) => (
              <tr key={id}>
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
