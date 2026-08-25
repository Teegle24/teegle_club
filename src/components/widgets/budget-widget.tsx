import { useBudget } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatMoney, formatNumber, formatPercent } from '@/lib/format'

function display(metric: 'revenue' | 'rounds' | 'labor', value: number) {
  if (metric === 'rounds') return formatNumber(value)
  return formatMoney(value)
}

export function BudgetWidget() {
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
        const laborBad = row.metric === 'labor' && over
        const moneyBad = row.metric !== 'labor' && pct < 100
        return (
          <li key={row.metric}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="tabular-nums">
                {display(row.metric, row.actual)}
                <span className="text-muted-foreground">
                  {' '}
                  / {display(row.metric, row.budget)}
                </span>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${laborBad || moneyBad ? 'bg-destructive/80' : 'bg-primary'}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {formatPercent(pct, 0)} of budget
            </p>
          </li>
        )
      })}
    </ul>
  )
}
