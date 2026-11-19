import { isValidISODate } from './dates'
import { parseAmount } from './format'

export const DESCRIPTION_MAX = 60
export const AMOUNT_MAX = 1_000_000

export interface ExpenseFormValues {
  description: string
  amount: string
  date: string
}

export type ExpenseFormErrors = Partial<Record<keyof ExpenseFormValues, string>>

export function validateExpenseForm({ description, amount, date }: ExpenseFormValues): ExpenseFormErrors {
  const errors: ExpenseFormErrors = {}

  const trimmed = description.trim()
  if (!trimmed) errors.description = 'Description is required.'
  else if (trimmed.length > DESCRIPTION_MAX) errors.description = `Keep it under ${DESCRIPTION_MAX} characters.`

  const value = parseAmount(amount)
  if (Number.isNaN(value)) errors.amount = 'Enter an amount like 12.50.'
  else if (value <= 0) errors.amount = 'Amount must be greater than zero.'
  else if (value > AMOUNT_MAX) errors.amount = 'Amount is too large.'

  if (!isValidISODate(date)) errors.date = 'Pick a valid date.'

  return errors
}
