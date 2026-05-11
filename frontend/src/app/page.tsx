'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { api, setAuthSession } from '@/services/api';
import { getHomeByRole } from '@/hooks/use-auth';
import { UserProfile } from '@/types/domain';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post<{ accessToken: string; user: UserProfile }>('/auth/login', {
        email,
        password,
      });

      setAuthSession(response.data.accessToken, response.data.user);
      router.replace(getHomeByRole(response.data.user.role));
    } catch {
      setError('E-mail ou senha invalidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(120deg,#eef5ff,#f8fafc)] px-4">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel md:grid-cols-[1fr_0.9fr]">
        <div className="p-8 md:p-12">
          <div className="mb-10 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
              <ShieldCheck size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-950">Gstudy
                
              </h1>
              <p className="text-sm text-slate-500">Tutoria escolar com acompanhamento inteligente</p>
            </div>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                E-mail institucional
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="coordenacao@gstudy.edu.br"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
              />
            </div>
            {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="block w-full rounded-md bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
        <div className="flex min-h-80 items-end bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center p-8">
          <div className="max-w-sm text-white drop-shadow">
            <p className="text-3xl font-bold">A excelencia academica comeca com acompanhamento.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
