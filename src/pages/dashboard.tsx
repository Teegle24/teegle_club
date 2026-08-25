import { PeriodPicker } from '@/components/dashboard/period-picker'
import { DashboardGrid } from '@/components/widgets/dashboard-grid'
import { useDashboardWidgetsContext } from '@/context/dashboard-widgets'
import { usePropertyScope } from '@/context/property-scope'

export function DashboardPage() {
  const { isRollup, selectedProperty } = usePropertyScope()
  const { widgetIds, removeWidget, resetLayout, reorderHighLevel, isPending } =
    useDashboardWidgetsContext()

  return (
    <div className="grain relative">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-px w-6 bg-brand" />
            <span className="label text-brand">Overview</span>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {isRollup
              ? 'High-level view across linked properties.'
              : selectedProperty?.name}
          </p>
        </div>
        <PeriodPicker />
      </div>

      <DashboardGrid
        widgetIds={widgetIds}
        onRemove={removeWidget}
        onReorderHighLevel={reorderHighLevel}
        resetLayout={resetLayout}
        isPending={isPending}
      />
    </div>
  )
}
