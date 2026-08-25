import { useMetrics } from '@/api/hooks'
import { ComparedBlock } from '@/components/dashboard/compared-block'
import { WidgetError, WidgetLoading } from '@/components/widget-states'
import { formatPeriod } from '@/lib/format'
import type { ComparedValue } from '@/types'

const CARDS: {
  key: 'revenue' | 'rounds' | 'revenuePerRound' | 'utilizationPct'
  title: string
  format: 'money' | 'number' | 'percent'
}[] = [
  { key: 'revenue', title: 'Revenue', format: 'money' },
  { key: 'rounds', title: 'Rounds', format: 'number' },
  { key: 'revenuePerRound', title: 'Revenue / round', format: 'money' },
  { key: 'utilizationPct', title: 'Utilization', format: 'percent' },
]

export function KpiStrip() {
  const query = useMetrics()

  if (query.isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((card) => (
          <div
            key={card.key}
            className="h-32 rounded-xl border border-border bg-card p-4"
          >
            <WidgetLoading />
          </div>
        ))}
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <WidgetError
          message={
            query.error instanceof Error
              ? query.error.message
              : 'Could not load headline metrics'
          }
          onRetry={() => void query.refetch()}
        />
      </div>
    )
  }

  const data = query.data

  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {formatPeriod(data.period.from, data.period.to)}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((card) => (
          <article
            key={card.key}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {card.title}
            </h2>
            <ComparedBlock
              value={data[card.key] as ComparedValue}
              format={card.format}
            />
          </article>
        ))}
      </div>
    </div>
  )
}
