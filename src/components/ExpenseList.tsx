import { useMemo, useState } from 'react'
import type { Expense } from '../types'
import { ExpenseItem } from './ExpenseItem'
import { Pagination } from './Pagination'

export const PAGE_SIZE = 10

interface ExpenseListProps {
  expenses: Expense[]
  editingId: string | null
  onEdit: (id: string) => void
  isStale: boolean
}

export function ExpenseList({ expenses, editingId, onEdit, isStale }: ExpenseListProps) {
  // Local UI state. The parent remounts this component (via `key`) when the filters change,
  // which sends the user back to page 1 without an effect.
  const [requestedPage, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(expenses.length / PAGE_SIZE))
  // Clamp instead of resetting: deleting the last item of the last page lands on the new last page.
  const page = Math.min(requestedPage, pageCount)

  const visible = useMemo(
    () => expenses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [expenses, page],
  )

  return (
    <section
      aria-labelledby="list-title"
      className="rounded-lg border border-line bg-surface p-4 dark:border-night-line dark:bg-night-surface"
    >
      <h2 id="list-title" className="mb-2 font-display text-lg font-bold uppercase">
        Expenses
      </h2>

      {expenses.length === 0 ? (
        <p role="status" className="py-6 text-center text-sm text-muted dark:text-night-muted">
          No expenses match these filters.
        </p>
      ) : (
        // Dimmed while the deferred search value catches up with what the user typed.
        <ul
          aria-busy={isStale}
          className={`divide-y divide-line transition-opacity dark:divide-night-line ${isStale ? 'opacity-60' : ''}`}
        >
          {visible.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} isEditing={expense.id === editingId} onEdit={onEdit} />
          ))}
        </ul>
      )}

      {expenses.length > PAGE_SIZE && (
        <Pagination page={page} pageCount={pageCount} pageSize={PAGE_SIZE} total={expenses.length} onPageChange={setPage} />
      )}
    </section>
  )
}
