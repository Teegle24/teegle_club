import { MILL_CREEK, PINE_RIDGE, access } from '@/api/mock/data'
import type {
  BudgetRow,
  ComparedValue,
  CostMargins,
  MetricsBreakdown,
  MetricsPipeline,
  MetricsSummary,
  NamedAmount,
  OpportunityItem,
  PeriodKey,
  PeriodWindow,
  PropertyComparisonRow,
  PropertyScope,
  SalesTrendPoint,
} from '@/types'

const PERIOD_FACTOR: Record<PeriodKey, number> = {
  today: 0.038,
  wtd: 0.24,
  mtd: 1,
  ytd: 7.35,
}

interface Outlet {
  id: string
  name: string
  amount: number
  marginPct: number
}

interface Baseline {
  propertyId: string
  name: string
  revenue: number
  rounds: number
  availableTeeTimes: number
  bookedTeeTimes: number
  ebitda: number
  gop: number
  laborCost: number
  comps: number
  avgGreenFee: number
  unsoldTeeTimes: number
  fbCapturePct: number
  cartAttachPct: number
  priorPeriodRatio: number
  priorYearRatio: number
  budgetRatio: number
  categories: Record<string, number>
  segments: Record<string, number>
  channels: Record<string, number>
  outlets: Outlet[]
  proShopMarginPct: number
  fbMarginPct: number
  maintenanceSpend: number
  capexSpend: number
  newGolferPct: number
  membershipEnrollmentPct: number
  membershipRenewalPct: number
  leagueOutingRevenue: number
  advanceRounds: number
  advanceRevenue: number
}

const PINE: Baseline = {
  propertyId: PINE_RIDGE,
  name: 'Pine Ridge Golf Club',
  revenue: 842_150,
  rounds: 4_120,
  availableTeeTimes: 5_200,
  bookedTeeTimes: 4_120,
  ebitda: 268_400,
  gop: 312_400,
  laborCost: 198_600,
  comps: 18_540,
  avgGreenFee: 185,
  unsoldTeeTimes: 1_080,
  fbCapturePct: 54,
  cartAttachPct: 41,
  priorPeriodRatio: 0.96,
  priorYearRatio: 0.91,
  budgetRatio: 1.04,
  categories: {
    greenFees: 310_000,
    carts: 98_000,
    proShop: 72_000,
    clubhouse: 185_000,
    beverageCart: 64_000,
    halfway: 28_000,
    bar: 42_000,
    lessons: 31_000,
    memberships: 12_150,
  },
  segments: {
    weekday: 268_000,
    weekend: 312_000,
    twilight: 94_000,
    member: 198_000,
    public: 241_000,
    outings: 109_150,
  },
  channels: {
    online: 2_180,
    phone: 1_240,
    walkIn: 700,
  },
  outlets: [
    { id: 'clubhouse', name: 'Clubhouse restaurant', amount: 185_000, marginPct: 22 },
    { id: 'cart', name: 'Beverage cart', amount: 64_000, marginPct: 58 },
    { id: 'halfway', name: 'Halfway house', amount: 28_000, marginPct: 41 },
    { id: 'bar', name: 'Bar / lounge', amount: 42_000, marginPct: 62 },
    { id: 'green', name: 'Green fees', amount: 310_000, marginPct: 78 },
    { id: 'golf-cart', name: 'Cart rentals', amount: 98_000, marginPct: 71 },
    { id: 'shop', name: 'Pro shop', amount: 72_000, marginPct: 34 },
  ],
  proShopMarginPct: 34,
  fbMarginPct: 38,
  maintenanceSpend: 46_200,
  capexSpend: 22_000,
  newGolferPct: 29,
  membershipEnrollmentPct: 4.2,
  membershipRenewalPct: 86,
  leagueOutingRevenue: 109_150,
  advanceRounds: 640,
  advanceRevenue: 118_000,
}

