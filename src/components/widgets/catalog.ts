import type { DashboardTab, GridWidgetLayout } from '@/types'

export type WidgetId =
  | 'yoy-trend'
  | 'budget'
  | 'ebitda'
  | 'comparison'
  | 'booking-pace'
  | 'opportunities'
  | 'weather'
  | 'comps'
  | 'leftover'
  | 'category'
  | 'segment'
  | 'channel'
  | 'utilization'
  | 'labor-pct'
  | 'cogs'
  | 'outlets'
  | 'capture'
  | 'new-repeat'
  | 'membership'
  | 'league'
  | 'maintenance'
  | 'recent-sales'
  | 'gop'

export interface WidgetDefinition {
  id: WidgetId
  title: string
  description: string
  tab: DashboardTab
  default: GridWidgetLayout
}

export const WIDGET_CATALOG: WidgetDefinition[] = [
  {
    id: 'yoy-trend',
    title: 'YoY rounds & revenue',
    description: '12-month rolling rounds and revenue',
    tab: 'trends',
    default: { i: 'yoy-trend', x: 0, y: 0, w: 8, h: 9, minW: 4, minH: 7 },
  },
  {
    id: 'budget',
    title: 'Budget vs actual',
    description: 'Revenue, rounds, and labor against budget',
    tab: 'trends',
    default: { i: 'budget', x: 8, y: 0, w: 4, h: 9, minW: 3, minH: 6 },
  },
  {
    id: 'ebitda',
    title: 'EBITDA / NOI',
    description: 'Net operating income for investors',
    tab: 'trends',
    default: { i: 'ebitda', x: 0, y: 9, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'comparison',
    title: 'Course comparison',
    description: 'Rounds, revenue/round, and utilization side by side',
    tab: 'trends',
    default: { i: 'comparison', x: 4, y: 9, w: 8, h: 7, minW: 4, minH: 5 },
  },
  {
    id: 'booking-pace',
    title: 'Booking pace',
    description: 'Advance rounds and revenue on the books',
    tab: 'trends',
    default: { i: 'booking-pace', x: 0, y: 16, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'opportunities',
    title: 'Profit opportunities',
    description: 'Combined metrics with dollar impact',
    tab: 'trends',
    default: { i: 'opportunities', x: 4, y: 16, w: 8, h: 7, minW: 4, minH: 5 },
  },
  {
    id: 'weather',
    title: 'Weather-adjusted revenue',
    description: 'Explains variance vs a clean-weather month',
    tab: 'trends',
    default: { i: 'weather', x: 0, y: 23, w: 8, h: 7, minW: 4, minH: 5 },
  },
  {
    id: 'comps',
    title: 'Comps & discounts',
    description: 'Leakage as a share of revenue',
    tab: 'trends',
    default: { i: 'comps', x: 8, y: 23, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'leftover',
    title: 'Unsold tee-time $',
    description: 'Open slots × typical fee',
    tab: 'trends',
    default: { i: 'leftover', x: 8, y: 16, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'category',
    title: 'Revenue by category',
    description: 'Green fees, carts, shop, F&B outlets, lessons, dues',
    tab: 'ops',
    default: { i: 'category', x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 6 },
  },
  {
    id: 'segment',
    title: 'Revenue by rate type',
    description: 'Weekday, weekend, twilight, member, public, outings',
    tab: 'ops',
    default: { i: 'segment', x: 6, y: 0, w: 6, h: 9, minW: 4, minH: 6 },
  },
  {
    id: 'utilization',
    title: 'Tee sheet utilization',
    description: 'Fill rate trend — leftover demand',
    tab: 'ops',
    default: { i: 'utilization', x: 0, y: 9, w: 8, h: 8, minW: 4, minH: 6 },
  },
  {
    id: 'labor-pct',
    title: 'Labor % of revenue',
    description: 'Payroll as a share of sales',
    tab: 'ops',
    default: { i: 'labor-pct', x: 8, y: 9, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'outlets',
    title: 'Outlet contribution',
    description: 'Clubhouse, cart girls, bar, green fees, shop',
    tab: 'ops',
    default: { i: 'outlets', x: 0, y: 17, w: 6, h: 8, minW: 4, minH: 6 },
  },
  {
    id: 'channel',
    title: 'Rounds by channel',
    description: 'Online, phone, walk-in',
    tab: 'ops',
    default: { i: 'channel', x: 6, y: 17, w: 6, h: 8, minW: 3, minH: 5 },
  },
  {
    id: 'cogs',
    title: 'COGS & margins',
    description: 'Pro shop and F&B margin',
    tab: 'ops',
    default: { i: 'cogs', x: 8, y: 14, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'capture',
    title: 'Capture & attach',
    description: 'F&B capture and beverage-cart attach',
    tab: 'ops',
    default: { i: 'capture', x: 0, y: 25, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'new-repeat',
    title: 'New vs repeat',
    description: 'Golfer mix for the period',
    tab: 'ops',
    default: { i: 'new-repeat', x: 4, y: 25, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'membership',
    title: 'Membership & loyalty',
    description: 'Enrollment and renewal rate',
    tab: 'ops',
    default: { i: 'membership', x: 8, y: 25, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'league',
    title: 'League & outing pipeline',
    description: 'Recurring event revenue',
    tab: 'ops',
    default: { i: 'league', x: 0, y: 30, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'maintenance',
    title: 'Maintenance & capex',
    description: 'Spend tracker for owners',
    tab: 'ops',
    default: { i: 'maintenance', x: 4, y: 30, w: 4, h: 5, minW: 3, minH: 4 },
  },
  {
    id: 'recent-sales',
    title: 'Recent sales',
    description: 'Who sold what, and when',
    tab: 'ops',
    default: { i: 'recent-sales', x: 8, y: 30, w: 4, h: 8, minW: 4, minH: 6 },
  },
  {
    id: 'gop',
    title: 'GOP',
    description: 'Gross operating profit',
    tab: 'ops',
    default: { i: 'gop', x: 0, y: 35, w: 4, h: 5, minW: 3, minH: 4 },
  },
]

export const DEFAULT_WIDGETS: Record<DashboardTab, WidgetId[]> = {
  trends: [
    'yoy-trend',
    'budget',
    'ebitda',
    'comparison',
    'booking-pace',
    'opportunities',
  ],
  ops: [
    'category',
    'segment',
    'utilization',
    'labor-pct',
    'outlets',
    'recent-sales',
  ],
}

export function widgetsForTab(tab: DashboardTab) {
  return WIDGET_CATALOG.filter((widget) => widget.tab === tab)
}

export function defaultLayouts(tab: DashboardTab, widgetIds?: WidgetId[]) {
  const ids = widgetIds ?? DEFAULT_WIDGETS[tab]
  const lg = WIDGET_CATALOG.filter(
    (widget) => widget.tab === tab && ids.includes(widget.id),
  ).map((widget) => widget.default)
  return { lg, md: lg, sm: lg }
}

export function widgetById(id: string) {
  return WIDGET_CATALOG.find((widget) => widget.id === id)
}
