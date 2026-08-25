import { useBudget } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatMoney, formatNumber, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { BudgetRow } from '@/types'

function display(metric: BudgetRow['metric'], value: number) {
  if (metric === 'rounds') return formatNumber(value)
  return formatMoney(value)
}

export function BudgetWidget({ dark = false }: { dark?: boolean }) {
  const query = useBudget()

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load budget'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (!query.data?.length) {
    return <WidgetEmpty message="No budget loaded for this period." />
  }

  return (
    <ul className="flex h-full flex-col justify-between gap-4">
      {query.data.map((row) => {
        const pct = row.budget ? (row.actual / row.budget) * 100 : 0
        const over = pct > 100
        const costLine = row.metric === 'labor' || row.metric === 'maintenance'
        const bad = costLine ? over : pct < 100
        return (
          <li key={row.metric}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className={cn(dark ? 'text-white/60' : 'text-muted-foreground')}>
                {row.label}
              </span>
              <span className="tabular-nums">
                {display(row.metric, row.actual)}
                <span className={cn(dark ? 'text-white/50' : 'text-muted-foreground')}>
                  {' '}
                  / {display(row.metric, row.budget)}
                </span>
              </span>
            </div>
            <div
              className={cn(
                'h-1.5 overflow-hidden rounded-full',
                dark ? 'bg-white/10' : 'bg-muted',
              )}
            >
              <div
                className={cn(
                  'h-full rounded-full',
                  bad
                    ? dark
                      ? 'bg-red-300'
                      : 'bg-destructive/80'
                    : dark
                      ? 'bg-brand-2'
                      : 'bg-primary',
                )}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <p className={cn('mt-1 text-[11px]', dark ? 'text-white/50' : 'text-muted-foreground')}>
              {formatPercent(pct, 0)} of budget
            </p>
          </li>
        )
      })}
    </ul>
  )
}
