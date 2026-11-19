import type { Stats } from '../types'
import { categoryLabel } from '../lib/categories'
import { formatMoney } from '../lib/format'

function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4 dark:border-night-line dark:bg-night-surface">
      <dt className="font-mono text-xs uppercase tracking-wide text-muted dark:text-night-muted">{label}</dt>
      <dd className="mt-2 font-display text-2xl font-bold">{value}</dd>
      {detail && <p className="mt-1 text-xs text-muted dark:text-night-muted">{detail}</p>}
    </div>
  )
}

export function StatsCards({ stats }: { stats: Stats }) {
  const { total, count, average, topCategory } = stats

  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Total spent" value={formatMoney(total)} />
      <StatCard label="Expenses" value={String(count)} />
      <StatCard label="Average" value={formatMoney(average)} detail="per expense" />
      <StatCard
        label="Top category"
        value={topCategory ? categoryLabel(topCategory.category) : '—'}
        detail={topCategory ? formatMoney(topCategory.total) : undefined}
      />
    </dl>
  )
}