const MILL: Baseline = {
  propertyId: MILL_CREEK,
  name: 'Mill Creek Country Club',
  revenue: 511_980,
  rounds: 2_680,
  availableTeeTimes: 3_600,
  bookedTeeTimes: 2_680,
  ebitda: 141_800,
  gop: 187_250,
  laborCost: 141_200,
  comps: 14_840,
  avgGreenFee: 145,
  unsoldTeeTimes: 920,
  fbCapturePct: 61,
  cartAttachPct: 52,
  priorPeriodRatio: 0.98,
  priorYearRatio: 1.06,
  budgetRatio: 0.97,
  categories: {
    greenFees: 178_000,
    carts: 64_000,
    proShop: 41_000,
    clubhouse: 112_000,
    beverageCart: 48_000,
    halfway: 18_000,
    bar: 22_000,
    lessons: 16_000,
    memberships: 12_980,
  },
  segments: {
    weekday: 154_000,
    weekend: 198_000,
    twilight: 52_000,
    member: 168_000,
    public: 142_000,
    outings: 51_980,
  },
  channels: {
    online: 1_210,
    phone: 890,
    walkIn: 580,
  },
  outlets: [
    { id: 'clubhouse', name: 'Clubhouse restaurant', amount: 112_000, marginPct: 18 },
    { id: 'cart', name: 'Beverage cart', amount: 48_000, marginPct: 61 },
    { id: 'halfway', name: 'Halfway house', amount: 18_000, marginPct: 44 },
    { id: 'bar', name: 'Bar / lounge', amount: 22_000, marginPct: 64 },
    { id: 'green', name: 'Green fees', amount: 178_000, marginPct: 76 },
    { id: 'golf-cart', name: 'Cart rentals', amount: 64_000, marginPct: 70 },
    { id: 'shop', name: 'Pro shop', amount: 41_000, marginPct: 31 },
  ],
  proShopMarginPct: 31,
  fbMarginPct: 36,
  maintenanceSpend: 38_400,
  capexSpend: 61_000,
  newGolferPct: 22,
  membershipEnrollmentPct: 2.8,
  membershipRenewalPct: 91,
  leagueOutingRevenue: 51_980,
  advanceRounds: 410,
  advanceRevenue: 72_400,
}

const BY_ID: Record<string, Baseline> = {
  [PINE_RIDGE]: PINE,
  [MILL_CREEK]: MILL,
}

const CATEGORY_LABELS: Record<string, string> = {
  greenFees: 'Green fees',
  carts: 'Cart rentals',
  proShop: 'Pro shop',
  clubhouse: 'Clubhouse restaurant',
  beverageCart: 'Beverage cart',
  halfway: 'Halfway house',
  bar: 'Bar / lounge',
  lessons: 'Lessons',
  memberships: 'Memberships',
}

const SEGMENT_LABELS: Record<string, string> = {
  weekday: 'Weekday',
  weekend: 'Weekend',
  twilight: 'Twilight',
  member: 'Member',
  public: 'Public',
  outings: 'Outings',
}

const CHANNEL_LABELS: Record<string, string> = {
  online: 'Online',
  phone: 'Phone',
  walkIn: 'Walk-in',
}

function daysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

function windowFor(period: PeriodKey): PeriodWindow {
  if (period === 'today') return { key: period, from: daysAgo(0), to: daysAgo(0) }
  if (period === 'wtd') return { key: period, from: daysAgo(6), to: daysAgo(0) }
  if (period === 'ytd') return { key: period, from: daysAgo(220), to: daysAgo(0) }
  return { key: period, from: daysAgo(29), to: daysAgo(0) }
}

function scale(value: number, period: PeriodKey) {
  return Math.round(value * PERIOD_FACTOR[period])
}

function scalePct(_value: number) {
  return _value
}

function compared(
  current: number,
  priorPeriodRatio: number,
  priorYearRatio: number,
): ComparedValue {
  return {
    current,
    priorPeriod: Math.round(current * priorPeriodRatio),
    priorYear: Math.round(current * priorYearRatio),
  }
}

export function idsFor(scope?: PropertyScope) {
  if (!scope || scope.type === 'rollup') {
    return access.properties.map((property) => property.id)
  }
  return [scope.propertyId]
}

function baselines(scope?: PropertyScope) {
  return idsFor(scope)
    .map((id) => BY_ID[id])
    .filter((row): row is Baseline => Boolean(row))
}

