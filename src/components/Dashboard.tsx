import { useMemo } from 'react'
import { computeStats } from '../lib/stats'
import { useFilteredExpenses } from '../hooks/useFilteredExpenses'
import { useFilters } from '../hooks/useFilters'
import { CategoryChart } from './CategoryChart'
import { ExpenseList } from './ExpenseList'
import { ExportButton } from './ExportButton'
import { StatsCards } from './StatsCards'

interface DashboardProps {
  editingId: string | null
  onEdit: (id: string) => void
}

// The filtered list is computed once here and handed down as props, so the
// stats, the chart, the list and the export always describe the same data.
export function Dashboard({ editingId, onEdit }: DashboardProps) {
  const { filtered, isStale } = useFilteredExpenses()
  const { filters } = useFilters()
  const stats = useMemo(() => computeStats(filtered), [filtered])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="font-mono text-xs text-muted dark:text-night-muted">
          Showing {filtered.length} {filtered.length === 1 ? 'expense' : 'expenses'}
        </p>
        <ExportButton expenses={filtered} />
      </div>
      <StatsCards stats={stats} />
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr] lg:items-start">
        <CategoryChart stats={stats} />
        <ExpenseList
          key={`${filters.month}|${filters.category}|${filters.search}`}
          expenses={filtered} editingId={editingId} onEdit={onEdit} isStale={isStale} />
      </div>
    </div>
  )
}
