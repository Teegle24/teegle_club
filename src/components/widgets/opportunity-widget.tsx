import { useOpportunities } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatMoney } from '@/lib/format'

export function OpportunityWidget() {
  const query = useOpportunities()

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load opportunities'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (!query.data?.length) {
    return <WidgetEmpty message="No material gaps in this period." />
  }

  return (
    <ul className="space-y-3">
      {query.data.map((item) => (
        <li
          key={item.id}
          className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
        >
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
          </div>
          <p className="shrink-0 text-base font-semibold tabular-nums">
            {formatMoney(item.impactDollars)}
          </p>
        </li>
      ))}
    </ul>
  )
}
