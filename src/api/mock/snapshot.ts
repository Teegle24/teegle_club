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
  OpsMetrics,
  PeriodKey,
  PeriodWindow,
  PropertyComparisonRow,
  PropertyScope,
  RankedItem,
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
  golferTypes: Record<string, number>
  timeBlocks: Record<string, number>
  dayOfWeek: Record<string, number>
  fbCategories: Record<string, number>
  fbDayparts: Record<string, number>
  shopMargins: Record<string, number>
  payrollDepts: Record<string, number>
  utilities: Record<string, number>
  maintenanceAreas: Record<string, number>
  chemicals: Record<string, number>
  equipmentMaint: Record<string, number>
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
  avgCheckFb: number
  avgCheckShop: number
  opex: number
  overtimeCost: number
  waterCost: number
  electricCost: number
  fuelCost: number
  foodCostPct: number
  wasteDollars: number
  inventoryTurnover: number
  shrinkagePct: number
  noShowCount: number
  rebookingRate: number
  bookingLeadDays: number
  loyaltyEnrollmentPct: number
  loyaltyRedemptionPct: number
  clv: number
  maintLaborHours: number
  maintLaborBudgetHours: number
  downtimeHours: number
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
    fb: 319_000,
    lessons: 31_000,
    memberships: 12_150,
  },
  segments: {
    weekday: 268_000,
    weekend: 312_000,
    twilight: 94_000,
    senior: 62_000,
    junior: 18_000,
    resident: 54_150,
    nonResident: 34_000,
  },
  channels: {
    online: 1_860,
    phone: 1_040,
    walkIn: 700,
    thirdParty: 520,
  },
  golferTypes: {
    public: 1_980,
    member: 1_420,
    league: 410,
    outing: 310,
  },
  timeBlocks: {
    morning: 86,
    midday: 74,
    twilight: 58,
  },
  dayOfWeek: {
    mon: 62,
    tue: 68,
    wed: 71,
    thu: 76,
    fri: 88,
    sat: 96,
    sun: 91,
  },
  fbCategories: {
    beverage: 92_000,
    snacks: 38_000,
    hotFood: 86_000,
    alcohol: 103_000,
  },
  fbDayparts: {
    breakfast: 28_000,
    lunch: 96_000,
    turn: 74_000,
    nineteenth: 121_000,
  },
  shopMargins: {
    apparel: 42,
    equipment: 28,
    balls: 48,
    accessories: 51,
  },
  payrollDepts: {
    proShop: 32_400,
    fb: 74_800,
    grounds: 61_200,
    carts: 14_600,
    admin: 15_600,
  },
  utilities: {
    water: 18_400,
    electric: 9_800,
    fuel: 6_200,
  },
  maintenanceAreas: {
    greens: 16_400,
    fairways: 12_800,
    bunkers: 6_200,
    cartPaths: 10_800,
  },
  chemicals: {
    fertilizer: 8_400,
    chemicals: 6_100,
    seed: 3_200,
  },
  equipmentMaint: {
    mowers: 9_800,
    sprayers: 2_400,
    utilityVehicles: 3_100,
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
  avgCheckFb: 28,
  avgCheckShop: 64,
  opex: 312_400,
  overtimeCost: 11_800,
  waterCost: 18_400,
  electricCost: 9_800,
  fuelCost: 6_200,
  foodCostPct: 31,
  wasteDollars: 2_140,
  inventoryTurnover: 4.6,
  shrinkagePct: 1.4,
  noShowCount: 86,
  rebookingRate: 41,
  bookingLeadDays: 6.4,
  loyaltyEnrollmentPct: 18,
  loyaltyRedemptionPct: 62,
  clv: 840,
  maintLaborHours: 1_860,
  maintLaborBudgetHours: 1_920,
  downtimeHours: 38,
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
    fb: 200_000,
    lessons: 16_000,
    memberships: 12_980,
  },
  segments: {
    weekday: 154_000,
    weekend: 198_000,
    twilight: 52_000,
    senior: 38_000,
    junior: 9_000,
    resident: 41_980,
    nonResident: 19_000,
  },
  channels: {
    online: 980,
    phone: 760,
    walkIn: 580,
    thirdParty: 360,
  },
  golferTypes: {
    public: 1_120,
    member: 1_080,
    league: 280,
    outing: 200,
  },
  timeBlocks: {
    morning: 81,
    midday: 69,
    twilight: 52,
  },
  dayOfWeek: {
    mon: 54,
    tue: 61,
    wed: 66,
    thu: 70,
    fri: 84,
    sat: 94,
    sun: 88,
  },
  fbCategories: {
    beverage: 58_000,
    snacks: 24_000,
    hotFood: 52_000,
    alcohol: 66_000,
  },
  fbDayparts: {
    breakfast: 16_000,
    lunch: 62_000,
    turn: 48_000,
    nineteenth: 74_000,
  },
  shopMargins: {
    apparel: 39,
    equipment: 26,
    balls: 46,
    accessories: 49,
  },
  payrollDepts: {
    proShop: 21_400,
    fb: 52_800,
    grounds: 44_200,
    carts: 11_200,
    admin: 11_600,
  },
  utilities: {
    water: 14_800,
    electric: 7_400,
    fuel: 4_900,
  },
  maintenanceAreas: {
    greens: 13_200,
    fairways: 10_400,
    bunkers: 5_100,
    cartPaths: 9_700,
  },
  chemicals: {
    fertilizer: 6_800,
    chemicals: 4_900,
    seed: 2_400,
  },
  equipmentMaint: {
    mowers: 7_600,
    sprayers: 1_900,
    utilityVehicles: 2_600,
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
  avgCheckFb: 24,
  avgCheckShop: 51,
  opex: 218_600,
  overtimeCost: 7_400,
  waterCost: 14_800,
  electricCost: 7_400,
  fuelCost: 4_900,
  foodCostPct: 33,
  wasteDollars: 1_620,
  inventoryTurnover: 3.9,
  shrinkagePct: 1.8,
  noShowCount: 54,
  rebookingRate: 48,
  bookingLeadDays: 8.1,
  loyaltyEnrollmentPct: 26,
  loyaltyRedemptionPct: 71,
  clv: 1_240,
  maintLaborHours: 1_520,
  maintLaborBudgetHours: 1_480,
  downtimeHours: 52,
}

