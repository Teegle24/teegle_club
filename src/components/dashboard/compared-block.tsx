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
  { key: 'current', label: 'Now', field: 'current' as const, tone: 'brand' as const },
  { key: 'priorPeriod', label: 'Prior', field: 'priorPeriod' as const, tone: 'steel' as const },
  { key: 'priorYear', label: 'LY', field: 'priorYear' as const, tone: 'mist' as const },
]

export function ComparedBlock({
  value,
  format,
  invert = false,
  size = 'lg',
  dark = false,
}: {
  value: ComparedValue
  format: 'money' | 'number' | 'percent'
  invert?: boolean
  size?: 'lg' | 'md'
  dark?: boolean
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

  const barTone = {
    brand: dark ? 'bg-brand-2' : 'bg-brand',
    steel: dark ? 'bg-white/35' : 'bg-steel/70',
    mist: dark ? 'bg-white/20' : 'bg-canvas-3',
  }

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            'font-display font-semibold tabular-nums tracking-tight',
            size === 'lg' ? 'text-[1.7rem] leading-none' : 'text-[1.55rem] leading-none',
            dark ? 'text-white' : 'text-ink',
          )}
        >
          {formatCompared(value.current, format)}
        </p>
        {delta != null ? (
          <span
            className={cn(
              'mt-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums',
              improved === false &&
                (dark ? 'bg-red-400/20 text-red-100' : 'bg-destructive/10 text-destructive'),
              improved !== false &&
                (dark ? 'bg-emerald-400/20 text-emerald-100' : 'bg-brand/10 text-brand'),
            )}
          >
            {delta > 0 ? '+' : ''}
            {delta.toFixed(1)}%
          </span>
        ) : null}
      </div>
      <div className="space-y-2" role="img" aria-label={summary}>
        {SERIES.map((row, index) => {
          const amount = amounts[index]
          const width = Math.max(4, (amount / max) * 100)
          const isNow = index === 0
          return (
            <div key={row.key} className="grid grid-cols-[2.4rem_1fr] items-center gap-2">
              <span
                className={cn(
                  'text-[10px] leading-none',
                  dark ? 'text-white/55' : 'text-ink-soft',
                )}
              >
                {row.label}
              </span>
              <div
                className={cn(
                  'h-2 overflow-hidden rounded-sm',
                  dark ? 'bg-white/10' : 'bg-canvas-2',
                )}
                title={`${row.label}: ${formatCompared(amount, format)}`}
              >
                <div
                  className={cn(
                    'h-full rounded-sm transition-[width]',
                    isNow && improved === false && (dark ? 'bg-red-300' : 'bg-destructive/80'),
                    isNow && improved !== false && barTone.brand,
                    !isNow && barTone[row.tone],
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