function mergeBaselines(rows: Baseline[]): Baseline {
  if (rows.length === 1) return rows[0]
  const first = rows[0]
  const sum = (pick: (row: Baseline) => number) =>
    rows.reduce((total, row) => total + pick(row), 0)
  const avg = (pick: (row: Baseline) => number) => sum(pick) / rows.length
  const mergeMap = (pick: (row: Baseline) => Record<string, number>) => {
    const out: Record<string, number> = {}
    for (const row of rows) {
      for (const [key, value] of Object.entries(pick(row))) {
        out[key] = (out[key] ?? 0) + value
      }
    }
    return out
  }
  const outletMap = new Map<string, Outlet>()
  for (const row of rows) {
    for (const outlet of row.outlets) {
      const existing = outletMap.get(outlet.id)
      if (!existing) {
        outletMap.set(outlet.id, { ...outlet })
      } else {
        const total = existing.amount + outlet.amount
        existing.marginPct =
          (existing.marginPct * existing.amount + outlet.marginPct * outlet.amount) /
          total
        existing.amount = total
      }
    }
  }

  return {
    ...first,
    propertyId: 'rollup',
    name: 'All linked properties',
    revenue: sum((row) => row.revenue),
    rounds: sum((row) => row.rounds),
    availableTeeTimes: sum((row) => row.availableTeeTimes),
    bookedTeeTimes: sum((row) => row.bookedTeeTimes),
    ebitda: sum((row) => row.ebitda),
    gop: sum((row) => row.gop),
    laborCost: sum((row) => row.laborCost),
    comps: sum((row) => row.comps),
    avgGreenFee: avg((row) => row.avgGreenFee),
    unsoldTeeTimes: sum((row) => row.unsoldTeeTimes),
    fbCapturePct: avg((row) => row.fbCapturePct),
    cartAttachPct: avg((row) => row.cartAttachPct),
    priorPeriodRatio: avg((row) => row.priorPeriodRatio),
    priorYearRatio: avg((row) => row.priorYearRatio),
    budgetRatio: avg((row) => row.budgetRatio),
    categories: mergeMap((row) => row.categories),
    segments: mergeMap((row) => row.segments),
    channels: mergeMap((row) => row.channels),
    outlets: [...outletMap.values()],
    proShopMarginPct: avg((row) => row.proShopMarginPct),
    fbMarginPct: avg((row) => row.fbMarginPct),
    maintenanceSpend: sum((row) => row.maintenanceSpend),
    capexSpend: sum((row) => row.capexSpend),
    newGolferPct: avg((row) => row.newGolferPct),
    membershipEnrollmentPct: avg((row) => row.membershipEnrollmentPct),
    membershipRenewalPct: avg((row) => row.membershipRenewalPct),
    leagueOutingRevenue: sum((row) => row.leagueOutingRevenue),
    advanceRounds: sum((row) => row.advanceRounds),
    advanceRevenue: sum((row) => row.advanceRevenue),
  }
}

function activeBaseline(scope?: PropertyScope) {
  const rows = baselines(scope)
  if (rows.length === 0) return PINE
  return mergeBaselines(rows)
}

function namedFrom(
  record: Record<string, number>,
  labels: Record<string, string>,
  period: PeriodKey,
  asRounds = false,
): NamedAmount[] {
  const scaled = Object.entries(record).map(([id, amount]) => ({
    id,
    name: labels[id] ?? id,
    amount: asRounds ? scale(amount, period) : scale(amount, period),
  }))
  const total = scaled.reduce((sum, item) => sum + item.amount, 0) || 1
  return scaled.map((item) => ({
    ...item,
    sharePct: (item.amount / total) * 100,
  }))
}

export function summaryFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
): MetricsSummary {
  const row = activeBaseline(scope)
  const revenue = scale(row.revenue, period)
  const rounds = scale(row.rounds, period)
  const labor = scale(row.laborCost, period)
  const leftover = scale(row.unsoldTeeTimes * row.avgGreenFee, period)
  const utilization = (row.bookedTeeTimes / row.availableTeeTimes) * 100

  return {
    propertyId: scope?.type === 'property' ? scope.propertyId : null,
    period: windowFor(period),
    currency: 'USD',
    revenue: compared(revenue, row.priorPeriodRatio, row.priorYearRatio),
    rounds: compared(rounds, row.priorPeriodRatio + 0.01, row.priorYearRatio),
    revenuePerRound: compared(
      rounds ? Math.round(revenue / rounds) : 0,
      row.priorPeriodRatio,
      row.priorYearRatio + 0.02,
    ),
    utilizationPct: compared(
      utilization,
      row.priorPeriodRatio + 0.02,
      row.priorYearRatio,
    ),
    ebitda: compared(scale(row.ebitda, period), row.priorPeriodRatio, row.priorYearRatio),
    gop: compared(scale(row.gop, period), row.priorPeriodRatio, row.priorYearRatio),
    laborCost: compared(labor, row.priorPeriodRatio - 0.01, row.priorYearRatio),
    laborPct: compared(
      revenue ? (labor / revenue) * 100 : 0,
      1.03,
      1.05,
    ),
    compsPct: compared((row.comps / row.revenue) * 100, 0.92, 0.88),
    leftoverTeeTimeDollars: compared(leftover, 1.08, 1.12),
    fbCapturePct: compared(scalePct(row.fbCapturePct), 0.97, 0.94),
    cartAttachPct: compared(scalePct(row.cartAttachPct), 0.95, 0.9),
  }
}

export function breakdownFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
): MetricsBreakdown {
  const row = activeBaseline(scope)
  const total = scale(row.revenue, period) || 1
  return {
    categories: namedFrom(row.categories, CATEGORY_LABELS, period).map((item) => ({
      ...item,
      sharePct: (item.amount / total) * 100,
    })),
    segments: namedFrom(row.segments, SEGMENT_LABELS, period),
    channels: namedFrom(row.channels, CHANNEL_LABELS, period, true),
    outlets: row.outlets.map((outlet) => ({
      id: outlet.id,
      name: outlet.name,
      amount: scale(outlet.amount, period),
      marginPct: outlet.marginPct,
      sharePct: (scale(outlet.amount, period) / total) * 100,
    })),
  }
}