const BY_ID: Record<string, Baseline> = {
  [PINE_RIDGE]: PINE,
  [MILL_CREEK]: MILL,
}

const CATEGORY_LABELS: Record<string, string> = {
  greenFees: 'Green fees',
  carts: 'Carts',
  proShop: 'Pro shop',
  fb: 'F&B',
  lessons: 'Lessons',
  memberships: 'Memberships',
}

const SEGMENT_LABELS: Record<string, string> = {
  weekday: 'Weekday',
  weekend: 'Weekend',
  twilight: 'Twilight',
  senior: 'Senior',
  junior: 'Junior',
  resident: 'Resident',
  nonResident: 'Non-resident',
}

const CHANNEL_LABELS: Record<string, string> = {
  online: 'Online',
  phone: 'Phone',
  walkIn: 'Walk-in',
  thirdParty: 'GolfNow / 3rd party',
}

const GOLFER_LABELS: Record<string, string> = {
  public: 'Public',
  member: 'Member',
  league: 'League',
  outing: 'Outing / event',
}

const TIME_BLOCK_LABELS: Record<string, string> = {
  morning: 'Morning',
  midday: 'Midday',
  twilight: 'Twilight',
}

const DOW_LABELS: Record<string, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

const FB_CATEGORY_LABELS: Record<string, string> = {
  beverage: 'Beverage',
  snacks: 'Snacks',
  hotFood: 'Hot food',
  alcohol: 'Alcohol',
}

const FB_DAYPART_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  turn: 'Turn',
  nineteenth: '19th hole',
}

const SHOP_MARGIN_LABELS: Record<string, string> = {
  apparel: 'Apparel',
  equipment: 'Equipment',
  balls: 'Balls',
  accessories: 'Accessories',
}

const PAYROLL_LABELS: Record<string, string> = {
  proShop: 'Pro shop',
  fb: 'F&B',
  grounds: 'Grounds',
  carts: 'Cart staff',
  admin: 'Admin',
}

const UTILITY_LABELS: Record<string, string> = {
  water: 'Water / irrigation',
  electric: 'Electricity',
  fuel: 'Gas / fuel',
}

const MAINT_AREA_LABELS: Record<string, string> = {
  greens: 'Greens',
  fairways: 'Fairways',
  bunkers: 'Bunkers',
  cartPaths: 'Cart paths',
}

const CHEMICAL_LABELS: Record<string, string> = {
  fertilizer: 'Fertilizer',
  chemicals: 'Chemicals',
  seed: 'Seed',
}

