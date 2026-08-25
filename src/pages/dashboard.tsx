import { DashboardGrid } from '@/components/widgets/dashboard-grid'
import { usePropertyScope } from '@/context/property-scope'

export function DashboardPage() {
  const { isRollup, selectedProperty } = usePropertyScope()

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-serif text-3xl tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isRollup
            ? 'Rollup across every course linked to your account. Drag widgets to rearrange.'
            : `Figures for ${selectedProperty?.name ?? 'this course'}. Drag widgets to rearrange.`}
        </p>
      </div>
      <DashboardGrid />
    </div>
  )
}
