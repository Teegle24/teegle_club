import type {
  ComparedMetricKey,
  GridWidgetLayout,
  MetricCategory,
  MetricTier,
  MetricsBreakdown,
  OpsMetrics,
  SizeTier,
} from '@/types'
import { packWidgets } from '@/components/widgets/grid-tiers'

export type WidgetId =
  | 'revenue'
  | 'revenue-per-round'
  | 'leftover'
  | 'category'
  | 'segment'
  | 'channel-revenue'
  | 'comps'
  | 'atv-shop'
  | 'atv-fb'
  | 'rounds'
  | 'utilization'
  | 'util-time-block'
  | 'util-dow'
  | 'booking-lead'
  | 'booking-pace'
  | 'tee-heatmap'
  | 'golfer-type'
  | 'no-shows'
  | 'rebooking'
  | 'booking-mix'
  | 'fb-revenue'
  | 'fb-attach'
  | 'fb-top'
  | 'fb-slow'
  | 'fb-category'
  | 'avg-check-fb'
  | 'fb-daypart'
  | 'food-cost'
  | 'waste'
  | 'fb-stock'
  | 'shop-revenue'
  | 'shop-top'
  | 'shop-slow'
  | 'shop-margin'
  | 'shop-turnover'
  | 'shrinkage'
  | 'opex'
  | 'labor-pct'
  | 'payroll-dept'
  | 'overtime'
  | 'labor-per-round'
  | 'staffing'
  | 'dept-budget'
  | 'utilities'
  | 'water'
  | 'electric'
  | 'fuel'
  | 'utility-per-round'
  | 'seasonal-util'
  | 'maintenance'
  | 'equipment-maint'
  | 'downtime'
  | 'fleet'
  | 'maint-area'
  | 'chemicals'
  | 'maint-labor'
  | 'weather-events'
  | 'yoy-trend'
  | 'budget'
  | 'ebitda'
  | 'gop'
  | 'weather'
  | 'opportunities'
  | 'new-repeat'
  | 'loyalty'
  | 'league'
  | 'membership'
  | 'clv'
  | 'comparison'
  | 'course-category'

export type RankField = keyof Pick<
  OpsMetrics,
  'topFbItems' | 'slowFbItems' | 'topShopItems' | 'slowShopItems' | 'lowStock'
>

export type WidgetKind =
  | {
      kind: 'kpi'
      metric: ComparedMetricKey
      format: 'money' | 'number' | 'percent'
      invert?: boolean
    }
  | {
      kind: 'breakdown'
      field: keyof MetricsBreakdown
      format?: 'money' | 'number' | 'percent'
      showMargin?: boolean
    }
  | { kind: 'ranking'; field: RankField }
  | { kind: 'heatmap' }
  | { kind: 'yoy' }
  | { kind: 'weather' }
  | { kind: 'budget' }
  | { kind: 'comparison' }
  | { kind: 'course-category' }
  | { kind: 'opportunities' }
  | { kind: 'utilization-trend' }
  | { kind: 'pace-windows' }
  | { kind: 'mix-trend' }
  | { kind: 'lead-trend' }
  | { kind: 'staffing' }
  | { kind: 'fleet' }
  | { kind: 'seasonal-utilities' }
  | { kind: 'weather-events' }
  | { kind: 'new-repeat' }
  | { kind: 'loyalty' }
  | { kind: 'league' }
  | { kind: 'membership' }
  | { kind: 'maint-labor' }
  | { kind: 'comps' }
  | { kind: 'no-shows' }

export interface WidgetDefinition {
  id: WidgetId
  title: string
  description: string
  category: MetricCategory
  tier: MetricTier
  render: WidgetKind
  sizeTier: SizeTier
}

export const CATEGORIES: { id: MetricCategory; label: string }[] = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'tee-sheet', label: 'Tee sheet' },
  { id: 'fb', label: 'F&B' },
  { id: 'pro-shop', label: 'Pro shop' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'trends', label: 'Trends' },
  { id: 'customers', label: 'Customers' },
  { id: 'properties', label: 'Properties' },
]

