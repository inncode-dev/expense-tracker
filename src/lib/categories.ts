import type { Category } from '../types'

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'home', label: 'Home' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'health', label: 'Health' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Other' },
]

const labels = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label])) as Record<Category, string>

export function categoryLabel(category: Category): string {
  return labels[category]
}

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.some((c) => c.value === value)
}
