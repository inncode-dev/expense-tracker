import { use } from 'react'
import { FiltersContext } from '../state/filtersContext'

export function useFilters() {
  const value = use(FiltersContext)
  if (!value) throw new Error('useFilters must be used inside <FiltersProvider>')
  return value
}
