import type { Expense } from '../types'
import { categoryLabel } from './categories'

/**
 * Quotes a cell when needed. Cells starting with = + - @ are prefixed with a
 * quote because spreadsheets would otherwise run them as formulas (CSV injection).
 */
function escapeCell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value
  return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe
}

export function expensesToCsv(expenses: Expense[]): string {
  const rows = [
    ['Date', 'Description', 'Category', 'Amount (EUR)'],
    ...expenses.map((e) => [e.date, e.description, categoryLabel(e.category), e.amount.toFixed(2)]),
  ]
  return rows.map((row) => row.map(escapeCell).join(',')).join('\r\n')
}

export function downloadCsv(filename: string, content: string): void {
  // The BOM makes Excel read the file as UTF-8.
  const blob = new Blob(['﻿', content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
