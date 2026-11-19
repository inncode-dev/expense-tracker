import type { Stats } from '../types'
import { categoryLabel } from '../lib/categories'
import { formatMoney } from '../lib/format'
import { Tooltip } from './Tooltip'

// A bar chart with no library: each bar is a div whose width is its share of the largest total.
export function CategoryChart({ stats }: { stats: Stats }) {
  const { byCategory, total } = stats
  const max = byCategory[0]?.total ?? 0

  return (
    <section
      aria-labelledby="chart-title"
      className="rounded-lg border border-line bg-surface p-4 dark:border-night-line dark:bg-night-surface"
    >
      <h2 id="chart-title" className="mb-4 font-display text-lg font-bold uppercase">
        By category
      </h2>

      {byCategory.length === 0 ? (
        <p className="text-sm text-muted dark:text-night-muted">No data to chart.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {byCategory.map(({ category, total: categoryTotal, count }) => {
            const share = Math.round((categoryTotal / total) * 100)
            const description = `${categoryLabel(category)}: ${formatMoney(categoryTotal)}, ${share}% of total, ${count} ${count === 1 ? 'expense' : 'expenses'}`
            return (
              <li key={category}>
                <Tooltip content={description}>
                  {/* Focusable so keyboard users can reach the tooltip; the label carries the full text. */}
                  <div
                    tabIndex={0}
                    role="img"
                    aria-label={description}
                    className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:focus-visible:outline-mint"
                  >
                    <div className="mb-1 flex justify-between font-mono text-xs">
                      <span className="uppercase tracking-wide">{categoryLabel(category)}</span>
                      <span className="text-muted dark:text-night-muted">{formatMoney(categoryTotal)}</span>
                    </div>
                    <div className="h-3 rounded-sm bg-paper dark:bg-night">
                      {/* Dynamic width is the one thing a utility class cannot express, hence the inline style. */}
                      <div
                        className="h-full rounded-sm bg-accent dark:bg-mint"
                        style={{ width: `${(categoryTotal / max) * 100}%` }}
                      />
                    </div>
                  </div>
                </Tooltip>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
