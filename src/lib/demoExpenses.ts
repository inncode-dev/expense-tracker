import type { Category, Expense } from '../types'
import { toISODate } from './dates'

// [months ago, day of month, description, amount, category]
// Dates are relative to today so the month filter always has recent data to show.
const DEMO: [number, number, string, number, Category][] = [
  [0, 2, 'Weekly groceries', 64.2, 'food'],
  [0, 3, 'Monthly train pass', 39.0, 'transport'],
  [0, 5, 'Pizza with friends', 28.5, 'food'],
  [0, 8, 'Cinema tickets', 18.0, 'leisure'],
  [0, 10, 'Pharmacy', 12.9, 'health'],
  [1, 1, 'Rent', 720.0, 'home'],
  [1, 4, 'Groceries', 71.35, 'food'],
  [1, 9, 'Running shoes', 89.9, 'shopping'],
  [1, 14, 'Electricity bill', 54.8, 'home'],
  [1, 20, 'Concert', 45.0, 'leisure'],
  [2, 3, 'Groceries', 58.1, 'food'],
  [2, 12, 'Taxi home', 16.5, 'transport'],
  [2, 18, 'Dentist visit', 80.0, 'health'],
  [2, 25, 'Birthday gift', 35.0, 'other'],
]

export function createDemoExpenses(now: Date = new Date()): Expense[] {
  return DEMO.map(([monthsAgo, day, description, amount, category], index) => ({
    id: `demo-${index + 1}`,
    description,
    amount,
    category,
    // Day numbers stay <= 25, so they exist in every month.
    date: toISODate(new Date(now.getFullYear(), now.getMonth() - monthsAgo, day)),
  }))
}
