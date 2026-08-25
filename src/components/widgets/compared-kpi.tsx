import { useMetrics } from '@/api/hooks'
import { ComparedBlock } from '@/components/dashboard/compared-block'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import type { ComparedMetricKey, ComparedValue } from '@/types'

export function ComparedKpiWidget({
  metric,
  format,
  invert = false,
  dark = false,
}: {
  metric: ComparedMetricKey
  format: 'money' | 'number' | 'percent'
  invert?: boolean
  dark?: boolean
}) {
  const query = useMetrics()
  const value = query.data?.[metric]

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load metric'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (!value || typeof value !== 'object' || !('current' in value)) {
    return <WidgetEmpty message="No figure for this period yet." />
  }

  return (
    <ComparedBlock
      value={value as ComparedValue}
      format={format}
      invert={invert}
      size="md"
      dark={dark}
    />
  )
}
