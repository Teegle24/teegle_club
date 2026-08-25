import { useOps } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { cn } from '@/lib/utils'

export function HeatmapWidget() {
  const query = useOps()
  const cells = query.data?.teeDemand ?? []

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load demand'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (cells.length === 0) {
    return <WidgetEmpty message="Tee-sheet feed not connected." />
  }

  const days = [...new Set(cells.map((cell) => cell.day))]
  const hours = [...new Set(cells.map((cell) => cell.hour))]
  const lookup = new Map(cells.map((cell) => [`${cell.day}-${cell.hour}`, cell.value]))

  return (
    <div className="flex h-full flex-col">
      <div className="grid flex-1 gap-px" style={{ gridTemplateColumns: `2.5rem repeat(${hours.length}, minmax(0, 1fr))` }}>
        <div />
        {hours.map((hour) => (
          <div key={hour} className="pb-1 text-center text-[10px] text-muted-foreground">
            {hour}
          </div>
        ))}
        {days.map((day) => (
          <DayRow key={day} day={day} hours={hours} lookup={lookup} />
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Darker cells are higher utilization.</p>
    </div>
  )
}

function DayRow({
  day,
  hours,
  lookup,
}: {
  day: string
  hours: string[]
  lookup: Map<string, number>
}) {
  return (
    <>
      <div className="flex items-center text-[11px] text-muted-foreground">{day}</div>
      {hours.map((hour) => {
        const value = lookup.get(`${day}-${hour}`) ?? 0
        return (
          <div
            key={`${day}-${hour}`}
            title={`${day} ${hour}: ${Math.round(value)}%`}
            className={cn('min-h-5 rounded-[2px]')}
            style={{ background: `color-mix(in srgb, var(--primary) ${Math.max(8, value)}%, var(--muted))` }}
          />
        )
      })}
    </>
  )
}
