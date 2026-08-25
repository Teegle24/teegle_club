import { useMetrics, useRevenueTarget, useSaveRevenueTarget } from '@/api/hooks'
import { ComparedBlock } from '@/components/dashboard/compared-block'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { usePropertyScope } from '@/context/property-scope'
import type { ComparedMetricKey, ComparedValue } from '@/types'

function canWriteTargets(label?: string) {
  return label !== 'investor' && label !== 'board'
}

export function ComparedKpiWidget({
  metric,
  format,
  invert = false,
  dark = false,
  compact = false,
}: {
  metric: ComparedMetricKey
  format: 'money' | 'number' | 'percent'
  invert?: boolean
  dark?: boolean
  compact?: boolean
}) {
  const query = useMetrics()
  const value = query.data?.[metric]
  const isRevenue = metric === 'revenue'
  const targetQuery = useRevenueTarget()
  const saveTarget = useSaveRevenueTarget()
  const { isRollup, selectedProperty, access } = usePropertyScope()
  const membership = access?.memberships.find(
    (item) => item.propertyId === selectedProperty?.id,
  )?.label
  const editable = isRevenue && !isRollup && canWriteTargets(membership)

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
      compact={compact}
      targetEdit={
        isRevenue
          ? {
              annual: targetQuery.data?.annual ?? null,
              editable,
              lockedHint: isRollup ? 'Set on each course' : undefined,
              saving: saveTarget.isPending,
              onSave: (amount) => saveTarget.mutateAsync(amount),
            }
          : undefined
      }
    />
  )
}