const EQUIPMENT_LABELS: Record<string, string> = {
  mowers: 'Mowers',
  sprayers: 'Sprayers',
  utilityVehicles: 'Utility vehicles',
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
    golferTypes: mergeMap((row) => row.golferTypes),
    timeBlocks: Object.fromEntries(
      Object.keys(first.timeBlocks).map((key) => [
        key,
        avg((row) => row.timeBlocks[key] ?? 0),
      ]),
    ),
    dayOfWeek: Object.fromEntries(
      Object.keys(first.dayOfWeek).map((key) => [
        key,
        avg((row) => row.dayOfWeek[key] ?? 0),
      ]),
    ),
    fbCategories: mergeMap((row) => row.fbCategories),
    fbDayparts: mergeMap((row) => row.fbDayparts),
    shopMargins: Object.fromEntries(
      Object.keys(first.shopMargins).map((key) => [
        key,
        avg((row) => row.shopMargins[key] ?? 0),
      ]),
    ),
    payrollDepts: mergeMap((row) => row.payrollDepts),
    utilities: mergeMap((row) => row.utilities),
    maintenanceAreas: mergeMap((row) => row.maintenanceAreas),
    chemicals: mergeMap((row) => row.chemicals),
    equipmentMaint: mergeMap((row) => row.equipmentMaint),
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
    avgCheckFb: avg((row) => row.avgCheckFb),
    avgCheckShop: avg((row) => row.avgCheckShop),
    opex: sum((row) => row.opex),
    overtimeCost: sum((row) => row.overtimeCost),
    waterCost: sum((row) => row.waterCost),
    electricCost: sum((row) => row.electricCost),
    fuelCost: sum((row) => row.fuelCost),
    foodCostPct: avg((row) => row.foodCostPct),
    wasteDollars: sum((row) => row.wasteDollars),
    inventoryTurnover: avg((row) => row.inventoryTurnover),
    shrinkagePct: avg((row) => row.shrinkagePct),
    noShowCount: sum((row) => row.noShowCount),
    rebookingRate: avg((row) => row.rebookingRate),
    bookingLeadDays: avg((row) => row.bookingLeadDays),
    loyaltyEnrollmentPct: avg((row) => row.loyaltyEnrollmentPct),
    loyaltyRedemptionPct: avg((row) => row.loyaltyRedemptionPct),
    clv: avg((row) => row.clv),
    maintLaborHours: sum((row) => row.maintLaborHours),
    maintLaborBudgetHours: sum((row) => row.maintLaborBudgetHours),
    downtimeHours: sum((row) => row.downtimeHours),
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
  const fbRevenue = scale(row.categories.fb ?? 0, period)
  const shopRevenue = scale(row.categories.proShop ?? 0, period)
  const opex = scale(row.opex, period)
  const utility = scale(row.waterCost + row.electricCost + row.fuelCost, period)
  const comps = scale(row.comps, period)
  const noShows = scale(row.noShowCount, period)

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
    laborPct: compared(revenue ? (labor / revenue) * 100 : 0, 1.03, 1.05),
    laborPerRound: compared(rounds ? labor / rounds : 0, 1.02, 1.04),
    compsPct: compared((row.comps / row.revenue) * 100, 0.92, 0.88),
    compsDollars: compared(comps, 0.92, 0.88),
    leftoverTeeTimeDollars: compared(leftover, 1.08, 1.12),
    fbRevenue: compared(fbRevenue, row.priorPeriodRatio, row.priorYearRatio + 0.03),
    fbCapturePct: compared(scalePct(row.fbCapturePct), 0.97, 0.94),
    avgCheckFb: compared(row.avgCheckFb, 0.98, 0.95),
    proShopRevenue: compared(shopRevenue, row.priorPeriodRatio, row.priorYearRatio),
    avgCheckShop: compared(row.avgCheckShop, 0.97, 0.93),
    opex: compared(opex, 1.02, 1.06),
    overtimeCost: compared(scale(row.overtimeCost, period), 1.11, 1.08),
    utilitySpend: compared(utility, 1.04, 1.09),
    waterCost: compared(scale(row.waterCost, period), 1.06, 1.12),
    electricCost: compared(scale(row.electricCost, period), 1.02, 1.05),
    fuelCost: compared(scale(row.fuelCost, period), 1.03, 1.07),
    utilityPerRound: compared(rounds ? utility / rounds : 0, 1.04, 1.08),
    maintenanceSpend: compared(
      scale(row.maintenanceSpend, period),
      1.01,
      1.04,
    ),
    foodCostPct: compared(row.foodCostPct, 1.02, 1.01),
    wasteDollars: compared(scale(row.wasteDollars, period), 1.05, 0.94),
    inventoryTurnover: compared(row.inventoryTurnover, 0.97, 0.93),
    shrinkagePct: compared(row.shrinkagePct, 1.08, 0.9),
    noShowCount: compared(noShows, 1.06, 1.12),
    noShowRevenue: compared(noShows * row.avgGreenFee, 1.06, 1.12),
    rebookingRate: compared(row.rebookingRate, 0.96, 0.91),
    bookingLeadDays: compared(row.bookingLeadDays, 0.94, 0.88),
    loyaltyEnrollmentPct: compared(row.loyaltyEnrollmentPct, 0.95, 0.86),
    loyaltyRedemptionPct: compared(row.loyaltyRedemptionPct, 0.98, 0.94),
    membershipRenewalPct: compared(row.membershipRenewalPct, 0.99, 0.97),
    clv: compared(row.clv, 0.97, 0.9),
    cartAttachPct: compared(scalePct(row.cartAttachPct), 0.95, 0.9),
  }
}

