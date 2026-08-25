import { cn } from '@/lib/utils'

export function Sparkline({
  values,
  className,
  tone = 'brand',
}: {
  values: number[]
  className?: string
  tone?: 'brand' | 'warn'
}) {
  if (values.length < 2) return null
  const width = 160
  const height = 36
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = Math.max((max - min) * 0.2, Math.abs(max) * 0.01, 0.0001)
  const low = min - pad
  const high = max + pad
  const range = high - low
  const coords = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width
    const y = height - ((value - low) / range) * (height - 4) - 2
    return { x, y }
  })
  const path = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ')
  const last = coords[coords.length - 1]
  const stroke = tone === 'warn' ? 'var(--destructive)' : 'var(--brand)'

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn('h-9 w-full', className)}
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last.x} cy={last.y} r="2.2" fill={stroke} />
    </svg>
  )
}
