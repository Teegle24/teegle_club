import type { ComparedValue, PeriodKey } from '@/types'
import { Sparkline } from '@/components/dashboard/sparkline'
import { PRIOR_PERIOD_LABEL } from '@/lib/period-copy'
import { formatMoney, formatNumber, formatPercent } from '@/lib/format'
import { usePeriod } from '@/context/period'
import { cn } from '@/lib/utils'

export function formatCompared(
  value: number | null | undefined,
  format: 'money' | 'number' | 'percent',
) {
  if (format === 'money') return formatMoney(value)
  if (format === 'percent') return formatPercent(value)
  return formatNumber(value)
}

function paceCopy(
  current: number,
  target: number,
  format: 'money' | 'number' | 'percent',
  invert: boolean,
) {
  if (format === 'percent') {
    const pts = current - target
    const abs = Math.abs(pts).toFixed(1)
    if (Math.abs(pts) < 0.05) return 'On target'
    if (invert) return pts < 0 ? `${abs} pts under` : `${abs} pts over`
    return pts < 0 ? `${abs} pts short` : `${abs} pts over`
  }
  const pct = target === 0 ? 0 : (current / target) * 100
  return `${pct.toFixed(0)}% to plan`
}

export function ComparedBlock({
  value,
  format,
  invert = false,
  size = 'lg',
  dark = false,
  compact = false,
}: {
  value: ComparedValue
  format: 'money' | 'number' | 'percent'
  invert?: boolean
  size?: 'lg' | 'md'
  dark?: boolean
  compact?: boolean
}) {
  const { period } = usePeriod()
  const current = value.current ?? 0
  const prior = value.priorPeriod ?? 0
  const delta = prior === 0 ? null : ((current - prior) / Math.abs(prior)) * 100
  const improved = delta == null ? null : invert ? delta < 0 : delta > 0
  const target = value.target ?? null
  const spark = value.sparkline ?? []
  const vsLabel = PRIOR_PERIOD_LABEL[period as PeriodKey] ?? 'vs prior'
  const pace = target != null ? paceCopy(current, target, format, invert) : null
  const barPct =
    target == null
      ? 0
      : format === 'percent'
        ? Math.min(100, current)
        : Math.min(100, (current / Math.max(target, 1)) * 100)
  const markerPct =
    target != null && format === 'percent' ? Math.min(100, target) : null
  const onPace =
    target == null
      ? improved !== false
      : invert
        ? current <= target
        : current >= target * 0.98

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'font-display font-semibold tabular-nums tracking-tight',
              size === 'lg' ? 'text-[1.7rem] leading-none' : 'text-[1.45rem] leading-none',
              dark ? 'text-white' : 'text-ink',
            )}
          >
            {formatCompared(value.current, format)}
          </p>
          {delta != null ? (
            <span
              className={cn(
                'mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums',
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
        <p className={cn('mt-1 text-[11px]', dark ? 'text-white/55' : 'text-ink-soft')}>
          {vsLabel}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 items-stretch py-1">
        {spark.length > 1 ? (
          <Sparkline
            values={spark}
            format={format}
            tone={improved === false ? 'warn' : 'brand'}
            dark={dark}
          />
        ) : null}
      </div>

      <div className="h-[2.35rem] shrink-0">
        {target != null ? (
          <>
            <div
              className={cn(
                'mb-1 flex items-baseline justify-between gap-2 text-[11px]',
                dark ? 'text-white/60' : 'text-ink-soft',
              )}
            >
              <span>
                {format === 'percent' ? 'Target' : 'Budget'} {formatCompared(target, format)}
              </span>
              <span className="tabular-nums">{pace}</span>
            </div>
            <div
              className={cn(
                'relative h-1.5 overflow-hidden rounded-full',
                dark ? 'bg-white/10' : 'bg-canvas-2',
              )}
            >
              <div
                className={cn(
                  'h-full rounded-full',
                  onPace ? (dark ? 'bg-brand-2' : 'bg-brand') : 'bg-destructive/80',
                )}
                style={{ width: `${Math.max(4, barPct)}%` }}
              />
              {markerPct != null ? (
                <span
                  className={cn(
                    'absolute top-0 h-full w-px',
                    dark ? 'bg-white/70' : 'bg-ink/50',
                  )}
                  style={{ left: `${markerPct}%` }}
                />
              ) : null}
            </div>
          </>
        ) : compact ? null : (
          <p className={cn('pt-1 text-[11px] tabular-nums', dark ? 'text-white/55' : 'text-ink-soft')}>
            Prior {formatCompared(value.priorPeriod, format)}
            {' · '}
            LY {formatCompared(value.priorYear, format)}
          </p>
        )}
      </div>
    </div>
  )
}
