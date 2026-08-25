import { usePeriod } from '@/context/period'
import { cn } from '@/lib/utils'

export function PeriodPicker() {
  const { period, setPeriod, options } = usePeriod()

  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => setPeriod(option.key)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium tracking-wide',
            period === option.key
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
