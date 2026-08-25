import { useMetrics } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatMoney, formatPeriod } from '@/lib/format'

type MetricKey = 'gop' | 'totalRevenue' | 'payrollCost'

export function KpiWidget({ metric }: { metric: MetricKey }) {
  const query = useMetrics()
  const value = query.data?.[metric]
  const currency = query.data?.currency ?? 'USD'

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load metric'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (value == null) {
    return <WidgetEmpty message="No figure for this period yet." />
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <p className="font-serif text-4xl tabular-nums tracking-tight">
        {formatMoney(value, currency)}
      </p>
      <p className="text-xs text-muted-foreground">
        {formatPeriod(query.data?.period.from, query.data?.period.to)}
      </p>
    </div>
  )
}
