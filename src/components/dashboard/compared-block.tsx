import type { ComparedValue } from '@/types'
import { formatMoney, formatNumber, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'

export function formatCompared(
  value: number | null | undefined,
  format: 'money' | 'number' | 'percent',
) {
  if (format === 'money') return formatMoney(value)
  if (format === 'percent') return formatPercent(value)
  return formatNumber(value)
}

const SERIES = [
  { key: 'current', label: 'Now', field: 'current' as const },
  { key: 'priorPeriod', label: 'Prior', field: 'priorPeriod' as const },
  { key: 'priorYear', label: 'LY', field: 'priorYear' as const },
]

export function ComparedBlock({
  value,
  format,
  invert = false,
  size = 'lg',
}: {
  value: ComparedValue
  format: 'money' | 'number' | 'percent'
  invert?: boolean
  size?: 'lg' | 'md'
}) {
  const current = value.current ?? 0
  const prior = value.priorPeriod ?? 0
  const delta = prior === 0 ? null : ((current - prior) / Math.abs(prior)) * 100
  const improved = delta == null ? null : invert ? delta < 0 : delta > 0
  const amounts = SERIES.map((row) => value[row.field] ?? 0)
  const max = Math.max(...amounts, 1)
  const summary = SERIES.map((row, index) => {
    return `${row.label} ${formatCompared(amounts[index], format)}`
  }).join(', ')

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <p
        className={cn(
          'font-semibold tabular-nums tracking-tight',
          size === 'lg' ? 'text-[1.7rem] leading-none' : 'text-[1.55rem] leading-none',
        )}
      >
        {formatCompared(value.current, format)}
      </p>
      <div className="space-y-2" role="img" aria-label={summary}>
        {SERIES.map((row, index) => {
          const amount = amounts[index]
          const width = Math.max(4, (amount / max) * 100)
          const isNow = index === 0
          return (
            <div key={row.key} className="grid grid-cols-[2.4rem_1fr] items-center gap-2">
              <span className="text-[10px] leading-none text-muted-foreground">{row.label}</span>
              <div
                className="h-2 overflow-hidden rounded-sm bg-muted"
                title={`${row.label}: ${formatCompared(amount, format)}`}
              >
                <div
                  className={cn(
                    'h-full rounded-sm',
                    isNow && improved === false && 'bg-destructive/80',
                    isNow && improved !== false && 'bg-primary',
                    !isNow && 'bg-foreground/25',
                  )}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
