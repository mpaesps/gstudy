import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
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
          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                E-mail institucional
              </label>
              <input
                id="email"
                type="email"
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
                placeholder="Digite sua senha"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-brand-600"
              />
            </div>
            <Link
              href="/dashboard/coordenacao"
              className="block rounded-md bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700"
            >
              Entrar
            </Link>
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
