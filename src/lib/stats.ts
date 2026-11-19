import type { CategoryTotal, Expense, Stats } from '../types'
import { CATEGORIES } from './categories'

export function computeStats(expenses: Expense[]): Stats {
  const totals = new Map<string, CategoryTotal>()
  let total = 0

  for (const { amount, category } of expenses) {
    total += amount
    const entry = totals.get(category) ?? { category, total: 0, count: 0 }
    entry.total += amount
    entry.count += 1
    totals.set(category, entry)
  }

  // Keeps the category order stable and drops empty categories.
  const byCategory = CATEGORIES.flatMap((c) => totals.get(c.value) ?? []).sort((a, b) => b.total - a.total)

  return {
    total,
    count: expenses.length,
    average: expenses.length ? total / expenses.length : 0,
    topCategory: byCategory[0] ?? null,
    byCategory,
  }
}
