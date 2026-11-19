import { useDeferredValue, useMemo } from 'react'
import { applyFilters } from '../lib/filters'
import { useExpenses } from './useExpenses'
import { useFilters } from './useFilters'

export function useFilteredExpenses() {
  const expenses = useExpenses()
  const { filters } = useFilters()
  const { month, category } = filters

  // The input shows what the user types immediately; the heavy part (filtering,
  // stats, chart, list) works on a "lagging" copy React can interrupt while typing.
  const deferredSearch = useDeferredValue(filters.search)

  const filtered = useMemo(
    () => applyFilters(expenses, { month, category, search: deferredSearch }),
    [expenses, month, category, deferredSearch],
  )

  return { filtered, isStale: deferredSearch !== filters.search }
}
