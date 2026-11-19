import { useEffect, useReducer, type ReactNode } from 'react'
import type { Expense } from '../types'
import { createDemoExpenses } from '../lib/demoExpenses'
import { isCategory } from '../lib/categories'
import { isValidISODate } from '../lib/dates'
import { readStorage, writeStorage } from '../lib/storage'
import { expensesReducer } from './expensesReducer'
import { ExpensesContext, ExpensesDispatchContext } from './expensesContext'

export const EXPENSES_KEY = 'inncode-expenses:expenses'

function isExpense(value: unknown): value is Expense {
  if (typeof value !== 'object' || value === null) return false
  const e = value as Record<string, unknown>
  return (
    typeof e.id === 'string' &&
    typeof e.description === 'string' &&
    typeof e.amount === 'number' &&
    Number.isFinite(e.amount) &&
    isCategory(e.category) &&
    typeof e.date === 'string' &&
    isValidISODate(e.date)
  )
}

function isExpenseList(value: unknown): value is Expense[] {
  return Array.isArray(value) && value.every(isExpense)
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  // Lazy initialiser: runs once. First visit (or corrupted data) falls back to the demo expenses.
  const [expenses, dispatch] = useReducer(expensesReducer, undefined, () =>
    readStorage(EXPENSES_KEY, createDemoExpenses(), isExpenseList),
  )

  // Persisting is a side effect, so it lives in useEffect, not in the reducer.
  useEffect(() => {
    writeStorage(EXPENSES_KEY, expenses)
  }, [expenses])

  return (
    <ExpensesDispatchContext value={dispatch}>
      <ExpensesContext value={expenses}>{children}</ExpensesContext>
    </ExpensesDispatchContext>
  )
}
