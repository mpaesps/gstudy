'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BarChart3,
  BookOpenCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  UserCircle,
  Users,
} from 'lucide-react';
import { clearAuthSession } from '@/services/api';
import { Role } from '@/types/domain';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';

const navItems = [
  { href: '/dashboard/coordenacao', label: 'Coordenacao', icon: LayoutDashboard, roles: ['COORDINATOR', 'ADMIN'] },
  { href: '/dashboard/tutor', label: 'Tutor', icon: BookOpenCheck, roles: ['TUTOR', 'COORDINATOR', 'ADMIN'] },
  { href: '/dashboard/aluno', label: 'Aluno', icon: GraduationCap, roles: ['STUDENT'] },
  { href: '/tutorias/nova', label: 'Registrar tutoria', icon: ClipboardList, roles: ['TUTOR', 'COORDINATOR', 'ADMIN'] },
  { href: '/historico', label: 'Historico', icon: History, roles: ['STUDENT', 'TUTOR', 'COORDINATOR', 'ADMIN'] },
  { href: '/projeto-de-vida', label: 'Projeto de Vida', icon: BarChart3, roles: ['STUDENT', 'TUTOR', 'COORDINATOR', 'ADMIN'] },
  { href: '/relatorios', label: 'Relatorios', icon: FileText, roles: ['COORDINATOR', 'ADMIN'] },
  { href: '/usuarios', label: 'Usuarios', icon: Users, roles: ['COORDINATOR', 'ADMIN'] },
];

export function AppShell({
  children,
  title,
  allowedRoles,
}: {
  children: React.ReactNode;
  title: string;
  allowedRoles?: Role[];
}) {
  const router = useRouter();
  const { user, loading } = useAuth(allowedRoles);
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">Carregando...</div>;
  }

  const visibleNavItems = navItems.filter((item) => item.roles.includes(user.role));

  function logout() {
    clearAuthSession();
    router.replace('/');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <Link href={visibleNavItems[0]?.href ?? '/'} className="flex items-center gap-3 text-lg font-bold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">G</span>
          Gstudy
        </Link>
        <nav className="mt-8 space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
          <div>
            <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
            <p className="text-sm text-slate-500">Gestao de tutorias escolares</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Alternar tema"
              title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
            >
              {theme === 'dark' ? <Sun size={21} /> : <Moon size={21} />}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Abrir perfil"
                title="Perfil"
              >
                <UserCircle size={24} />
              </button>
              {profileOpen ? (
                <section className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-panel">
                <p className="font-semibold text-slate-950">{user.name}</p>
                <p className="mt-1 text-slate-500">{user.email}</p>
                <dl className="mt-4 space-y-2 text-slate-600">
                  <div className="flex justify-between gap-4">
                    <dt>Perfil</dt>
                    <dd className="font-medium text-slate-950">{user.role}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Status</dt>
                    <dd className="font-medium text-slate-950">{user.status}</dd>
                  </div>
                  {user.student ? (
                    <div className="flex justify-between gap-4">
                      <dt>Matricula</dt>
                      <dd className="font-medium text-slate-950">{user.student.registration}</dd>
                    </div>
                  ) : null}
                  {user.tutor ? (
                    <div className="flex justify-between gap-4">
                      <dt>Area</dt>
                      <dd className="font-medium text-slate-950">{user.tutor.subject ?? 'Nao informada'}</dd>
                    </div>
                  ) : null}
                </dl>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <LogOut size={16} />
                  Sair
                </button>
                </section>
              ) : null}
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </main>
    </div>
  );
}
