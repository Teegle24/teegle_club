import { PeriodPicker } from '@/components/dashboard/period-picker'
import { DashboardGrid } from '@/components/widgets/dashboard-grid'
import { usePropertyScope } from '@/context/property-scope'

export function DashboardPage() {
  const { isRollup, selectedProperty } = usePropertyScope()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isRollup
              ? 'High-level view across linked properties. Add detail from the list on the left.'
              : selectedProperty?.name}
          </p>
        </div>
        <PeriodPicker />
      </div>
      <DashboardGrid />
    </div>
  )
}