export const WIDGET_CATALOG: WidgetDefinition[] = [
  {
    id: 'revenue',
    title: 'Total revenue',
    description: 'Today / WTD / MTD / YTD vs prior and last year',
    category: 'revenue',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'revenue', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'revenue-per-round',
    title: 'Revenue per round',
    description: 'Average dollars captured per round played',
    category: 'revenue',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'revenuePerRound', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'leftover',
    title: 'Unsold tee-time $',
    description: 'Open slots valued at typical fee',
    category: 'revenue',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'leftoverTeeTimeDollars', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'category',
    title: 'Revenue by category',
    description: 'Green fees, carts, shop, F&B, lessons, memberships',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'breakdown', field: 'categories' },
    sizeTier: 'half',
  },
  {
    id: 'segment',
    title: 'Revenue by rate type',
    description: 'Weekday, weekend, twilight, senior, junior, resident',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'breakdown', field: 'segments' },
    sizeTier: 'half',
  },
  {
    id: 'channel-revenue',
    title: 'Revenue by channel',
    description: 'Online, phone, walk-in, third-party',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'breakdown', field: 'channels', format: 'number' },
    sizeTier: 'half',
  },
  {
    id: 'comps',
    title: 'Comps & discounts',
    description: 'Dollars and percent of revenue given away',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'comps' },
    sizeTier: 'md',
  },
  {
    id: 'atv-shop',
    title: 'Avg transaction — shop',
    description: 'Average pro shop ticket',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'kpi', metric: 'avgCheckShop', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'atv-fb',
    title: 'Avg transaction — F&B',
    description: 'Average F&B ticket',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'kpi', metric: 'avgCheckFb', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'rounds',
    title: 'Rounds played',
    description: 'Rounds vs prior period and last year',
    category: 'tee-sheet',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'rounds', format: 'number' },
    sizeTier: 'md',
  },
  {
    id: 'utilization',
    title: 'Tee sheet utilization',
    description: 'Booked slots vs available inventory',
    category: 'tee-sheet',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'utilizationPct', format: 'percent' },
    sizeTier: 'md',
  },
  {
    id: 'util-time-block',
    title: 'Utilization by time block',
    description: 'Morning, midday, twilight fill rate',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'breakdown', field: 'timeBlocks', format: 'percent' },
    sizeTier: 'half',
  },
  {
    id: 'util-dow',
    title: 'Utilization by day of week',
    description: 'Fill rate Monday through Sunday',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'breakdown', field: 'dayOfWeek', format: 'percent' },
    sizeTier: 'half',
  },
  {
    id: 'booking-lead',
    title: 'Booking lead time',
    description: 'How far in advance rounds are booked',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'lead-trend' },
    sizeTier: 'half',
  },
  {
    id: 'booking-pace',
    title: 'Booking pace',
    description: 'Rounds on the books for 7 / 14 / 30 days',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'pace-windows' },
    sizeTier: 'half',
  },
  {
    id: 'tee-heatmap',
    title: 'Peak demand windows',
    description: 'Tee-time popularity by day and hour',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'heatmap' },
    sizeTier: 'full',
  },
  {
    id: 'golfer-type',
    title: 'Rounds by golfer type',
    description: 'Public, member, league, outing',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'breakdown', field: 'golferTypes', format: 'number' },
    sizeTier: 'half',
  },
  {
    id: 'no-shows',
    title: 'No-shows & late cancels',
    description: 'Count and lost green-fee revenue',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'no-shows' },
    sizeTier: 'md',
  },
  {
    id: 'rebooking',
    title: 'Rebooking rate',
    description: 'Golfers who book again within the window',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'kpi', metric: 'rebookingRate', format: 'percent' },
    sizeTier: 'md',
  },
  {
    id: 'booking-mix',
    title: 'Booking mix over time',
    description: 'Online, phone, walk-in, third-party trend',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'mix-trend' },
    sizeTier: 'full',
  },
  {
    id: 'fb-revenue',
    title: 'F&B revenue',
    description: 'Food and beverage sales vs prior',
    category: 'fb',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'fbRevenue', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'fb-attach',
    title: 'F&B attach rate',
    description: 'Share of rounds that generate an F&B sale',
    category: 'fb',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'fbCapturePct', format: 'percent' },
    sizeTier: 'md',
  },
  {
    id: 'fb-top',
    title: 'Top-selling F&B items',
    description: 'Units and dollars',
    category: 'fb',
    tier: 'det',
    render: { kind: 'ranking', field: 'topFbItems' },
    sizeTier: 'half',
  },
  {
    id: 'fb-slow',
    title: 'Slow-moving F&B items',
    description: 'Underperforming menu items',
    category: 'fb',
    tier: 'det',
    render: { kind: 'ranking', field: 'slowFbItems' },
    sizeTier: 'half',
  },
  {
    id: 'fb-category',
    title: 'F&B sales by category',
    description: 'Beverage, snacks, hot food, alcohol',
    category: 'fb',
    tier: 'det',
    render: { kind: 'breakdown', field: 'fbCategories' },
    sizeTier: 'half',
  },
  {
    id: 'avg-check-fb',
    title: 'Average check size',
    description: 'F&B average ticket',
    category: 'fb',
    tier: 'det',
    render: { kind: 'kpi', metric: 'avgCheckFb', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'fb-daypart',
    title: 'F&B by daypart',
    description: 'Breakfast, lunch, turn, 19th hole',
    category: 'fb',
    tier: 'det',
    render: { kind: 'breakdown', field: 'fbDayparts' },
    sizeTier: 'half',
  },
  {
    id: 'food-cost',
    title: 'Food / beverage cost %',
    description: 'COGS as a share of F&B revenue',
    category: 'fb',
    tier: 'det',
    render: { kind: 'kpi', metric: 'foodCostPct', format: 'percent', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'waste',
    title: 'Waste / spoilage',
    description: 'Recorded spoilage dollars',
    category: 'fb',
    tier: 'det',
    render: { kind: 'kpi', metric: 'wasteDollars', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'fb-stock',
    title: 'Low-stock alerts',
    description: 'F&B and shop items at or below par',
    category: 'fb',
    tier: 'det',
    render: { kind: 'ranking', field: 'lowStock' },
    sizeTier: 'half',
  },
  {
    id: 'shop-revenue',
    title: 'Pro shop revenue',
    description: 'Retail sales vs prior period',
    category: 'pro-shop',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'proShopRevenue', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'shop-top',
    title: 'Top-selling shop items',
    description: 'Units and dollars',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'ranking', field: 'topShopItems' },
    sizeTier: 'half',
  },
  {
    id: 'shop-slow',
    title: 'Slow-moving / aged stock',
    description: 'Inventory that is not turning',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'ranking', field: 'slowShopItems' },
    sizeTier: 'half',
  },
  {
    id: 'shop-margin',
    title: 'Margin by category',
    description: 'Apparel, equipment, balls, accessories',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'breakdown', field: 'shopMargins', format: 'percent' },
    sizeTier: 'half',
  },
  {
    id: 'shop-turnover',
    title: 'Inventory turnover',
    description: 'Turns for the period',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'kpi', metric: 'inventoryTurnover', format: 'number' },
    sizeTier: 'md',
  },
  {
    id: 'shrinkage',
    title: 'Shrinkage / variance',
    description: 'Retail variance as a percent of sales',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'kpi', metric: 'shrinkagePct', format: 'percent', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'opex',
    title: 'Operating expenses',
    description: 'Total opex vs budget',
    category: 'expenses',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'opex', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'labor-pct',
    title: 'Labor cost %',
    description: 'Payroll as a share of revenue',
    category: 'expenses',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'laborPct', format: 'percent', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'payroll-dept',
    title: 'Payroll by department',
    description: 'Shop, F&B, grounds, carts, admin',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'breakdown', field: 'payrollDepts' },
    sizeTier: 'half',
  },
  {
    id: 'overtime',
    title: 'Overtime cost',
    description: 'Overtime dollars in the period',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'kpi', metric: 'overtimeCost', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'labor-per-round',
    title: 'Labor cost per round',
    description: 'Payroll dollars per round played',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'kpi', metric: 'laborPerRound', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'staffing',
    title: 'Scheduled vs actual hours',
    description: 'Staffing efficiency by department',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'staffing' },
    sizeTier: 'full',
  },
  {
    id: 'dept-budget',
    title: 'Department cost vs budget',
    description: 'Payroll spend against plan',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'staffing' },
    sizeTier: 'full',
  },
  {
    id: 'utilities',
    title: 'Utility spend',
    description: 'Water, electric, and fuel combined',
    category: 'utilities',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'utilitySpend', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'water',
    title: 'Water / irrigation',
    description: 'Usually the largest utility line',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'kpi', metric: 'waterCost', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'electric',
    title: 'Electricity',
    description: 'Power cost for the period',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'kpi', metric: 'electricCost', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'fuel',
    title: 'Gas / fuel',
    description: 'Carts and equipment fuel',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'kpi', metric: 'fuelCost', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'utility-per-round',
    title: 'Utility cost per round',
    description: 'Spend normalized to course volume',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'kpi', metric: 'utilityPerRound', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'seasonal-util',
    title: 'Seasonal usage',
    description: 'Irrigation and power through the season',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'seasonal-utilities' },
    sizeTier: 'full',
  },
  {
    id: 'maintenance',
    title: 'Maintenance spend',
    description: 'Course and equipment maintenance vs budget',
    category: 'maintenance',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'maintenanceSpend', format: 'money', invert: true },
    sizeTier: 'md',
  },
  {
    id: 'equipment-maint',
    title: 'Equipment maintenance',
    description: 'Mower and fleet repair cost',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'breakdown', field: 'equipmentMaint' },
    sizeTier: 'half',
  },
  {
    id: 'downtime',
    title: 'Equipment downtime',
    description: 'Hours out of service',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'fleet' },
    sizeTier: 'half',
  },
  {
    id: 'fleet',
    title: 'Fleet age & replacement',
    description: 'Assets due for replacement',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'fleet' },
    sizeTier: 'half',
  },
  {
    id: 'maint-area',
    title: 'Spend by course area',
    description: 'Greens, fairways, bunkers, cart paths',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'breakdown', field: 'maintenanceAreas' },
    sizeTier: 'half',
  },
  {
    id: 'chemicals',
    title: 'Fertilizer / chemical / seed',
    description: 'Agronomy spend',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'breakdown', field: 'chemicals' },
    sizeTier: 'half',
  },
  {
    id: 'maint-labor',
    title: 'Maintenance labor vs budget',
    description: 'Hours logged against the plan',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'maint-labor' },
    sizeTier: 'md',
  },
  {
    id: 'weather-events',
    title: 'Weather-related events',
    description: 'Frost delays and storm damage cost',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'weather-events' },
    sizeTier: 'half',
  },
  {
    id: 'yoy-trend',
    title: 'YoY rounds & revenue',
    description: '12-month rolling rounds and revenue',
    category: 'trends',
    tier: 'hl',
    render: { kind: 'yoy' },
    sizeTier: 'full',
  },
  {
    id: 'budget',
    title: 'Budget vs actual',
    description: 'Revenue, rounds, labor, maintenance',
    category: 'trends',
    tier: 'hl',
    render: { kind: 'budget' },
    sizeTier: 'half',
  },
  {
    id: 'ebitda',
    title: 'EBITDA / NOI',
    description: 'Net operating income',
    category: 'trends',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'ebitda', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'gop',
    title: 'GOP',
    description: 'Gross operating profit',
    category: 'trends',
    tier: 'det',
    render: { kind: 'kpi', metric: 'gop', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'weather',
    title: 'Weather-adjusted revenue',
    description: 'Actual vs a clean-weather baseline',
    category: 'trends',
    tier: 'det',
    render: { kind: 'weather' },
    sizeTier: 'full',
  },
  {
    id: 'opportunities',
    title: 'Profit opportunities',
    description: 'Recommended actions with dollar impact',
    category: 'trends',
    tier: 'det',
    render: { kind: 'opportunities' },
    sizeTier: 'full',
  },
  {
    id: 'new-repeat',
    title: 'New vs repeat golfers',
    description: 'Mix of first-time and returning players',
    category: 'customers',
    tier: 'hl',
    render: { kind: 'new-repeat' },
    sizeTier: 'md',
  },
  {
    id: 'loyalty',
    title: 'Loyalty enrollment & redemption',
    description: 'Punch-card and rewards activity',
    category: 'customers',
    tier: 'det',
    render: { kind: 'loyalty' },
    sizeTier: 'md',
  },
  {
    id: 'league',
    title: 'League & outing pipeline',
    description: 'Forward event revenue on the calendar',
    category: 'customers',
    tier: 'det',
    render: { kind: 'league' },
    sizeTier: 'md',
  },
  {
    id: 'membership',
    title: 'Membership renewal',
    description: 'Renewal and new enrollment',
    category: 'customers',
    tier: 'det',
    render: { kind: 'membership' },
    sizeTier: 'md',
  },
  {
    id: 'clv',
    title: 'Spend per golfer',
    description: 'Customer lifetime value',
    category: 'customers',
    tier: 'det',
    render: { kind: 'kpi', metric: 'clv', format: 'money' },
    sizeTier: 'md',
  },
  {
    id: 'comparison',
    title: 'Course comparison',
    description: 'Rounds, revenue, revenue/round, utilization',
    category: 'properties',
    tier: 'hl',
    render: { kind: 'comparison' },
    sizeTier: 'full',
  },
  {
    id: 'course-category',
    title: 'Best / worst by category',
    description: 'F&B, maintenance, and labor % by course',
    category: 'properties',
    tier: 'det',
    render: { kind: 'course-category' },
    sizeTier: 'full',
  },
]

