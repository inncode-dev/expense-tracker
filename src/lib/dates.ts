// Dates are plain `YYYY-MM-DD` strings. Building a Date from them with the
// (year, monthIndex, day) constructor uses the local timezone, so the day
// never shifts the way `new Date('2025-03-01')` (parsed as UTC) can.

const pad = (n: number) => String(n).padStart(2, '0')

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function getMonth(isoDate: string): string {
  return isoDate.slice(0, 7)
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  // Rejects overflow dates such as 2025-02-31, which Date silently rolls into March.
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
}

const dayFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })

export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return dayFormatter.format(new Date(y, m - 1, d))
}

export function formatMonth(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return monthFormatter.format(new Date(y, m - 1, 1))
}