export function budgetFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
): BudgetRow[] {
  const row = activeBaseline(scope)
  const revenue = scale(row.revenue, period)
  const rounds = scale(row.rounds, period)
  const labor = scale(row.laborCost, period)
  return [
    {
      metric: 'revenue',
      label: 'Revenue',
      actual: revenue,
      budget: Math.round(revenue / row.budgetRatio),
    },
    {
      metric: 'rounds',
      label: 'Rounds',
      actual: rounds,
      budget: Math.round(rounds / (row.budgetRatio - 0.02)),
    },
    {
      metric: 'labor',
      label: 'Labor',
      actual: labor,
      budget: Math.round(labor / 1.06),
    },
  ]
}

export function comparisonFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
): PropertyComparisonRow[] {
  return baselines(scope).map((row) => {
    const revenue = scale(row.revenue, period)
    const rounds = scale(row.rounds, period)
    return {
      propertyId: row.propertyId,
      propertyName: row.name,
      rounds,
      revenue,
      revenuePerRound: rounds ? Math.round(revenue / rounds) : 0,
      utilizationPct: (row.bookedTeeTimes / row.availableTeeTimes) * 100,
    }
  })
}

export function pipelineFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
): MetricsPipeline {
  const row = activeBaseline(scope)
  return {
    advanceRounds: scale(row.advanceRounds, period === 'today' ? 'wtd' : period),
    advanceRevenue: scale(row.advanceRevenue, period === 'today' ? 'wtd' : period),
    leagueOutingRevenue: scale(row.leagueOutingRevenue, period),
    membershipEnrollmentPct: row.membershipEnrollmentPct,
    membershipRenewalPct: row.membershipRenewalPct,
    newGolferPct: row.newGolferPct,
    repeatGolferPct: 100 - row.newGolferPct,
  }
}

export function costsFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
): CostMargins {
  const row = activeBaseline(scope)
  const revenue = scale(row.revenue, period)
  const labor = scale(row.laborCost, period)
  return {
    laborCost: labor,
    laborPct: revenue ? (labor / revenue) * 100 : 0,
    proShopMarginPct: row.proShopMarginPct,
    fbMarginPct: row.fbMarginPct,
    maintenanceSpend: scale(row.maintenanceSpend, period),
    capexSpend: scale(row.capexSpend, period),
  }
}

export function opportunitiesFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
): OpportunityItem[] {
  const row = activeBaseline(scope)
  const leftover = scale(row.unsoldTeeTimes * row.avgGreenFee, period)
  const cartGap = Math.max(0, 60 - row.cartAttachPct) / 100
  const cartMiss = Math.round(scale(row.rounds, period) * cartGap * 18)
  const laborTarget = 0.28
  const laborNow = row.laborCost / row.revenue
  const laborMiss = Math.max(0, laborNow - laborTarget) * scale(row.revenue, period)

  return [
    {
      id: 'unsold',
      title: 'Unsold tee times',
      detail: `${scale(row.unsoldTeeTimes, period).toLocaleString()} open slots × typical fee`,
      impactDollars: leftover,
    },
    {
      id: 'cart',
      title: 'Beverage cart attach below 60%',
      detail: `At ${row.cartAttachPct.toFixed(0)}% of rounds vs a 60% target`,
      impactDollars: cartMiss,
    },
    {
      id: 'labor',
      title: 'Labor above 28% of revenue',
      detail: 'Mostly clubhouse dining coverage on shoulder weekdays',
      impactDollars: Math.round(laborMiss),
    },
  ].filter((item) => item.impactDollars > 0)
    .sort((a, b) => b.impactDollars - a.impactDollars)
}

export function trendFor(scope?: PropertyScope): SalesTrendPoint[] {
  const row = activeBaseline(scope)
  return Array.from({ length: 12 }, (_, index) => {
    const month = 11 - index
    const swing = 1 + Math.sin(index * 0.55) * 0.11
    const weatherHit = index === 8 || index === 3 ? 0.86 : 1
    const revenue = Math.round((row.revenue / 1.15) * swing * weatherHit)
    const rounds = Math.round((row.rounds / 1.15) * swing * weatherHit)
    return {
      date: daysAgo(month * 30 + 14),
      revenue,
      rounds,
      utilizationPct:
        (row.bookedTeeTimes / row.availableTeeTimes) * 100 * (0.92 + index * 0.008),
      weatherAdjustedRevenue: Math.round(revenue / weatherHit),
    }
  })
}
