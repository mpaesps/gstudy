import Link from 'next/link';
import {
  BarChart3,
  BookOpenCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Target,
  Users,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard/coordenacao', label: 'Coordenacao', icon: LayoutDashboard },
  { href: '/dashboard/tutor', label: 'Tutor', icon: BookOpenCheck },
  { href: '/dashboard/aluno', label: 'Aluno', icon: GraduationCap },
  { href: '/tutorias/nova', label: 'Registrar tutoria', icon: ClipboardList },
  { href: '/historico', label: 'Historico', icon: History },
  { href: '/metas', label: 'Metas', icon: Target },
  { href: '/projeto-de-vida', label: 'Projeto de Vida', icon: BarChart3 },
  { href: '/relatorios', label: 'Relatorios', icon: FileText },
  { href: '/usuarios', label: 'Usuarios', icon: Users },
];

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <Link href="/dashboard/coordenacao" className="flex items-center gap-3 text-lg font-bold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">G</span>
          Gstudy
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
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
          <Link href="/" className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
            <LogOut size={16} />
            Sair
          </Link>
        </header>
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </main>
    </div>
  );
}
