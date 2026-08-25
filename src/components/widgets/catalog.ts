import type {
  ComparedMetricKey,
  GridWidgetLayout,
  MetricCategory,
  MetricTier,
  MetricsBreakdown,
  OpsMetrics,
} from '@/types'

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
  default: GridWidgetLayout
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

function kpi(id: WidgetId, x = 0, y = 0): GridWidgetLayout {
  return { i: id, x, y, w: 3, h: 5, minW: 2, minH: 4 }
}

function chart(id: WidgetId): GridWidgetLayout {
  return { i: id, x: 0, y: 0, w: 6, h: 8, minW: 4, minH: 6 }
}

function wide(id: WidgetId): GridWidgetLayout {
  return { i: id, x: 0, y: 0, w: 8, h: 9, minW: 5, minH: 7 }
}

export const WIDGET_CATALOG: WidgetDefinition[] = [
  {
    id: 'revenue',
    title: 'Total revenue',
    description: 'Today / WTD / MTD / YTD vs prior and last year',
    category: 'revenue',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'revenue', format: 'money' },
    default: kpi('revenue', 0, 0),
  },
  {
    id: 'revenue-per-round',
    title: 'Revenue per round',
    description: 'Average dollars captured per round played',
    category: 'revenue',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'revenuePerRound', format: 'money' },
    default: kpi('revenue-per-round', 6, 0),
  },
  {
    id: 'leftover',
    title: 'Unsold tee-time $',
    description: 'Open slots valued at typical fee',
    category: 'revenue',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'leftoverTeeTimeDollars', format: 'money', invert: true },
    default: { i: 'leftover', x: 4, y: 5, w: 4, h: 5, minW: 2, minH: 4 },
  },
  {
    id: 'category',
    title: 'Revenue by category',
    description: 'Green fees, carts, shop, F&B, lessons, memberships',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'breakdown', field: 'categories' },
    default: chart('category'),
  },
  {
    id: 'segment',
    title: 'Revenue by rate type',
    description: 'Weekday, weekend, twilight, senior, junior, resident',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'breakdown', field: 'segments' },
    default: chart('segment'),
  },
  {
    id: 'channel-revenue',
    title: 'Revenue by channel',
    description: 'Online, phone, walk-in, third-party',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'breakdown', field: 'channels', format: 'number' },
    default: chart('channel-revenue'),
  },
  {
    id: 'comps',
    title: 'Comps & discounts',
    description: 'Dollars and percent of revenue given away',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'comps' },
    default: kpi('comps'),
  },
  {
    id: 'atv-shop',
    title: 'Avg transaction — shop',
    description: 'Average pro shop ticket',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'kpi', metric: 'avgCheckShop', format: 'money' },
    default: kpi('atv-shop'),
  },
  {
    id: 'atv-fb',
    title: 'Avg transaction — F&B',
    description: 'Average F&B ticket',
    category: 'revenue',
    tier: 'det',
    render: { kind: 'kpi', metric: 'avgCheckFb', format: 'money' },
    default: kpi('atv-fb'),
  },
  {
    id: 'rounds',
    title: 'Rounds played',
    description: 'Rounds vs prior period and last year',
    category: 'tee-sheet',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'rounds', format: 'number' },
    default: kpi('rounds', 3, 0),
  },
  {
    id: 'utilization',
    title: 'Tee sheet utilization',
    description: 'Booked slots vs available inventory',
    category: 'tee-sheet',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'utilizationPct', format: 'percent' },
    default: kpi('utilization', 9, 0),
  },
  {
    id: 'util-time-block',
    title: 'Utilization by time block',
    description: 'Morning, midday, twilight fill rate',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'breakdown', field: 'timeBlocks', format: 'percent' },
    default: chart('util-time-block'),
  },
  {
    id: 'util-dow',
    title: 'Utilization by day of week',
    description: 'Fill rate Monday through Sunday',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'breakdown', field: 'dayOfWeek', format: 'percent' },
    default: chart('util-dow'),
  },
  {
    id: 'booking-lead',
    title: 'Booking lead time',
    description: 'How far in advance rounds are booked',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'lead-trend' },
    default: chart('booking-lead'),
  },
  {
    id: 'booking-pace',
    title: 'Booking pace',
    description: 'Rounds on the books for 7 / 14 / 30 days',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'pace-windows' },
    default: chart('booking-pace'),
  },
  {
    id: 'tee-heatmap',
    title: 'Peak demand windows',
    description: 'Tee-time popularity by day and hour',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'heatmap' },
    default: wide('tee-heatmap'),
  },
  {
    id: 'golfer-type',
    title: 'Rounds by golfer type',
    description: 'Public, member, league, outing',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'breakdown', field: 'golferTypes', format: 'number' },
    default: chart('golfer-type'),
  },
  {
    id: 'no-shows',
    title: 'No-shows & late cancels',
    description: 'Count and lost green-fee revenue',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'no-shows' },
    default: kpi('no-shows'),
  },
  {
    id: 'rebooking',
    title: 'Rebooking rate',
    description: 'Golfers who book again within the window',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'kpi', metric: 'rebookingRate', format: 'percent' },
    default: kpi('rebooking'),
  },
  {
    id: 'booking-mix',
    title: 'Booking mix over time',
    description: 'Online, phone, walk-in, third-party trend',
    category: 'tee-sheet',
    tier: 'det',
    render: { kind: 'mix-trend' },
    default: wide('booking-mix'),
  },
  {
    id: 'fb-revenue',
    title: 'F&B revenue',
    description: 'Food and beverage sales vs prior',
    category: 'fb',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'fbRevenue', format: 'money' },
    default: kpi('fb-revenue'),
  },
  {
    id: 'fb-attach',
    title: 'F&B attach rate',
    description: 'Share of rounds that generate an F&B sale',
    category: 'fb',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'fbCapturePct', format: 'percent' },
    default: kpi('fb-attach'),
  },
  {
    id: 'fb-top',
    title: 'Top-selling F&B items',
    description: 'Units and dollars',
    category: 'fb',
    tier: 'det',
    render: { kind: 'ranking', field: 'topFbItems' },
    default: chart('fb-top'),
  },
  {
    id: 'fb-slow',
    title: 'Slow-moving F&B items',
    description: 'Underperforming menu items',
    category: 'fb',
    tier: 'det',
    render: { kind: 'ranking', field: 'slowFbItems' },
    default: chart('fb-slow'),
  },
  {
    id: 'fb-category',
    title: 'F&B sales by category',
    description: 'Beverage, snacks, hot food, alcohol',
    category: 'fb',
    tier: 'det',
    render: { kind: 'breakdown', field: 'fbCategories' },
    default: chart('fb-category'),
  },
  {
    id: 'avg-check-fb',
    title: 'Average check size',
    description: 'F&B average ticket',
    category: 'fb',
    tier: 'det',
    render: { kind: 'kpi', metric: 'avgCheckFb', format: 'money' },
    default: kpi('avg-check-fb'),
  },
  {
    id: 'fb-daypart',
    title: 'F&B by daypart',
    description: 'Breakfast, lunch, turn, 19th hole',
    category: 'fb',
    tier: 'det',
    render: { kind: 'breakdown', field: 'fbDayparts' },
    default: chart('fb-daypart'),
  },
  {
    id: 'food-cost',
    title: 'Food / beverage cost %',
    description: 'COGS as a share of F&B revenue',
    category: 'fb',
    tier: 'det',
    render: { kind: 'kpi', metric: 'foodCostPct', format: 'percent', invert: true },
    default: kpi('food-cost'),
  },
  {
    id: 'waste',
    title: 'Waste / spoilage',
    description: 'Recorded spoilage dollars',
    category: 'fb',
    tier: 'det',
    render: { kind: 'kpi', metric: 'wasteDollars', format: 'money', invert: true },
    default: kpi('waste'),
  },
  {
    id: 'fb-stock',
    title: 'Low-stock alerts',
    description: 'F&B and shop items at or below par',
    category: 'fb',
    tier: 'det',
    render: { kind: 'ranking', field: 'lowStock' },
    default: chart('fb-stock'),
  },
  {
    id: 'shop-revenue',
    title: 'Pro shop revenue',
    description: 'Retail sales vs prior period',
    category: 'pro-shop',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'proShopRevenue', format: 'money' },
    default: kpi('shop-revenue'),
  },
  {
    id: 'shop-top',
    title: 'Top-selling shop items',
    description: 'Units and dollars',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'ranking', field: 'topShopItems' },
    default: chart('shop-top'),
  },
  {
    id: 'shop-slow',
    title: 'Slow-moving / aged stock',
    description: 'Inventory that is not turning',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'ranking', field: 'slowShopItems' },
    default: chart('shop-slow'),
  },
  {
    id: 'shop-margin',
    title: 'Margin by category',
    description: 'Apparel, equipment, balls, accessories',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'breakdown', field: 'shopMargins', format: 'percent' },
    default: chart('shop-margin'),
  },
  {
    id: 'shop-turnover',
    title: 'Inventory turnover',
    description: 'Turns for the period',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'kpi', metric: 'inventoryTurnover', format: 'number' },
    default: kpi('shop-turnover'),
  },
  {
    id: 'shrinkage',
    title: 'Shrinkage / variance',
    description: 'Retail variance as a percent of sales',
    category: 'pro-shop',
    tier: 'det',
    render: { kind: 'kpi', metric: 'shrinkagePct', format: 'percent', invert: true },
    default: kpi('shrinkage'),
  },
  {
    id: 'opex',
    title: 'Operating expenses',
    description: 'Total opex vs budget',
    category: 'expenses',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'opex', format: 'money', invert: true },
    default: kpi('opex'),
  },
  {
    id: 'labor-pct',
    title: 'Labor cost %',
    description: 'Payroll as a share of revenue',
    category: 'expenses',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'laborPct', format: 'percent', invert: true },
    default: { i: 'labor-pct', x: 0, y: 5, w: 4, h: 5, minW: 2, minH: 4 },
  },
  {
    id: 'payroll-dept',
    title: 'Payroll by department',
    description: 'Shop, F&B, grounds, carts, admin',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'breakdown', field: 'payrollDepts' },
    default: chart('payroll-dept'),
  },
  {
    id: 'overtime',
    title: 'Overtime cost',
    description: 'Overtime dollars in the period',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'kpi', metric: 'overtimeCost', format: 'money', invert: true },
    default: kpi('overtime'),
  },
  {
    id: 'labor-per-round',
    title: 'Labor cost per round',
    description: 'Payroll dollars per round played',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'kpi', metric: 'laborPerRound', format: 'money', invert: true },
    default: kpi('labor-per-round'),
  },
  {
    id: 'staffing',
    title: 'Scheduled vs actual hours',
    description: 'Staffing efficiency by department',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'staffing' },
    default: wide('staffing'),
  },
  {
    id: 'dept-budget',
    title: 'Department cost vs budget',
    description: 'Payroll spend against plan',
    category: 'expenses',
    tier: 'det',
    render: { kind: 'staffing' },
    default: wide('dept-budget'),
  },
  {
    id: 'utilities',
    title: 'Utility spend',
    description: 'Water, electric, and fuel combined',
    category: 'utilities',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'utilitySpend', format: 'money', invert: true },
    default: kpi('utilities'),
  },
  {
    id: 'water',
    title: 'Water / irrigation',
    description: 'Usually the largest utility line',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'kpi', metric: 'waterCost', format: 'money', invert: true },
    default: kpi('water'),
  },
  {
    id: 'electric',
    title: 'Electricity',
    description: 'Power cost for the period',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'kpi', metric: 'electricCost', format: 'money', invert: true },
    default: kpi('electric'),
  },
  {
    id: 'fuel',
    title: 'Gas / fuel',
    description: 'Carts and equipment fuel',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'kpi', metric: 'fuelCost', format: 'money', invert: true },
    default: kpi('fuel'),
  },
  {
    id: 'utility-per-round',
    title: 'Utility cost per round',
    description: 'Spend normalized to course volume',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'kpi', metric: 'utilityPerRound', format: 'money', invert: true },
    default: kpi('utility-per-round'),
  },
  {
    id: 'seasonal-util',
    title: 'Seasonal usage',
    description: 'Irrigation and power through the season',
    category: 'utilities',
    tier: 'det',
    render: { kind: 'seasonal-utilities' },
    default: wide('seasonal-util'),
  },
  {
    id: 'maintenance',
    title: 'Maintenance spend',
    description: 'Course and equipment maintenance vs budget',
    category: 'maintenance',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'maintenanceSpend', format: 'money', invert: true },
    default: kpi('maintenance'),
  },
  {
    id: 'equipment-maint',
    title: 'Equipment maintenance',
    description: 'Mower and fleet repair cost',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'breakdown', field: 'equipmentMaint' },
    default: chart('equipment-maint'),
  },
  {
    id: 'downtime',
    title: 'Equipment downtime',
    description: 'Hours out of service',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'fleet' },
    default: chart('downtime'),
  },
  {
    id: 'fleet',
    title: 'Fleet age & replacement',
    description: 'Assets due for replacement',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'fleet' },
    default: chart('fleet'),
  },
  {
    id: 'maint-area',
    title: 'Spend by course area',
    description: 'Greens, fairways, bunkers, cart paths',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'breakdown', field: 'maintenanceAreas' },
    default: chart('maint-area'),
  },
  {
    id: 'chemicals',
    title: 'Fertilizer / chemical / seed',
    description: 'Agronomy spend',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'breakdown', field: 'chemicals' },
    default: chart('chemicals'),
  },
  {
    id: 'maint-labor',
    title: 'Maintenance labor vs budget',
    description: 'Hours logged against the plan',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'maint-labor' },
    default: kpi('maint-labor'),
  },
  {
    id: 'weather-events',
    title: 'Weather-related events',
    description: 'Frost delays and storm damage cost',
    category: 'maintenance',
    tier: 'det',
    render: { kind: 'weather-events' },
    default: chart('weather-events'),
  },
  {
    id: 'yoy-trend',
    title: 'YoY rounds & revenue',
    description: '12-month rolling rounds and revenue',
    category: 'trends',
    tier: 'hl',
    render: { kind: 'yoy' },
    default: wide('yoy-trend'),
  },
  {
    id: 'budget',
    title: 'Budget vs actual',
    description: 'Revenue, rounds, labor, maintenance',
    category: 'trends',
    tier: 'hl',
    render: { kind: 'budget' },
    default: { i: 'budget', x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 6 },
  },
  {
    id: 'ebitda',
    title: 'EBITDA / NOI',
    description: 'Net operating income',
    category: 'trends',
    tier: 'hl',
    render: { kind: 'kpi', metric: 'ebitda', format: 'money' },
    default: { i: 'ebitda', x: 8, y: 5, w: 4, h: 5, minW: 2, minH: 4 },
  },
  {
    id: 'gop',
    title: 'GOP',
    description: 'Gross operating profit',
    category: 'trends',
    tier: 'det',
    render: { kind: 'kpi', metric: 'gop', format: 'money' },
    default: kpi('gop'),
  },
  {
    id: 'weather',
    title: 'Weather-adjusted revenue',
    description: 'Actual vs a clean-weather baseline',
    category: 'trends',
    tier: 'det',
    render: { kind: 'weather' },
    default: wide('weather'),
  },
  {
    id: 'opportunities',
    title: 'Profit opportunities',
    description: 'Recommended actions with dollar impact',
    category: 'trends',
    tier: 'det',
    render: { kind: 'opportunities' },
    default: wide('opportunities'),
  },
  {
    id: 'new-repeat',
    title: 'New vs repeat golfers',
    description: 'Mix of first-time and returning players',
    category: 'customers',
    tier: 'hl',
    render: { kind: 'new-repeat' },
    default: kpi('new-repeat'),
  },
  {
    id: 'loyalty',
    title: 'Loyalty enrollment & redemption',
    description: 'Punch-card and rewards activity',
    category: 'customers',
    tier: 'det',
    render: { kind: 'loyalty' },
    default: kpi('loyalty'),
  },
  {
    id: 'league',
    title: 'League & outing pipeline',
    description: 'Forward event revenue on the calendar',
    category: 'customers',
    tier: 'det',
    render: { kind: 'league' },
    default: kpi('league'),
  },
  {
    id: 'membership',
    title: 'Membership renewal',
    description: 'Renewal and new enrollment',
    category: 'customers',
    tier: 'det',
    render: { kind: 'membership' },
    default: kpi('membership'),
  },
  {
    id: 'clv',
    title: 'Spend per golfer',
    description: 'Customer lifetime value',
    category: 'customers',
    tier: 'det',
    render: { kind: 'kpi', metric: 'clv', format: 'money' },
    default: kpi('clv'),
  },
  {
    id: 'comparison',
    title: 'Course comparison',
    description: 'Rounds, revenue, revenue/round, utilization',
    category: 'properties',
    tier: 'hl',
    render: { kind: 'comparison' },
    default: wide('comparison'),
  },
  {
    id: 'course-category',
    title: 'Best / worst by category',
    description: 'F&B, maintenance, and labor % by course',
    category: 'properties',
    tier: 'det',
    render: { kind: 'course-category' },
    default: wide('course-category'),
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
  const lg = WIDGET_CATALOG.filter((widget) => ids.includes(widget.id)).map(
    (widget) => widget.default,
  )
  return { lg, md: lg, sm: lg }
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
