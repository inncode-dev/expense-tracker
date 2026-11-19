import type { Expense, Filters } from '../types'
import { getMonth } from './dates'
import { categoryLabel } from './categories'

export const DEFAULT_FILTERS: Filters = { month: 'all', category: 'all', search: '' }

/** Newest first; ties broken by description so the order is stable. */
function byDateDesc(a: Expense, b: Expense) {
  return b.date.localeCompare(a.date) || a.description.localeCompare(b.description)
}

export function applyFilters(expenses: Expense[], { month, category, search }: Filters): Expense[] {
  const query = search.trim().toLowerCase()
  return expenses
    .filter((e) => month === 'all' || getMonth(e.date) === month)
    .filter((e) => category === 'all' || e.category === category)
    .filter(
      (e) =>
        !query || e.description.toLowerCase().includes(query) || categoryLabel(e.category).toLowerCase().includes(query),
    )
    .sort(byDateDesc)
}

/** Distinct months present in the data, newest first, for the month <select>. */
export function listMonths(expenses: Expense[]): string[] {
  return [...new Set(expenses.map((e) => getMonth(e.date)))].sort().reverse()
}
