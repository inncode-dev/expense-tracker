import { Button } from './Button'

interface PaginationProps {
  page: number
  pageCount: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, pageSize, total, onPageChange }: PaginationProps) {
  const first = (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <nav aria-label="Expenses pages" className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 dark:border-night-line">
      <p aria-live="polite" className="font-mono text-xs text-muted dark:text-night-muted">
        {first}–{last} of {total} · Page {page} of {pageCount}
      </p>
      <div className="flex gap-2">
        <Button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={() => onPageChange(page + 1)} disabled={page === pageCount}>
          Next
        </Button>
      </div>
    </nav>
  )
}
