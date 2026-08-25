import { useEffect, useMemo, useRef, useState } from 'react'
import type { Layout, Layouts } from 'react-grid-layout'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Plus } from 'lucide-react'
import { useDashboardLayout, useSaveDashboardLayout } from '@/api/hooks'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  DEFAULT_WIDGETS,
  defaultLayouts,
  widgetById,
  widgetsForTab,
  type WidgetId,
} from '@/components/widgets/catalog'
import { BreakdownWidget } from '@/components/widgets/breakdown-widget'
import { BudgetWidget } from '@/components/widgets/budget-widget'
import { ComparedKpiWidget } from '@/components/widgets/compared-kpi'
import { ComparisonWidget } from '@/components/widgets/comparison-widget'
import { OpportunityWidget } from '@/components/widgets/opportunity-widget'
import { RecentSalesWidget } from '@/components/widgets/recent-sales-widget'
import {
  BookingPaceWidget,
  CaptureWidget,
  CostsWidget,
  LeagueWidget,
  MaintenanceWidget,
  MembershipWidget,
  NewRepeatWidget,
} from '@/components/widgets/stat-widgets'
import { UtilizationWidget, YoyTrendWidget } from '@/components/widgets/trend-widget'
import { WidgetFrame } from '@/components/widgets/widget-frame'
import { WidgetLoading } from '@/components/widget-states'
import type { DashboardLayout, DashboardTab, GridWidgetLayout } from '@/types'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

function isWidgetId(id: string, tab: DashboardTab): id is WidgetId {
  return widgetsForTab(tab).some((widget) => widget.id === id)
}

function toGrid(items: GridWidgetLayout[]): Layout[] {
  return items.map((item) => ({
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    minW: item.minW,
    minH: item.minH,
  }))
}

function fromGrid(items: Layout[]): GridWidgetLayout[] {
  return items.map((item) => ({
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    minW: item.minW,
    minH: item.minH,
  }))
}

function renderWidget(id: WidgetId) {
  switch (id) {
    case 'yoy-trend':
      return <YoyTrendWidget />
    case 'weather':
      return <YoyTrendWidget weather />
    case 'budget':
      return <BudgetWidget />
    case 'ebitda':
      return <ComparedKpiWidget metric="ebitda" format="money" />
    case 'gop':
      return <ComparedKpiWidget metric="gop" format="money" />
    case 'comparison':
      return <ComparisonWidget />
    case 'booking-pace':
      return <BookingPaceWidget />
    case 'opportunities':
      return <OpportunityWidget />
    case 'comps':
      return <ComparedKpiWidget metric="compsPct" format="percent" invert />
    case 'leftover':
      return <ComparedKpiWidget metric="leftoverTeeTimeDollars" format="money" invert />
    case 'category':
      return <BreakdownWidget field="categories" />
    case 'segment':
      return <BreakdownWidget field="segments" />
    case 'channel':
      return <BreakdownWidget field="channels" format="number" />
    case 'outlets':
      return <BreakdownWidget field="outlets" showMargin />
    case 'utilization':
      return <UtilizationWidget />
    case 'labor-pct':
      return <ComparedKpiWidget metric="laborPct" format="percent" invert />
    case 'cogs':
      return <CostsWidget />
    case 'capture':
      return <CaptureWidget />
    case 'new-repeat':
      return <NewRepeatWidget />
    case 'membership':
      return <MembershipWidget />
    case 'league':
      return <LeagueWidget />
    case 'maintenance':
      return <MaintenanceWidget />
    case 'recent-sales':
      return <RecentSalesWidget />
    default:
      return null
  }
}