export const DEFAULT_WIDGETS: WidgetId[] = [
  'revenue',
  'rounds',
  'revenue-per-round',
  'utilization',
  'labor-pct',
  'leftover',
  'ebitda',
  'budget',
]

export function defaultLayouts(widgetIds?: WidgetId[]) {
  const ids = widgetIds ?? DEFAULT_WIDGETS
  return packDetailLayouts(ids.filter((id) => widgetById(id)?.tier === 'det'))
}

export function packDetailLayouts(detailIds: WidgetId[]) {
  const lg = packDetailByCategory(detailIds)
  return { lg, md: lg, sm: lg }
}

export function packDetailByCategory(detailIds: WidgetId[]): GridWidgetLayout[] {
  const grouped = groupDetailByCategory(detailIds)
  let y = 0
  const placed: GridWidgetLayout[] = []

  for (const { ids } of grouped) {
    const packed = packWidgets(ids, (id) => widgetById(id)?.sizeTier ?? 'md')
    for (const item of packed) {
      placed.push({ ...item, y: item.y + y })
    }
    if (packed.length > 0) {
      y += Math.max(...packed.map((item) => item.y + item.h))
    }
  }

  return placed
}

export function groupDetailByCategory(detailIds: WidgetId[]) {
  const order = new Map(detailIds.map((id, index) => [id, index]))
  const groups = new Map<MetricCategory, WidgetId[]>()

  for (const id of detailIds) {
    const widget = widgetById(id)
    if (!widget || widget.tier !== 'det') continue
    const list = groups.get(widget.category) ?? []
    list.push(id)
    groups.set(widget.category, list)
  }

  return CATEGORIES.filter((category) => groups.has(category.id)).map((category) => ({
    category: category.id,
    label: category.label,
    ids: (groups.get(category.id) ?? []).sort(
      (a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0),
    ),
  }))
}

export function categoryLabel(category: MetricCategory) {
  return CATEGORIES.find((item) => item.id === category)?.label ?? category
}

export function splitWidgetIds(ids: WidgetId[]) {
  const hl: WidgetId[] = []
  const det: WidgetId[] = []
  for (const id of ids) {
    const widget = widgetById(id)
    if (!widget) continue
    if (widget.tier === 'hl') hl.push(id)
    else det.push(id)
  }
  return { hl, det }
}

export function widgetById(id: string) {
  return WIDGET_CATALOG.find((widget) => widget.id === id)
}

export function isWidgetId(id: string): id is WidgetId {
  return WIDGET_CATALOG.some((widget) => widget.id === id)
}

export function widgetsByCategory(category: MetricCategory) {
  return WIDGET_CATALOG.filter((widget) => widget.category === category)
}
