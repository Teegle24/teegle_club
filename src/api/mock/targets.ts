import { MILL_CREEK, PINE_RIDGE, access } from '@/api/mock/data'
import { fiscalYear, periodShareOfAnnual, type TargetMetric } from '@/lib/targets'
import type { MetricTargetView, PeriodKey, PropertyScope } from '@/types'

const STORAGE_KEY = 'teegle-club.mock.targets.v1'

type Store = Record<string, number>

function propertyIds(scope?: PropertyScope) {
  if (!scope || scope.type === 'rollup') {
    return access.properties.map((property) => property.id)
  }
  return [scope.propertyId]
}

function keyFor(year: number, propertyId: string, metric: TargetMetric) {
  return `${year}:${propertyId}:${metric}`
}

function seedYear(year: number): Store {
  return {
    [keyFor(year, PINE_RIDGE, 'revenue')]: 10_100_000,
    [keyFor(year, MILL_CREEK, 'revenue')]: 6_150_000,
  }
}

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedYear(fiscalYear())
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed = JSON.parse(raw) as Store
    if (!parsed || typeof parsed !== 'object') return seedYear(fiscalYear())
    return parsed
  } catch {
    return seedYear(fiscalYear())
  }
}

function writeStore(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function annualRevenueGoal(
  scope: PropertyScope | undefined,
  year = fiscalYear(),
) {
  const store = readStore()
  const ids = propertyIds(scope)
  const total = ids.reduce(
    (sum, propertyId) => sum + (store[keyFor(year, propertyId, 'revenue')] ?? 0),
    0,
  )
  return total > 0 ? total : null
}

export function targetViewFor(
  scope: PropertyScope | undefined,
  period: PeriodKey,
  year = fiscalYear(),
): MetricTargetView {
  const annual = annualRevenueGoal(scope, year)
  return {
    metric: 'revenue',
    year,
    annual,
    periodAmount: annual == null ? null : periodShareOfAnnual(annual, period),
    editable: scope?.type === 'property',
  }
}

export function saveRevenueGoal(
  scope: PropertyScope | undefined,
  amount: number,
  year = fiscalYear(),
) {
  if (!scope || scope.type !== 'property') {
    throw new Error('Set a revenue goal on a single course, not the rollup.')
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Enter a dollar amount greater than zero.')
  }
  const store = readStore()
  store[keyFor(year, scope.propertyId, 'revenue')] = Math.round(amount)
  writeStore(store)
}
