import { useEffect, useRef, useState } from 'react'
import type { Layout, Layouts } from 'react-grid-layout'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { useDashboardLayout, useSaveDashboardLayout } from '@/api/hooks'
import { MetricCatalogBar } from '@/components/dashboard/metric-catalog-bar'
import {
  DEFAULT_WIDGETS,
  defaultLayouts,
  isWidgetId,
  widgetById,
  type WidgetId,
  type WidgetKind,
} from '@/components/widgets/catalog'
import { BreakdownWidget } from '@/components/widgets/breakdown-widget'
import { BudgetWidget } from '@/components/widgets/budget-widget'
import { ComparedKpiWidget } from '@/components/widgets/compared-kpi'
import { ComparisonWidget } from '@/components/widgets/comparison-widget'
import { HeatmapWidget } from '@/components/widgets/heatmap-widget'
import { OpportunityWidget } from '@/components/widgets/opportunity-widget'
import {
  CompsWidget,
  CourseCategoryWidget,
  FleetWidget,
  LeadTrendWidget,
  LeagueWidget,
  LoyaltyWidget,
  MaintLaborWidget,
  MembershipWidget,
  MixTrendWidget,
  NewRepeatWidget,
  NoShowsWidget,
  PaceWindowsWidget,
  SeasonalUtilitiesWidget,
  StaffingWidget,
  WeatherEventsWidget,
} from '@/components/widgets/ops-widgets'
import { RankingWidget } from '@/components/widgets/ranking-widget'
import { UtilizationWidget, YoyTrendWidget } from '@/components/widgets/trend-widget'
import { WidgetFrame } from '@/components/widgets/widget-frame'
import { WidgetLoading } from '@/components/widget-states'
import type { DashboardLayout, GridWidgetLayout } from '@/types'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

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

function nextY(items: Layout[] | undefined) {
  return (items ?? []).reduce((max, item) => Math.max(max, item.y + item.h), 0)
}

function renderKind(kind: WidgetKind) {
  switch (kind.kind) {
    case 'kpi':
      return (
        <ComparedKpiWidget
          metric={kind.metric}
          format={kind.format}
          invert={kind.invert}
        />
      )
    case 'breakdown':
      return (
        <BreakdownWidget
          field={kind.field}
          format={kind.format}
          showMargin={kind.showMargin}
        />
      )
    case 'ranking':
      return <RankingWidget field={kind.field} />
    case 'heatmap':
      return <HeatmapWidget />
    case 'yoy':
      return <YoyTrendWidget />
    case 'weather':
      return <YoyTrendWidget weather />
    case 'budget':
      return <BudgetWidget />
    case 'comparison':
      return <ComparisonWidget />
    case 'course-category':
      return <CourseCategoryWidget />
    case 'opportunities':
      return <OpportunityWidget />
    case 'utilization-trend':
      return <UtilizationWidget />
    case 'pace-windows':
      return <PaceWindowsWidget />
    case 'mix-trend':
      return <MixTrendWidget />
    case 'lead-trend':
      return <LeadTrendWidget />
    case 'staffing':
      return <StaffingWidget />
    case 'fleet':
      return <FleetWidget />
    case 'seasonal-utilities':
      return <SeasonalUtilitiesWidget />
    case 'weather-events':
      return <WeatherEventsWidget />
    case 'new-repeat':
      return <NewRepeatWidget />
    case 'loyalty':
      return <LoyaltyWidget />
    case 'league':
      return <LeagueWidget />
    case 'membership':
      return <MembershipWidget />
    case 'maint-labor':
      return <MaintLaborWidget />
    case 'comps':
      return <CompsWidget />
    case 'no-shows':
      return <NoShowsWidget />
    default:
      return null
  }
}

export function DashboardGrid() {
  const layoutQuery = useDashboardLayout()
  const saveLayout = useSaveDashboardLayout()
  const [widgetIds, setWidgetIds] = useState<WidgetId[]>(DEFAULT_WIDGETS)
  const [layouts, setLayouts] = useState<Layouts>(defaultLayouts())
  const hydrated = useRef(false)
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    if (layoutQuery.isError) {
      hydrated.current = true
      return
    }
    if (!layoutQuery.isSuccess) return
    const remote = layoutQuery.data
    if (remote?.widgets?.length && remote.layouts?.lg) {
      const nextIds = remote.widgets.filter(isWidgetId)
      setWidgetIds(nextIds.length ? nextIds : DEFAULT_WIDGETS)
      setLayouts({
        lg: toGrid(remote.layouts.lg),
        md: toGrid(remote.layouts.md ?? remote.layouts.lg),
        sm: toGrid(remote.layouts.sm ?? remote.layouts.lg),
      })
    } else {
      setWidgetIds(DEFAULT_WIDGETS)
      setLayouts(defaultLayouts())
    }
    hydrated.current = true
  }, [layoutQuery.data, layoutQuery.isError, layoutQuery.isSuccess])

  const persist = (nextIds: WidgetId[], nextLayouts: Layouts) => {
    if (!hydrated.current) return
    const payload: DashboardLayout = {
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
    const y = nextY(layouts.lg)
    const placed = { ...definition.default, x: 0, y }
    const nextIds = [...widgetIds, id]
    const nextLayouts: Layouts = {
      ...layouts,
      lg: [...(layouts.lg ?? []), placed],
      md: [...(layouts.md ?? layouts.lg ?? []), placed],
      sm: [...(layouts.sm ?? layouts.lg ?? []), placed],
    }
    setWidgetIds(nextIds)
    setLayouts(nextLayouts)
    persist(nextIds, nextLayouts)
  }

  const onToggle = (id: WidgetId, next: boolean) => {
    if (next) addWidget(id)
    else removeWidget(id)
  }

  if (layoutQuery.isPending) {
    return (
      <div className="flex items-start gap-5">
        <MetricCatalogBar selected={widgetIds} onToggle={onToggle} />
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-36 rounded-md border border-border bg-card p-4">
              <WidgetLoading />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-5">
      <MetricCatalogBar selected={widgetIds} onToggle={onToggle} />

      <div className="min-w-0 flex-1">
        {widgetIds.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-md border border-dashed border-border bg-card text-sm text-muted-foreground">
            Nothing on this dashboard. Pick a metric from the list on the left.
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
                    {renderKind(widget.render)}
                  </WidgetFrame>
                </div>
              )
            })}
          </ResponsiveGridLayout>
        )}
      </div>
    </div>
  )
}
