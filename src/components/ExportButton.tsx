import type { Expense } from '../types'
import { downloadCsv, expensesToCsv } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { Button } from './Button'

export function ExportButton({ expenses }: { expenses: Expense[] }) {
  return (
    <Button
      onClick={() => downloadCsv(`expenses-${todayISO()}.csv`, expensesToCsv(expenses))}
      disabled={expenses.length === 0}
    >
      Export CSV ({expenses.length})
    </Button>
  )
}
