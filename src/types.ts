export type Theme = 'light' | 'dark'

export type Category = 'food' | 'transport' | 'home' | 'leisure' | 'health' | 'shopping' | 'other'

export interface Expense {
  id: string
  description: string
  /** Amount in euros, always positive. */
  amount: number
  category: Category
  /** Local calendar date as `YYYY-MM-DD`. A string avoids timezone shifts that a Date object would cause. */
  date: string
}

/** Everything the form collects: an expense before it has an id. */
export type ExpenseInput = Omit<Expense, 'id'>

/**
 * Discriminated union: `type` tells TypeScript which other fields exist,
 * so inside `case 'expense_updated'` it knows `action.expense` is there.
 */
export type ExpenseAction =
  | { type: 'expense_added'; expense: Expense }
  | { type: 'expense_updated'; expense: Expense }
  | { type: 'expense_deleted'; id: string }
  | { type: 'expenses_reset'; expenses: Expense[] }

export interface Filters {
  /** `all` or a month as `YYYY-MM`. */
  month: string
  category: Category | 'all'
  search: string
}

export interface CategoryTotal {
  category: Category
  total: number
  count: number
}

export interface Stats {
  total: number
  count: number
  average: number
  topCategory: CategoryTotal | null
  byCategory: CategoryTotal[]
}
