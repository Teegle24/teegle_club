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

export type DashboardTab = 'trends' | 'ops'

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

export interface MetricsSummary {
  propertyId: string | null
  period: PeriodWindow
  currency: string
  revenue: ComparedValue
  rounds: ComparedValue
  revenuePerRound: ComparedValue
  utilizationPct: ComparedValue
  ebitda: ComparedValue
  gop: ComparedValue
  laborCost: ComparedValue
  laborPct: ComparedValue
  compsPct: ComparedValue
  leftoverTeeTimeDollars: ComparedValue
  fbCapturePct: ComparedValue
  cartAttachPct: ComparedValue
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
}

export interface BudgetRow {
  metric: 'revenue' | 'rounds' | 'labor'
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
  tab?: DashboardTab
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
