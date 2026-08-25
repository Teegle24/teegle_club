import { ApiError, type ApiRequestOptions } from '@/api/shared'
import {
  access,
  customerProfile,
  customers,
  sales,
} from '@/api/mock/data'
import {
  breakdownFor,
  budgetFor,
  comparisonFor,
  costsFor,
  idsFor,
  opportunitiesFor,
  pipelineFor,
  summaryFor,
  trendFor,
} from '@/api/mock/snapshot'
import type { DashboardLayout, Paginated, PeriodKey, PropertyScope, Sale } from '@/types'

const LAYOUT_KEY = 'teegle-club.mock.dashboard-layout.v2'

function delay(ms = 140) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function periodOf(searchParams?: ApiRequestOptions['searchParams']): PeriodKey {
  const value = String(searchParams?.period ?? 'mtd')
  if (value === 'today' || value === 'wtd' || value === 'mtd' || value === 'ytd') {
    return value
  }
  return 'mtd'
}

function tabOf(searchParams?: ApiRequestOptions['searchParams'], body?: unknown) {
  if (body && typeof body === 'object' && 'tab' in body) {
    const tab = (body as DashboardLayout).tab
    if (tab === 'ops' || tab === 'trends') return tab
  }
  const value = String(searchParams?.tab ?? 'trends')
  return value === 'ops' ? 'ops' : 'trends'
}

function pageParams(searchParams?: ApiRequestOptions['searchParams']) {
  const page = Number(searchParams?.page ?? 1) || 1
  const pageSize = Number(searchParams?.pageSize ?? 50) || 50
  return { page, pageSize }
}

function paginate<T>(items: T[], searchParams?: ApiRequestOptions['searchParams']): Paginated<T> {
  const { page, pageSize } = pageParams(searchParams)
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  }
}

function salesFor(scope?: PropertyScope): Sale[] {
  const ids = new Set(idsFor(scope))
  return sales.filter((sale) => ids.has(sale.propertyId))
}

function customersFor(scope?: PropertyScope) {
  const ids = new Set(idsFor(scope))
  return customers.filter((customer) => ids.has(customer.propertyId))
}

function layoutKey(scope?: PropertyScope, tab = 'trends') {
  const suffix = !scope || scope.type === 'rollup' ? 'rollup' : scope.propertyId
  return `${LAYOUT_KEY}.${suffix}.${tab}`
}

export async function mockRequest<T>(options: ApiRequestOptions): Promise<T> {
  await delay()

  const method = options.method ?? 'GET'
  const path = options.path
  const period = periodOf(options.searchParams)

  if (path === '/me/access' && method === 'GET') {
    return access as T
  }

  if ((path === '/metrics' || path === '/metrics/summary') && method === 'GET') {
    return summaryFor(options.scope, period) as T
  }

  if (path === '/metrics/breakdown' && method === 'GET') {
    return breakdownFor(options.scope, period) as T
  }

  if (path === '/metrics/trend' && method === 'GET') {
    return trendFor(options.scope) as T
  }

  if (path === '/metrics/budget' && method === 'GET') {
    return budgetFor(options.scope, period) as T
  }

  if (path === '/metrics/comparison' && method === 'GET') {
    return comparisonFor(options.scope, period) as T
  }

  if (path === '/metrics/pipeline' && method === 'GET') {
    return pipelineFor(options.scope, period) as T
  }

  if (path === '/metrics/costs' && method === 'GET') {
    return costsFor(options.scope, period) as T
  }

  if (path === '/metrics/opportunities' && method === 'GET') {
    return opportunitiesFor(options.scope, period) as T
  }

  if (path === '/sales' && method === 'GET') {
    return paginate(salesFor(options.scope), options.searchParams) as T
  }

  if (path === '/customers' && method === 'GET') {
    return paginate(customersFor(options.scope), options.searchParams) as T
  }

  if (path.startsWith('/customers/') && method === 'GET') {
    const id = path.replace('/customers/', '')
    const profile = customerProfile(id)
    const allowed = new Set(idsFor(options.scope))
    if (!profile || !allowed.has(profile.propertyId)) {
      throw new ApiError('Customer not found in this property scope', 404, null)
    }
    return profile as T
  }

  if (path === '/me/dashboard-layout' && method === 'GET') {
    const raw = localStorage.getItem(
      layoutKey(options.scope, tabOf(options.searchParams)),
    )
    if (!raw) {
      throw new ApiError('No saved layout', 404, null)
    }
    return JSON.parse(raw) as T
  }

  if (path === '/me/dashboard-layout' && method === 'PUT') {
    const payload = options.body as DashboardLayout
    localStorage.setItem(
      layoutKey(options.scope, tabOf(options.searchParams, payload)),
      JSON.stringify(payload),
    )
    return payload as T
  }

  throw new ApiError(`No mock handler for ${method} ${path}`, 404, null)
}
