import { useEffect, useMemo, useState } from 'react'
import { KpiStrip } from '@/components/dashboard/kpi-strip'
import { PeriodPicker } from '@/components/dashboard/period-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardGrid } from '@/components/widgets/dashboard-grid'
import { usePropertyScope } from '@/context/property-scope'
import type { Access, DashboardTab, PropertyScope } from '@/types'

const TAB_KEY = 'teegle-club.dashboard-tab'

function defaultTab(access: Access | undefined, scope: PropertyScope): DashboardTab {
  if (!access) return 'trends'
  const ids =
    scope.type === 'property'
      ? [scope.propertyId]
      : access.properties.map((property) => property.id)
  const labels = access.memberships
    .filter((item) => ids.includes(item.propertyId))
    .map((item) => item.label)
  if (labels.length > 0 && labels.every((label) => label === 'gm')) return 'ops'
  return 'trends'
}

export function DashboardPage() {
  const { isRollup, selectedProperty, access, scope } = usePropertyScope()
  const labelDefault = useMemo(
    () => defaultTab(access, scope),
    [access, scope],
  )
  const [tab, setTab] = useState<DashboardTab>(() => {
    const stored = localStorage.getItem(TAB_KEY)
    if (stored === 'ops' || stored === 'trends') return stored
    return 'trends'
  })

  useEffect(() => {
    if (localStorage.getItem(TAB_KEY)) return
    setTab(labelDefault)
  }, [labelDefault])

  const onTabChange = (next: string) => {
    const value = next === 'ops' ? 'ops' : 'trends'
    setTab(value)
    localStorage.setItem(TAB_KEY, value)
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRollup
              ? 'Same KPI strip for every role. Switch tabs for budget depth or ops detail.'
              : `Figures for ${selectedProperty?.name ?? 'this course'}.`}
          </p>
        </div>
        <PeriodPicker />
      </div>

      <KpiStrip />

      <Tabs value={tab} onValueChange={onTabChange} className="mt-8">
        <TabsList>
          <TabsTrigger value="trends">Trends & budget</TabsTrigger>
          <TabsTrigger value="ops">Ops detail</TabsTrigger>
        </TabsList>
        <TabsContent value="trends" className="mt-5">
          <DashboardGrid tab="trends" />
        </TabsContent>
        <TabsContent value="ops" className="mt-5">
          <DashboardGrid tab="ops" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
