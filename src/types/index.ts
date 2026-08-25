export type MembershipLabel = 'owner' | 'gm' | 'investor' | 'board' | string

export interface Organization {
  id: string
  name: string
}

export interface Property {
  id: string
  name: string
  organizationId: string
}

export interface PropertyMembership {
  propertyId: string
  label?: MembershipLabel
}

export interface Access {
  userId: string
  organization: Organization
  properties: Property[]
  memberships: PropertyMembership[]
}

export type PropertyScope =
  | { type: 'rollup' }
  | { type: 'property'; propertyId: string }

export type PeriodKey = 'today' | 'wtd' | 'mtd' | 'ytd'

export type MetricCategory =
  | 'revenue'
  | 'tee-sheet'
  | 'fb'
  | 'pro-shop'
  | 'expenses'
  | 'utilities'
  | 'maintenance'
  | 'trends'
  | 'customers'
  | 'properties'

export type MetricTier = 'hl' | 'det'

export interface PeriodWindow {
  key: PeriodKey
  from: string
  to: string
}

export interface ComparedValue {
  current: number | null
  priorPeriod: number | null
  priorYear: number | null
}

export type ComparedMetricKey =
  | 'revenue'
  | 'rounds'
  | 'revenuePerRound'
  | 'utilizationPct'
  | 'ebitda'
  | 'gop'
  | 'laborCost'
  | 'laborPct'
  | 'laborPerRound'
  | 'compsPct'
  | 'compsDollars'
  | 'leftoverTeeTimeDollars'
  | 'fbRevenue'
  | 'fbCapturePct'
  | 'avgCheckFb'
  | 'proShopRevenue'
  | 'avgCheckShop'
  | 'opex'
  | 'overtimeCost'
  | 'utilitySpend'
  | 'waterCost'
  | 'electricCost'
  | 'fuelCost'
  | 'utilityPerRound'
  | 'maintenanceSpend'
  | 'foodCostPct'
  | 'wasteDollars'
  | 'inventoryTurnover'
  | 'shrinkagePct'
  | 'noShowCount'
  | 'noShowRevenue'
  | 'rebookingRate'
  | 'bookingLeadDays'
  | 'loyaltyEnrollmentPct'
  | 'loyaltyRedemptionPct'
  | 'membershipRenewalPct'
  | 'clv'
  | 'cartAttachPct'

export interface MetricsSummary extends Record<ComparedMetricKey, ComparedValue> {
  propertyId: string | null
  period: PeriodWindow
  currency: string
}

export interface NamedAmount {
  id: string
  name: string
  amount: number
  sharePct?: number
  marginPct?: number
}

export interface MetricsBreakdown {
  categories: NamedAmount[]
  segments: NamedAmount[]
  channels: NamedAmount[]
  outlets: NamedAmount[]
  golferTypes: NamedAmount[]
  timeBlocks: NamedAmount[]
  dayOfWeek: NamedAmount[]
  fbCategories: NamedAmount[]
  fbDayparts: NamedAmount[]
  shopMargins: NamedAmount[]
  payrollDepts: NamedAmount[]
  utilities: NamedAmount[]
  maintenanceAreas: NamedAmount[]
  chemicals: NamedAmount[]
  equipmentMaint: NamedAmount[]
}

export interface BudgetRow {
  metric: 'revenue' | 'rounds' | 'labor' | 'maintenance'
  label: string
  budget: number
  actual: number
}

export interface PropertyComparisonRow {
  propertyId: string
  propertyName: string
  rounds: number
  revenue: number
  revenuePerRound: number
  utilizationPct: number
  fbRevenue: number
  maintenanceSpend: number
  laborPct: number
}

export interface OpportunityItem {
  id: string
  title: string
  detail: string
  impactDollars: number
}

export interface MetricsPipeline {
  advanceRounds: number
  advanceRevenue: number
  leagueOutingRevenue: number
  membershipEnrollmentPct: number
  membershipRenewalPct: number
  newGolferPct: number
  repeatGolferPct: number
}

export interface CostMargins {
  laborCost: number
  laborPct: number
  proShopMarginPct: number
  fbMarginPct: number
  maintenanceSpend: number
  capexSpend: number
}

export interface RankedItem {
  id: string
  name: string
  units: number
  amount: number
  ageDays?: number
  onHand?: number
}

export interface HeatmapCell {
  day: string
  hour: string
  value: number
}

export interface BookingPaceWindow {
  days: 7 | 14 | 30
  current: number
  prior: number
}

export interface MixTrendPoint {
  date: string
  online: number
  phone: number
  walkIn: number
  thirdParty: number
}

export interface LeadTimePoint {
  date: string
  days: number
}

export interface StaffingRow {
  department: string
  scheduledHours: number
  actualHours: number
  overtimeHours: number
  cost: number
  budget: number
}

export interface FleetFlag {
  id: string
  name: string
  ageYears: number
  downtimeHours: number
  replacementDue: boolean
}

export interface WeatherEvent {
  id: string
  date: string
  label: string
  cost: number
}

export interface SeasonalUtilityPoint {
  month: string
  water: number
  electric: number
  fuel: number
}

export interface CourseCategoryRow {
  propertyId: string
  propertyName: string
  fb: number
  maintenance: number
  laborPct: number
}

export interface OpsMetrics {
  topFbItems: RankedItem[]
  slowFbItems: RankedItem[]
  topShopItems: RankedItem[]
  slowShopItems: RankedItem[]
  lowStock: RankedItem[]
  teeDemand: HeatmapCell[]
  bookingPaceWindows: BookingPaceWindow[]
  bookingMixTrend: MixTrendPoint[]
  leadTimeTrend: LeadTimePoint[]
  staffing: StaffingRow[]
  fleet: FleetFlag[]
  weatherEvents: WeatherEvent[]
  seasonalUtilities: SeasonalUtilityPoint[]
  courseCategory: CourseCategoryRow[]
  maintLaborHours: number
  maintLaborBudgetHours: number
  downtimeHours: number
}

export interface SalesTrendPoint {
  date: string
  revenue: number
  rounds: number
  utilizationPct: number
  weatherAdjustedRevenue: number
}

export interface Sale {
  id: string
  propertyId: string
  propertyName: string
  soldBy: { id: string; name: string }
  item: { id: string; name: string; category?: string }
  soldAt: string
  amount: number
  currency?: string
  customerId?: string
  customerName?: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface Customer {
  id: string
  propertyId: string
  propertyName: string
  name: string
  email?: string
  phone?: string
  lastVisitAt?: string
  lifetimeValue: number
  visitCount: number
  preferredItems?: string[]
}

export interface CustomerProfile extends Customer {
  purchases: Sale[]
  notes?: string
}

export interface GridWidgetLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

export interface DashboardLayout {
  widgets: string[]
  layouts: {
    lg: GridWidgetLayout[]
    md?: GridWidgetLayout[]
    sm?: GridWidgetLayout[]
  }
}

export function isPropertyAllowed(
  scope: PropertyScope,
  allowedPropertyIds: string[],
) {
  if (scope.type === 'rollup') return true
  return allowedPropertyIds.includes(scope.propertyId)
}

export function scopeKey(scope: PropertyScope) {
  return scope.type === 'rollup' ? 'rollup' : `property:${scope.propertyId}`
}

export function membershipLabel(label?: MembershipLabel) {
  if (!label) return null
  const names: Record<string, string> = {
    owner: 'Owner',
    gm: 'GM',
    investor: 'Investor',
    board: 'Board',
  }
  return names[label] ?? label
}
