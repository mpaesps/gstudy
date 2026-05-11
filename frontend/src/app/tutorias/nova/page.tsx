'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { api, cachedGet, clearApiCache } from '@/services/api';
import { useAuth } from '@/hooks/use-auth';

type Tutor = {
  id: string;
  user?: { name: string };
};

type Student = {
  id: string;
  user?: { name: string };
};

export default function NewTutoringPage() {
  const { user } = useAuth(['TUTOR', 'COORDINATOR', 'ADMIN']);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    tutorId: '',
    studentId: '',
    type: 'INDIVIDUAL',
    scheduledAt: '',
    periodicity: '',
    description: '',
  });

  useEffect(() => {
    async function loadOptions() {
      const [tutorsResponse, studentsResponse] = await Promise.all([
        cachedGet<Tutor[]>('/tutors', { ttlMs: 60_000 }),
        cachedGet<Student[]>('/students', { ttlMs: 60_000 }),
      ]);
      setTutors(tutorsResponse);
      setStudents(studentsResponse);
      setForm((current) => ({
        ...current,
        tutorId: user?.role === 'TUTOR' ? user.tutor?.id ?? '' : tutorsResponse[0]?.id ?? '',
        studentId: studentsResponse[0]?.id ?? '',
      }));
    }

    if (user) {
      void loadOptions();
    }
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    await api.post('/tutoring-sessions', {
      tutorId: form.tutorId,
      type: form.type,
      title: form.title,
      description: form.description,
      scheduledAt: form.scheduledAt,
      periodicity: form.periodicity,
      studentIds: [form.studentId],
    });

    setMessage('Tutoria registrada com sucesso.');
    clearApiCache();
  }

  return (
    <AppShell title="Registrar tutoria" allowedRoles={['TUTOR', 'COORDINATOR', 'ADMIN']}>
      <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Titulo
          <input
            required
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Tutor responsavel
          <select
            required
            value={form.tutorId}
            disabled={user?.role === 'TUTOR'}
            onChange={(event) => setForm({ ...form, tutorId: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          >
            {tutors.map((tutor) => <option key={tutor.id} value={tutor.id}>{tutor.user?.name ?? tutor.id}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Aluno
          <select
            required
            value={form.studentId}
            onChange={(event) => setForm({ ...form, studentId: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          >
            {students.map((student) => <option key={student.id} value={student.id}>{student.user?.name ?? student.id}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Periodicidade
          <input
            value={form.periodicity}
            onChange={(event) => setForm({ ...form, periodicity: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Tipo de tutoria
          <select
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="GROUP">Coletiva</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Data e hora
          <input
            required
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          />
        </label>
        <label className="text-sm font-medium text-slate-700 xl:col-span-2">
          Observacoes pedagogicas
          <textarea
            rows={6}
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
          />
        </label>
        {message ? <p className="text-sm font-medium text-green-700 xl:col-span-2">{message}</p> : null}
        <button className="rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">
          Salvar registro
        </button>
      </form>
    </AppShell>
  );
}
