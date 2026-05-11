'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ChartItem = {
  month: string;
  desempenho: number;
  participacao: number;
};

export function DashboardChart({ data }: { data: ChartItem[] }) {
  const chartData = data.length ? data : [{ month: '-', desempenho: 0, participacao: 0 }];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Evolucao pedagogica</h2>
        <p className="text-sm text-slate-500">Desempenho e participacao por mes</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="desempenho" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="participacao" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
