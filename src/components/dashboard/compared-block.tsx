import type { ComparedValue } from '@/types'
import {
  deltaPct,
  formatMoney,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from '@/lib/format'
import { cn } from '@/lib/utils'

export function formatCompared(
  value: number | null | undefined,
  format: 'money' | 'number' | 'percent',
) {
  if (format === 'money') return formatMoney(value)
  if (format === 'percent') return formatPercent(value)
  return formatNumber(value)
}

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
  const vsPrior = deltaPct(value.current, value.priorPeriod)
  const vsYear = deltaPct(value.current, value.priorYear)

  return (
    <div className="flex h-full flex-col justify-between">
      <p
        className={cn(
          'font-serif tabular-nums tracking-tight',
          size === 'lg' ? 'text-3xl xl:text-4xl' : 'text-2xl',
        )}
      >
        {formatCompared(value.current, format)}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <Delta label="vs prior" value={vsPrior} invert={invert} />
        <Delta label="vs LY" value={vsYear} invert={invert} />
      </div>
    </div>
  )
}

function Delta({
  label,
  value,
  invert,
}: {
  label: string
  value: number | null
  invert: boolean
}) {
  const good = value == null ? null : invert ? value < 0 : value > 0
  return (
    <span className="text-muted-foreground">
      {label}{' '}
      <span
        className={cn(
          'font-medium tabular-nums',
          good === true && 'text-emerald-700',
          good === false && 'text-destructive',
        )}
      >
        {formatSignedPercent(value)}
      </span>
    </span>
  )
}
