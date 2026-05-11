import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gstudy',
  description: 'Sistema de gestao de tutorias escolares',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
