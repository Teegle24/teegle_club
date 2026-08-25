import { useId } from 'react'
import { cn } from '@/lib/utils'
import { formatMoney, formatNumber, formatPercent } from '@/lib/format'

function axisLabel(
  value: number,
  format: 'money' | 'number' | 'percent',
) {
  if (format === 'percent') return formatPercent(value, 0)
  if (format === 'money') {
    const abs = Math.abs(value)
    if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `$${Math.round(value / 1_000)}k`
    return formatMoney(value)
  }
  const abs = Math.abs(value)
  if (abs >= 1_000) return `${Math.round(value / 1_000)}k`
  return formatNumber(value, abs >= 100 ? 0 : 1)
}

export function Sparkline({
  values,
  format = 'number',
  className,
  tone = 'brand',
  dark = false,
}: {
  values: number[]
  format?: 'money' | 'number' | 'percent'
  className?: string
  tone?: 'brand' | 'warn'
  dark?: boolean
}) {
  const rawId = useId()
  const gradId = `spark-${rawId.replace(/:/g, '')}`
  if (values.length < 2) return null

  const width = 160
  const height = 40
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = Math.max((max - min) * 0.18, Math.abs(max) * 0.008, 0.0001)
  const low = min - pad
  const high = max + pad
  const range = high - low
  const coords = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width
    const y = height - ((value - low) / range) * (height - 3) - 1.5
    return { x, y }
  })
  const line = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ')
  const area = `${line} L${width} ${height} L0 ${height} Z`
  const last = coords[coords.length - 1]
  const first = values[0]
  const good = tone !== 'warn'
  const stroke = good ? (dark ? '#8fd4bc' : 'var(--brand)') : 'var(--destructive)'
  const fillFrom = good ? (dark ? '#8fd4bc' : '#155e4b') : '#b42318'

  return (
    <div className={cn('grid h-full min-h-0 w-full grid-cols-[2.4rem_1fr] grid-rows-[1fr_auto] gap-x-1.5', className)}>
      <div
        className={cn(
          'flex flex-col justify-between py-0.5 text-right text-[9px] leading-none tabular-nums',
          dark ? 'text-white/50' : 'text-ink-soft',
        )}
      >
        <span>{axisLabel(max, format)}</span>
        <span>{axisLabel(min, format)}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full min-h-[2.5rem] w-full overflow-visible rounded-sm"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillFrom} stopOpacity={dark ? 0.45 : 0.35} />
            <stop offset="100%" stopColor={fillFrom} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="3"
          fill={dark ? 'rgba(255,255,255,0.06)' : 'var(--canvas-2)'}
        />
        {[0.25, 0.5, 0.75].map((slot) => (
          <line
            key={slot}
            x1="0"
            x2={width}
            y1={height * slot}
            y2={height * slot}
            stroke={dark ? 'rgba(255,255,255,0.12)' : 'var(--border)'}
            strokeDasharray="3 4"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={area} fill={`url(#${gradId})`} />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={last.x} cy={last.y} r="2.6" fill={stroke} stroke={dark ? '#0c1f19' : '#fff'} strokeWidth="1" />
      </svg>
      <span />
      <div
        className={cn(
          'flex justify-between text-[9px] tabular-nums',
          dark ? 'text-white/50' : 'text-ink-soft',
        )}
      >
        <span>{axisLabel(first, format)}</span>
        <span className={cn('font-medium', good ? (dark ? 'text-ice' : 'text-brand') : 'text-destructive')}>
          {axisLabel(values[values.length - 1], format)}
        </span>
      </div>
    </div>
  )
}
