import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Category, Expense } from '../types'
import { CATEGORIES } from '../lib/categories'
import { todayISO } from '../lib/dates'
import { parseAmount } from '../lib/format'
import { DESCRIPTION_MAX, validateExpenseForm, type ExpenseFormErrors } from '../lib/validation'
import { useExpensesDispatch } from '../hooks/useExpenses'
import { Button } from './Button'
import { Select } from './Select'
import { TextField } from './TextField'

interface ExpenseFormProps {
  /** The expense being edited, or null to add a new one. */
  editing: Expense | null
  onDone: () => void
}

// The parent gives this component a `key` that changes with the expense being
// edited. React then remounts it, so the initial values below are re-read
// and no effect is needed to "sync" props into state.
export function ExpenseForm({ editing, onDone }: ExpenseFormProps) {
  const dispatch = useExpensesDispatch()

  // Local state: form fields only matter inside this component.
  const [description, setDescription] = useState(editing?.description ?? '')
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '')
  const [category, setCategory] = useState<Category>(editing?.category ?? 'food')
  const [date, setDate] = useState(editing?.date ?? todayISO())
  const [errors, setErrors] = useState<ExpenseFormErrors>({})

  const descriptionRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  // When the user clicks "Edit" on a row far down the page, bring them to the first field.
  useEffect(() => {
    if (editing) descriptionRef.current?.focus()
  }, [editing])

  const clearError = (field: keyof ExpenseFormErrors) => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateExpenseForm({ description, amount, date })
    setErrors(nextErrors)

    // Move focus to the first invalid field so keyboard and screen reader users land on the problem.
    if (nextErrors.description) return descriptionRef.current?.focus()
    if (nextErrors.amount) return amountRef.current?.focus()
    if (nextErrors.date) return dateRef.current?.focus()

    const values = { description: description.trim(), amount: parseAmount(amount), category, date }

    if (editing) {
      dispatch({ type: 'expense_updated', expense: { ...values, id: editing.id } })
      onDone()
      return
    }

    dispatch({ type: 'expense_added', expense: { ...values, id: crypto.randomUUID() } })
    setDescription('')
    setAmount('')
    descriptionRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={editing ? 'Edit expense' : 'New expense'}
      className="rounded-lg border border-line bg-surface p-4 dark:border-night-line dark:bg-night-surface"
    >
      <h2 className="mb-4 font-display text-lg font-bold uppercase">
        {editing ? 'Edit expense' : 'New expense'}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-start">
        <TextField
          ref={descriptionRef}
          label="Description"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value)
            clearError('description')
          }}
          maxLength={DESCRIPTION_MAX + 20}
          placeholder="What did you buy?"
          error={errors.description}
        />
        <TextField
          ref={amountRef}
          label="Amount (€)"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value)
            clearError('amount')
          }}
          inputMode="decimal"
          placeholder="0.00"
          error={errors.amount}
        />
        <Select
          label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
          options={CATEGORIES}
        />
        <TextField
          ref={dateRef}
          label="Date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value)
            clearError('date')
          }}
          error={errors.date}
        />
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1 lg:self-end">
          <Button type="submit" variant="primary" className="py-2.5">
            {editing ? 'Save' : 'Add expense'}
          </Button>
          {editing && (
            <Button onClick={onDone} className="py-2.5">
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
