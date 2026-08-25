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
  DEFAULT_WIDGET_IDS,
  defaultLayouts,
  WIDGET_CATALOG,
  widgetById,
  type WidgetId,
} from '@/components/widgets/catalog'
import { KpiWidget } from '@/components/widgets/kpi-widget'
import { RecentSalesWidget } from '@/components/widgets/recent-sales-widget'
import { TrendWidget } from '@/components/widgets/trend-widget'
import { WidgetFrame } from '@/components/widgets/widget-frame'
import { WidgetLoading } from '@/components/widget-states'
import type { DashboardLayout, GridWidgetLayout } from '@/types'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

function isWidgetId(id: string): id is WidgetId {
  return WIDGET_CATALOG.some((widget) => widget.id === id)
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
  if (id === 'gop') return <KpiWidget metric="gop" />
  if (id === 'revenue') return <KpiWidget metric="totalRevenue" />
  if (id === 'payroll') return <KpiWidget metric="payrollCost" />
  if (id === 'trend') return <TrendWidget />
  return <RecentSalesWidget />
}

export function DashboardGrid() {
  const layoutQuery = useDashboardLayout()
  const saveLayout = useSaveDashboardLayout()
  const [widgetIds, setWidgetIds] = useState<WidgetId[]>(DEFAULT_WIDGET_IDS)
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
      setWidgetIds(remote.widgets.filter(isWidgetId))
      setLayouts({
        lg: toGrid(remote.layouts.lg),
        md: toGrid(remote.layouts.md ?? remote.layouts.lg),
        sm: toGrid(remote.layouts.sm ?? remote.layouts.lg),
      })
    } else {
      setWidgetIds(DEFAULT_WIDGET_IDS)
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
    () => WIDGET_CATALOG.filter((widget) => !widgetIds.includes(widget.id)),
    [widgetIds],
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
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Dashboard widgets</DropdownMenuLabel>
            {WIDGET_CATALOG.map((widget) => (
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
          No widgets on this dashboard.
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
