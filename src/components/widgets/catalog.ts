import type { GridWidgetLayout } from '@/types'

export type WidgetId = 'gop' | 'revenue' | 'payroll' | 'trend' | 'recent-sales'

export interface WidgetDefinition {
  id: WidgetId
  title: string
  description: string
  default: GridWidgetLayout
}

export const WIDGET_CATALOG: WidgetDefinition[] = [
  {
    id: 'gop',
    title: 'GOP',
    description: 'Gross operating profit for the current period',
    default: { i: 'gop', x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'revenue',
    title: 'Total revenue',
    description: 'All POS revenue in the current period',
    default: { i: 'revenue', x: 4, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'payroll',
    title: 'Payroll cost',
    description: 'Employee payroll cost for the current period',
    default: { i: 'payroll', x: 8, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'trend',
    title: 'Performance trend',
    description: 'Revenue, GOP, and payroll over time',
    default: { i: 'trend', x: 0, y: 5, w: 8, h: 8, minW: 4, minH: 6 },
  },
  {
    id: 'recent-sales',
    title: 'Recent sales',
    description: 'Who sold what, and when',
    default: { i: 'recent-sales', x: 8, y: 5, w: 4, h: 8, minW: 4, minH: 6 },
  },
]

export const DEFAULT_WIDGET_IDS: WidgetId[] = WIDGET_CATALOG.map(
  (widget) => widget.id,
)

export function defaultLayouts(widgetIds: WidgetId[] = DEFAULT_WIDGET_IDS) {
  const lg = WIDGET_CATALOG.filter((widget) => widgetIds.includes(widget.id)).map(
    (widget) => widget.default,
  )
  return { lg, md: lg, sm: lg }
}

export function widgetById(id: string) {
  return WIDGET_CATALOG.find((widget) => widget.id === id)
}