export function breakdownFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
): MetricsBreakdown {
  const row = activeBaseline(scope)
  const total = scale(row.revenue, period) || 1
  const asPct = (record: Record<string, number>, labels: Record<string, string>) =>
    Object.entries(record).map(([id, amount]) => ({
      id,
      name: labels[id] ?? id,
      amount,
      sharePct: amount,
    }))

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
    golferTypes: namedFrom(row.golferTypes, GOLFER_LABELS, period, true),
    timeBlocks: asPct(row.timeBlocks, TIME_BLOCK_LABELS),
    dayOfWeek: asPct(row.dayOfWeek, DOW_LABELS),
    fbCategories: namedFrom(row.fbCategories, FB_CATEGORY_LABELS, period),
    fbDayparts: namedFrom(row.fbDayparts, FB_DAYPART_LABELS, period),
    shopMargins: asPct(row.shopMargins, SHOP_MARGIN_LABELS),
    payrollDepts: namedFrom(row.payrollDepts, PAYROLL_LABELS, period),
    utilities: namedFrom(row.utilities, UTILITY_LABELS, period),
    maintenanceAreas: namedFrom(row.maintenanceAreas, MAINT_AREA_LABELS, period),
    chemicals: namedFrom(row.chemicals, CHEMICAL_LABELS, period),
    equipmentMaint: namedFrom(row.equipmentMaint, EQUIPMENT_LABELS, period),
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
    {
      metric: 'maintenance',
      label: 'Maintenance',
      actual: scale(row.maintenanceSpend, period),
      budget: Math.round(scale(row.maintenanceSpend, period) / 0.97),
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
      fbRevenue: scale(row.categories.fb ?? 0, period),
      maintenanceSpend: scale(row.maintenanceSpend, period),
      laborPct: row.revenue ? (row.laborCost / row.revenue) * 100 : 0,
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

const FB_TOP = [
  ['lager-pint', 'Lager pint'],
  ['house-burger', 'House burger'],
  ['iced-tea', 'Iced tea'],
  ['hot-dog', 'Hot dog'],
  ['sparkling', 'Sparkling water'],
]
const FB_SLOW = [
  ['soup', 'Seasonal soup'],
  ['kids-meal', 'Kids meal'],
  ['protein-bar', 'Protein bar'],
]
const SHOP_TOP = [
  ['pro-v1', 'Titleist Pro V1 dozen'],
  ['glove', 'FootJoy StaSof glove'],
  ['visor', 'Club visor'],
  ['tee-pack', 'Tee pack'],
]
const SHOP_SLOW = [
  ['rain-suit', 'Rain suit'],
  ['putter-cover', 'Putter cover'],
  ['range-finder', 'Rangefinder'],
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p']
const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

function scaleItems(
  items: string[][],
  period: PeriodKey,
  unitBase: number,
  dollarBase: number,
  aged = false,
): RankedItem[] {
  return items.map(([id, name], index) => ({
    id,
    name,
    units: scale(Math.round(unitBase * (1 - index * 0.18)), period),
    amount: scale(Math.round(dollarBase * (1 - index * 0.16)), period),
    ageDays: aged ? 40 + index * 28 : undefined,
    onHand: aged ? 8 + index * 4 : undefined,
  }))
}

export function opsFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
): OpsMetrics {
  const row = activeBaseline(scope)
  const rows = baselines(scope)
  const fb = scale(row.categories.fb ?? 1, period)
  const shop = scale(row.categories.proShop ?? 1, period)

  return {
    topFbItems: scaleItems(FB_TOP, period, 420, fb * 0.12),
    slowFbItems: scaleItems(FB_SLOW, period, 28, fb * 0.012, true),
    topShopItems: scaleItems(SHOP_TOP, period, 90, shop * 0.18),
    slowShopItems: scaleItems(SHOP_SLOW, period, 6, shop * 0.04, true),
    lowStock: [
      {
        id: 'lager',
        name: 'Lager kegs',
        units: 2,
        amount: 0,
        onHand: 2,
      },
      {
        id: 'pro-v1',
        name: 'Pro V1 dozen',
        units: 5,
        amount: 0,
        onHand: 5,
      },
      {
        id: 'glove-ml',
        name: 'StaSof glove M/L',
        units: 4,
        amount: 0,
        onHand: 4,
      },
    ],
    teeDemand: DAYS.flatMap((day, d) =>
      HOURS.map((hour, h) => {
        const weekend = d >= 5 ? 1.18 : 1
        const peak = h >= 2 && h <= 5 ? 1.25 : h >= 9 ? 0.72 : 1
        return {
          day,
          hour,
          value: Math.min(100, Math.round(row.dayOfWeek[['mon','tue','wed','thu','fri','sat','sun'][d]] * peak * weekend)),
        }
      }),
    ),
    bookingPaceWindows: [
      {
        days: 7,
        current: scale(row.advanceRounds * 0.35, period === 'today' ? 'wtd' : period),
        prior: scale(row.advanceRounds * 0.31, period === 'today' ? 'wtd' : period),
      },
      {
        days: 14,
        current: scale(row.advanceRounds * 0.62, period === 'today' ? 'wtd' : period),
        prior: scale(row.advanceRounds * 0.58, period === 'today' ? 'wtd' : period),
      },
      {
        days: 30,
        current: scale(row.advanceRounds, period === 'today' ? 'wtd' : period),
        prior: scale(row.advanceRounds * 0.91, period === 'today' ? 'wtd' : period),
      },
    ],
    bookingMixTrend: Array.from({ length: 8 }, (_, index) => ({
      date: daysAgo((7 - index) * 7),
      online: Math.round((row.channels.online / row.rounds) * 100 + index * 0.4),
      phone: Math.round((row.channels.phone / row.rounds) * 100 - index * 0.2),
      walkIn: Math.round((row.channels.walkIn / row.rounds) * 100),
      thirdParty: Math.round(((row.channels.thirdParty ?? 0) / row.rounds) * 100 + index * 0.15),
    })),
    leadTimeTrend: Array.from({ length: 8 }, (_, index) => ({
      date: daysAgo((7 - index) * 7),
      days: Number((row.bookingLeadDays + (index - 4) * 0.18).toFixed(1)),
    })),
    staffing: Object.entries(row.payrollDepts).map(([id, cost]) => ({
      department: PAYROLL_LABELS[id] ?? id,
      scheduledHours: scale(id === 'grounds' ? 920 : 480, period),
      actualHours: scale(id === 'grounds' ? 980 : 510, period),
      overtimeHours: scale(id === 'fb' ? 64 : 22, period),
      cost: scale(cost, period),
      budget: scale(Math.round(cost * 0.96), period),
    })),
    fleet: [
      {
        id: 'fairway-mower',
        name: 'Fairway mower 1',
        ageYears: 7,
        downtimeHours: scale(row.downtimeHours * 0.4, period),
        replacementDue: true,
      },
      {
        id: 'greens-mower',
        name: 'Greens mower 2',
        ageYears: 4,
        downtimeHours: scale(row.downtimeHours * 0.2, period),
        replacementDue: false,
      },
      {
        id: 'sprayer',
        name: 'Fairway sprayer',
        ageYears: 9,
        downtimeHours: scale(row.downtimeHours * 0.25, period),
        replacementDue: true,
      },
    ],
    weatherEvents: [
      {
        id: 'frost-1',
        date: daysAgo(12),
        label: 'Frost delay',
        cost: scale(2_400, period),
      },
      {
        id: 'storm-1',
        date: daysAgo(41),
        label: 'Storm washout / bunker repair',
        cost: scale(8_600, period),
      },
    ],
    seasonalUtilities: MONTHS.map((month, index) => ({
      month,
      water: Math.round(row.waterCost * (0.55 + index * 0.12) / 8),
      electric: Math.round(row.electricCost * (0.85 + (index % 3) * 0.08) / 8),
      fuel: Math.round(row.fuelCost * (0.8 + index * 0.04) / 8),
    })),
    courseCategory: rows.map((item) => ({
      propertyId: item.propertyId,
      propertyName: item.name,
      fb: scale(item.categories.fb ?? 0, period),
      maintenance: scale(item.maintenanceSpend, period),
      laborPct: item.revenue ? (item.laborCost / item.revenue) * 100 : 0,
    })),
    maintLaborHours: scale(row.maintLaborHours, period),
    maintLaborBudgetHours: scale(row.maintLaborBudgetHours, period),
    downtimeHours: scale(row.downtimeHours, period),
  }
}

