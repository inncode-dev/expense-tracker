import { use } from 'react'
import { ExpensesContext, ExpensesDispatchContext } from '../state/expensesContext'

/** Read access. Re-renders the caller whenever the list changes. */
export function useExpenses() {
  const expenses = use(ExpensesContext)
  if (!expenses) throw new Error('useExpenses must be used inside <ExpensesProvider>')
  return expenses
}

/** Write access. The dispatch function is stable, so this never causes a re-render. */
export function useExpensesDispatch() {
  const dispatch = use(ExpensesDispatchContext)
  if (!dispatch) throw new Error('useExpensesDispatch must be used inside <ExpensesProvider>')
  return dispatch
}
