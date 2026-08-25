import { useEffect, useMemo, useRef, useState } from 'react'
import type { Layout, Layouts } from 'react-grid-layout'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { RotateCcw } from 'lucide-react'
import { useDashboardLayout, useSaveDashboardLayout } from '@/api/hooks'
import { MetricCatalogBar } from '@/components/dashboard/metric-catalog-bar'
import { SectionHeading } from '@/components/dashboard/section-heading'
import {
  DEFAULT_WIDGETS,
  defaultLayouts,
  isWidgetId,
  packDetailLayouts,
  splitWidgetIds,
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
import { Button } from '@/components/ui/button'
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
    minW: item.minW ?? item.w,
    minH: item.minH ?? item.h,
    maxW: item.maxW ?? item.w,
    maxH: item.maxH ?? item.h,
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
    maxW: item.maxW,
    maxH: item.maxH,
  }))
}

function renderWidgetContent(id: WidgetId, featured = false) {
  const widget = widgetById(id)
  if (!widget) return null
  if (widget.render.kind === 'budget') return <BudgetWidget dark={featured} />
  if (widget.render.kind === 'kpi') {
    return (
      <ComparedKpiWidget
        metric={widget.render.metric}
        format={widget.render.format}
        invert={widget.render.invert}
        dark={featured}
      />
    )
  }
  return renderKind(widget.render)
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

function WidgetTile({
  id,
  onRemove,
  featured = false,
  compact = false,
}: {
  id: WidgetId
  onRemove: () => void
  featured?: boolean
  compact?: boolean
}) {
  const widget = widgetById(id)
  if (!widget) return null
  return (
    <WidgetFrame
      title={widget.title}
      eyebrow={widget.category.replace('-', ' ')}
      onRemove={onRemove}
      draggable={!compact}
      featured={featured}
      className={compact ? 'min-h-[9.5rem]' : 'min-h-[10.5rem]'}
    >
      {renderWidgetContent(id, featured)}
    </WidgetFrame>
  )
}

export function DashboardGrid() {
  const layoutQuery = useDashboardLayout()
  const saveLayout = useSaveDashboardLayout()
  const [widgetIds, setWidgetIds] = useState<WidgetId[]>(DEFAULT_WIDGETS)
  const [layouts, setLayouts] = useState<Layouts>(() => {
    const packed = defaultLayouts()
    return {
      lg: toGrid(packed.lg),
      md: toGrid(packed.md ?? packed.lg),
      sm: toGrid(packed.sm ?? packed.lg),
    }
  })
  const hydrated = useRef(false)
  const saveTimer = useRef<number | null>(null)

  const { hl: hlIds, det: detIds } = useMemo(() => splitWidgetIds(widgetIds), [widgetIds])

  useEffect(() => {
    if (layoutQuery.isError) {
      hydrated.current = true
      return
    }
    if (!layoutQuery.isSuccess) return
    const remote = layoutQuery.data
    if (remote?.widgets?.length) {
      const nextIds = remote.widgets.filter(isWidgetId)
      const ids = nextIds.length ? nextIds : DEFAULT_WIDGETS
      const { det } = splitWidgetIds(ids)
      setWidgetIds(ids)
      setLayouts({
        lg: toGrid(packDetailLayouts(det).lg),
        md: toGrid(packDetailLayouts(det).lg),
        sm: toGrid(packDetailLayouts(det).lg),
      })
    } else {
      setWidgetIds(DEFAULT_WIDGETS)
      const packed = defaultLayouts()
      setLayouts({
        lg: toGrid(packed.lg),
        md: toGrid(packed.md ?? packed.lg),
        sm: toGrid(packed.sm ?? packed.lg),
      })
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

  const repackDetail = (ids: WidgetId[], current?: Layouts) => {
    const { det } = splitWidgetIds(ids)
    const ordered = [...det]
    if (current?.lg?.length) {
      const positions = new Map(current.lg.map((item) => [item.i, item]))
      ordered.sort((a, b) => {
        const la = positions.get(a)
        const lb = positions.get(b)
        if (!la && !lb) return 0
        if (!la) return 1
        if (!lb) return -1
        if (la.y !== lb.y) return la.y - lb.y
        return la.x - lb.x
      })
    }
    const packed = packDetailLayouts(ordered)
    return {
      lg: toGrid(packed.lg),
      md: toGrid(packed.lg),
      sm: toGrid(packed.lg),
    }
  }

  const onLayoutChange = (_current: Layout[], all: Layouts) => {
    setLayouts(all)
    persist(widgetIds, all)
  }

  const removeWidget = (id: WidgetId) => {
    const nextIds = widgetIds.filter((item) => item !== id)
    const nextLayouts = repackDetail(nextIds, layouts)
    setWidgetIds(nextIds)
    setLayouts(nextLayouts)
    persist(nextIds, nextLayouts)
  }

  const addWidget = (id: WidgetId) => {
    if (widgetIds.includes(id)) return
    const definition = widgetById(id)
    if (!definition) return
    const nextIds = [...widgetIds, id]
    const nextLayouts =
      definition.tier === 'det' ? repackDetail(nextIds, layouts) : layouts
    setWidgetIds(nextIds)
    setLayouts(nextLayouts)
    persist(nextIds, nextLayouts)
  }

  const onToggle = (id: WidgetId, next: boolean) => {
    if (next) addWidget(id)
    else removeWidget(id)
  }

  const resetLayout = () => {
    const packed = defaultLayouts()
    const nextLayouts = {
      lg: toGrid(packed.lg),
      md: toGrid(packed.md ?? packed.lg),
      sm: toGrid(packed.sm ?? packed.lg),
    }
    setWidgetIds(DEFAULT_WIDGETS)
    setLayouts(nextLayouts)
    persist(DEFAULT_WIDGETS, nextLayouts)
  }

  if (layoutQuery.isPending) {
    return (
      <div className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-36 rounded-md border border-border bg-card p-4"
            >
              <WidgetLoading />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            eyebrow="High level"
            title="At a glance"
            description="Eight KPIs — uniform tiles, fixed grid."
          />
          <Button type="button" variant="outline" size="sm" onClick={resetLayout}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset layout
          </Button>
        </div>

        {hlIds.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-border bg-canvas-2 text-sm text-ink-soft">
            No high-level metrics selected. Add them from the detail panel below.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {hlIds.map((id) => (
              <WidgetTile
                key={id}
                id={id}
                onRemove={() => removeWidget(id)}
                featured={id === 'budget'}
                compact
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading
          eyebrow="Operations"
          title="Detail metrics"
          description="Drag to reorder. Sizes are locked — add from the list on the left."
          className="mb-4"
        />

        <div className="flex items-start gap-5">
          <MetricCatalogBar selected={widgetIds} onToggle={onToggle} />

          <div className="min-w-0 flex-1">
            {detIds.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center rounded-md border border-dashed border-border bg-canvas-2 text-sm text-ink-soft">
                Pick detail metrics from the categories on the left.
              </div>
            ) : (
              <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1100, md: 760, sm: 0 }}
                cols={{ lg: 12, md: 8, sm: 4 }}
                rowHeight={32}
                draggableHandle=".widget-drag-handle"
                onLayoutChange={onLayoutChange}
                compactType="vertical"
                isResizable={false}
                measureBeforeMount={false}
              >
                {detIds.map((id) => (
                  <div key={id}>
                    <WidgetTile id={id} onRemove={() => removeWidget(id)} />
                  </div>
                ))}
              </ResponsiveGridLayout>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
