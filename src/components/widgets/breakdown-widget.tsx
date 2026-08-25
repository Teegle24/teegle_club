import { useBreakdown } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatMoney, formatNumber, formatPercent } from '@/lib/format'
import type { MetricsBreakdown } from '@/types'

function formatAmount(value: number, format: 'money' | 'number' | 'percent') {
  if (format === 'money') return formatMoney(value)
  if (format === 'percent') return formatPercent(value, 0)
  return formatNumber(value)
}

export function BreakdownWidget({
  field,
  format = 'money',
  showMargin = false,
}: {
  field: keyof MetricsBreakdown
  format?: 'money' | 'number' | 'percent'
  showMargin?: boolean
}) {
  const query = useBreakdown()
  const rows = query.data?.[field] ?? []

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load breakdown'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (rows.length === 0) {
    return <WidgetEmpty message="No mix data for this scope yet." />
  }

  const ranked = [...rows].sort((a, b) => b.amount - a.amount)
  const max = Math.max(...ranked.map((row) => row.amount), 1)

  return (
    <ul className="flex h-full flex-col justify-center gap-2.5">
      {ranked.map((row) => {
        const width = Math.max(4, (row.amount / max) * 100)
        const extra =
          showMargin && row.marginPct != null
            ? ` · ${formatPercent(row.marginPct)} margin`
            : row.sharePct != null
              ? ` · ${formatPercent(row.sharePct, 0)}`
              : ''
        return (
          <li key={row.id} className="min-w-0">
            <div className="mb-1 flex items-baseline justify-between gap-3 text-[12px]">
              <span className="truncate text-ink">{row.name}</span>
              <span className="shrink-0 tabular-nums text-ink-soft">
                {formatAmount(row.amount, format)}
                {extra}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-sm bg-canvas-2">
              <div
                className="h-full rounded-sm bg-brand"
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
