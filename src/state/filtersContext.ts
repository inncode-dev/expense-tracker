import { createContext } from 'react'
import type { Filters } from '../types'

export interface FiltersContextValue {
  filters: Filters
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  resetFilters: () => void
}

export const FiltersContext = createContext<FiltersContextValue | null>(null)
