import { Metric } from '@/types/domain';

const toneClass = {
  blue: 'border-blue-100 bg-blue-50 text-blue-700',
  green: 'border-green-100 bg-green-50 text-green-700',
  orange: 'border-orange-100 bg-orange-50 text-orange-700',
  red: 'border-red-100 bg-red-50 text-red-700',
};

export function MetricCard({ metric }: { metric: Metric }) {
  const content = (
    <>
      <p className="text-sm font-medium text-slate-500">{metric.label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-3xl font-semibold text-slate-950">{metric.value}</strong>
        <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${toneClass[metric.tone]}`}>
          {metric.change}
        </span>
      </div>
    </>
  );

  if (metric.href) {
    return (
      <a
        href={metric.href}
        className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-panel"
      >
        {content}
      </a>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {content}
    </section>
  );
}
