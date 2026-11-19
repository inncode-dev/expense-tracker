import type { Expense, ExpenseAction } from '../types'

// A pure function: same input, same output, no side effects. That is what
// makes it trivial to test and safe for React to call twice in StrictMode.
export function expensesReducer(state: Expense[], action: ExpenseAction): Expense[] {
  switch (action.type) {
    case 'expense_added':
      return [action.expense, ...state]
    case 'expense_updated':
      return state.map((e) => (e.id === action.expense.id ? action.expense : e))
    case 'expense_deleted':
      return state.filter((e) => e.id !== action.id)
    case 'expenses_reset':
      return action.expenses
  }
}
