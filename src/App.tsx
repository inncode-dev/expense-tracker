import { useCallback, useState } from 'react'
import { ExpensesProvider } from './state/ExpensesProvider'
import { FiltersProvider } from './state/FiltersProvider'
import { useExpenses } from './hooks/useExpenses'
import { Header } from './components/Header'
import { ExpenseForm } from './components/ExpenseForm'
import { FiltersBar } from './components/FiltersBar'
import { Dashboard } from './components/Dashboard'

function Tracker() {
  const expenses = useExpenses()
  // Local UI state shared by the form and the list, so it lives in their common parent.
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = expenses.find((e) => e.id === editingId) ?? null

  // setEditingId is stable, so this callback is created once. Without useCallback
  // each render would hand ExpenseItem a new function and defeat its React.memo.
  const startEditing = useCallback((id: string) => setEditingId(id), [])
  const stopEditing = useCallback(() => setEditingId(null), [])

  return (
    <main className="flex flex-col gap-6">
      <ExpenseForm key={editing?.id ?? 'new'} editing={editing} onDone={stopEditing} />
      <FiltersBar />
      <Dashboard editingId={editingId} onEdit={startEditing} />
    </main>
  )
}

export default function App() {
  return (
    <ExpensesProvider>
      <FiltersProvider>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
          <Header />
          <Tracker />
        </div>
      </FiltersProvider>
    </ExpensesProvider>
  )
}
