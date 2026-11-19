import { memo, useState } from 'react'
import type { Expense } from '../types'
import { categoryLabel } from '../lib/categories'
import { formatDate } from '../lib/dates'
import { formatMoney } from '../lib/format'
import { useExpensesDispatch } from '../hooks/useExpenses'
import { Button } from './Button'

interface ExpenseItemProps {
  expense: Expense
  isEditing: boolean
  onEdit: (id: string) => void
}

// memo: skip the re-render when the props are shallowly equal to last time.
// It only works because the parent passes a stable `onEdit` (useCallback)
// and `expense` objects that keep their identity until they actually change.
export const ExpenseItem = memo(function ExpenseItem({ expense, isEditing, onEdit }: ExpenseItemProps) {
  const dispatch = useExpensesDispatch()
  // Local UI state: whether this row is waiting for delete confirmation.
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <li
      className={`flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between ${
        isEditing ? 'bg-mint/40 dark:bg-accent/20' : ''
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{expense.description}</p>
        <p className="mt-0.5 font-mono text-xs text-muted dark:text-night-muted">
          {formatDate(expense.date)} · {categoryLabel(expense.category)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="font-mono text-sm font-medium">{formatMoney(expense.amount)}</span>
        {confirmingDelete ? (
          <div className="flex gap-2" role="group" aria-label={`Confirm deleting ${expense.description}`}>
            <Button variant="danger" onClick={() => dispatch({ type: 'expense_deleted', id: expense.id })}>
              Confirm
            </Button>
            <Button onClick={() => setConfirmingDelete(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onEdit(expense.id)} aria-label={`Edit ${expense.description}`}>
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={() => setConfirmingDelete(true)}
              aria-label={`Delete ${expense.description}`}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </li>
  )
})
