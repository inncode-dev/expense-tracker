import { useMemo } from 'react'
import { CATEGORIES } from '../lib/categories'
import { formatMonth } from '../lib/dates'
import { listMonths } from '../lib/filters'
import { useExpenses } from '../hooks/useExpenses'
import { useFilters } from '../hooks/useFilters'
import type { Category } from '../types'
import { Button } from './Button'
import { Select } from './Select'
import { TextField } from './TextField'

export function FiltersBar() {
  const expenses = useExpenses()
  const { filters, setFilter, resetFilters } = useFilters()

  // Only recomputed when the expenses change, not on every keystroke in the search box.
  const monthOptions = useMemo(
    () => [
      { value: 'all', label: 'All months' },
      ...listMonths(expenses).map((month) => ({ value: month, label: formatMonth(month) })),
    ],
    [expenses],
  )
  const categoryOptions = useMemo(() => [{ value: 'all', label: 'All categories' }, ...CATEGORIES], [])

  const isFiltering = filters.month !== 'all' || filters.category !== 'all' || filters.search !== ''

  return (
    <section
      aria-label="Filters"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] lg:items-end"
    >
      <Select
        label="Month"
        value={filters.month}
        onChange={(event) => setFilter('month', event.target.value)}
        options={monthOptions}
      />
      <Select
        label="Category"
        value={filters.category}
        onChange={(event) => setFilter('category', event.target.value as Category | 'all')}
        options={categoryOptions}
      />
      <TextField
        label="Search"
        type="search"
        value={filters.search}
        onChange={(event) => setFilter('search', event.target.value)}
        placeholder="Description or category"
      />
      <Button onClick={resetFilters} disabled={!isFiltering} className="py-2.5">
        Clear filters
      </Button>
    </section>
  )
}
