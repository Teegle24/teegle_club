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
            'rounded-md px-2.5 py-1 text-[12px] font-medium',
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
