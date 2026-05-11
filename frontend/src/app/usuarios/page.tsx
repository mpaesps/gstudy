'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { api, cachedGet, clearApiCache } from '@/services/api';
import { Role } from '@/types/domain';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

const roles: Array<{ value: Role; label: string }> = [
  { value: 'STUDENT', label: 'Aluno' },
  { value: 'TUTOR', label: 'Tutor' },
  { value: 'COORDINATOR', label: 'Coordenador' },
  { value: 'ADMIN', label: 'Administrador' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' as Role,
  });

  const loadUsers = useCallback(async () => {
    const data = await cachedGet<UserRow[]>('/users', { ttlMs: 60_000 });
    setUsers(data);
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/users', form);
      clearApiCache();
      await loadUsers();
      setForm({ name: '', email: '', password: '', role: 'STUDENT' });
      setMessage('Conta criada com sucesso.');
    } catch {
      setError('Nao foi possivel criar a conta. Verifique os dados e tente novamente.');
    }
  }

  return (
    <AppShell title="Gerenciamento de usuarios" allowedRoles={['COORDINATOR', 'ADMIN']}>
      <form onSubmit={handleSubmit} className="mb-5 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">
          Nome
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          E-mail
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Senha
          <input
            required
            minLength={6}
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Perfil de acesso
          <select
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value as Role })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
        {message ? <p className="text-sm font-medium text-green-700 lg:col-span-4">{message}</p> : null}
        {error ? <p className="text-sm font-medium text-red-700 lg:col-span-4">{error}</p> : null}
        <button className="rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 lg:col-span-4">
          Criar conta
        </button>
      </form>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(({ id, name, email, role, status }) => (
              <tr key={id}>
                <td className="px-4 py-3 font-medium text-slate-950">{name}</td>
                <td className="px-4 py-3">{email}</td>
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
