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

export interface MetricsSummary {
  propertyId: string | null
  period: { from: string; to: string }
  gop: number | null
  totalRevenue: number | null
  payrollCost: number | null
  currency: string
}

export interface SalesTrendPoint {
  date: string
  revenue: number
  gop: number
  payrollCost: number
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
