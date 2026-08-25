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
  const width = 120
  const height = 28
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const path = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((value - min) / range) * (height - 2) - 1
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-7 w-full overflow-visible', className)}
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={tone === 'warn' ? 'var(--destructive)' : 'var(--brand)'}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
