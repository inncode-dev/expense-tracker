import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Filters } from '../types'
import { DEFAULT_FILTERS } from '../lib/filters'
import { FiltersContext } from './filtersContext'

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  // Stable functions (empty dependency lists) so the memoised value below only changes with `filters`.
  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }, [])
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  // Without useMemo this object would be new on every render of the provider,
  // and every consumer would re-render even when nothing changed.
  const value = useMemo(() => ({ filters, setFilter, resetFilters }), [filters, setFilter, resetFilters])

  return <FiltersContext value={value}>{children}</FiltersContext>
}
