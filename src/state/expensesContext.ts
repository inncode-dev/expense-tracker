import { createContext, type Dispatch } from 'react'
import type { Expense, ExpenseAction } from '../types'

// Two contexts instead of one { expenses, dispatch } object. `dispatch` never
// changes, so components that only write (the form, the delete button) can
// subscribe to it without re-rendering every time the list changes.
export const ExpensesContext = createContext<Expense[] | null>(null)
export const ExpensesDispatchContext = createContext<Dispatch<ExpenseAction> | null>(null)