export function DashboardGrid({ tab }: { tab: DashboardTab }) {
  const layoutQuery = useDashboardLayout(tab)
  const saveLayout = useSaveDashboardLayout(tab)
  const catalog = widgetsForTab(tab)
  const [widgetIds, setWidgetIds] = useState<WidgetId[]>(DEFAULT_WIDGETS[tab])
  const [layouts, setLayouts] = useState<Layouts>(defaultLayouts(tab))
  const hydrated = useRef(false)
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    hydrated.current = false
    setWidgetIds(DEFAULT_WIDGETS[tab])
    setLayouts(defaultLayouts(tab))
  }, [tab])

  useEffect(() => {
    if (layoutQuery.isError) {
      hydrated.current = true
      return
    }
    if (!layoutQuery.isSuccess) return
    const remote = layoutQuery.data
    if (remote?.widgets?.length && remote.layouts?.lg) {
      const nextIds = remote.widgets.filter((id): id is WidgetId =>
        isWidgetId(id, tab),
      )
      setWidgetIds(nextIds.length ? nextIds : DEFAULT_WIDGETS[tab])
      setLayouts({
        lg: toGrid(remote.layouts.lg),
        md: toGrid(remote.layouts.md ?? remote.layouts.lg),
        sm: toGrid(remote.layouts.sm ?? remote.layouts.lg),
      })
    } else {
      setWidgetIds(DEFAULT_WIDGETS[tab])
      setLayouts(defaultLayouts(tab))
    }
    hydrated.current = true
  }, [layoutQuery.data, layoutQuery.isError, layoutQuery.isSuccess, tab])

  const persist = (nextIds: WidgetId[], nextLayouts: Layouts) => {
    if (!hydrated.current) return
    const payload: DashboardLayout = {
      tab,
      widgets: nextIds,
      layouts: {
        lg: fromGrid(nextLayouts.lg ?? []),
        md: fromGrid(nextLayouts.md ?? nextLayouts.lg ?? []),
        sm: fromGrid(nextLayouts.sm ?? nextLayouts.lg ?? []),
      },
    }
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      saveLayout.mutate(payload)
    }, 700)
  }

  const onLayoutChange = (_current: Layout[], all: Layouts) => {
    setLayouts(all)
    persist(widgetIds, all)
  }

  const removeWidget = (id: WidgetId) => {
    const nextIds = widgetIds.filter((item) => item !== id)
    const nextLayouts: Layouts = Object.fromEntries(
      Object.entries(layouts).map(([breakpoint, items]) => [
        breakpoint,
        (items ?? []).filter((item) => item.i !== id),
      ]),
    )
    setWidgetIds(nextIds)
    setLayouts(nextLayouts)
    persist(nextIds, nextLayouts)
  }

  const addWidget = (id: WidgetId) => {
    if (widgetIds.includes(id)) return
    const definition = widgetById(id)
    if (!definition) return
    const nextIds = [...widgetIds, id]
    const nextLayouts: Layouts = {
      ...layouts,
      lg: [...(layouts.lg ?? []), definition.default],
      md: [...(layouts.md ?? layouts.lg ?? []), definition.default],
      sm: [...(layouts.sm ?? layouts.lg ?? []), definition.default],
    }
    setWidgetIds(nextIds)
    setLayouts(nextLayouts)
    persist(nextIds, nextLayouts)
  }

  const available = useMemo(
    () => catalog.filter((widget) => !widgetIds.includes(widget.id)),
    [catalog, widgetIds],
  )

  if (layoutQuery.isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-40 rounded-xl border border-border bg-card p-4">
          <WidgetLoading />
        </div>
        <div className="h-40 rounded-xl border border-border bg-card p-4">
          <WidgetLoading />
        </div>
        <div className="h-40 rounded-xl border border-border bg-card p-4">
          <WidgetLoading />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
              Add widget
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-80 w-72 overflow-auto">
            <DropdownMenuLabel>
              {tab === 'trends' ? 'Trends & budget' : 'Ops detail'}
            </DropdownMenuLabel>
            {catalog.map((widget) => (
              <DropdownMenuCheckboxItem
                key={widget.id}
                checked={widgetIds.includes(widget.id)}
                onCheckedChange={(checked) => {
                  if (checked) addWidget(widget.id)
                  else removeWidget(widget.id)
                }}
              >
                {widget.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {widgetIds.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-card/40 text-sm text-muted-foreground">
          No widgets on this view.
          {available[0] ? (
            <Button
              className="ml-3"
              size="sm"
              variant="outline"
              onClick={() => addWidget(available[0].id)}
            >
              Add one
            </Button>
          ) : null}
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1100, md: 760, sm: 0 }}
          cols={{ lg: 12, md: 8, sm: 4 }}
          rowHeight={36}
          draggableHandle=".widget-drag-handle"
          onLayoutChange={onLayoutChange}
          compactType="vertical"
          measureBeforeMount={false}
        >
          {widgetIds.map((id) => {
            const widget = widgetById(id)
            if (!widget) return null
            return (
              <div key={id}>
                <WidgetFrame title={widget.title} onRemove={() => removeWidget(id)}>
                  {renderWidget(id)}
                </WidgetFrame>
              </div>
            )
          })}
        </ResponsiveGridLayout>
      )}
    </div>
  )
}
