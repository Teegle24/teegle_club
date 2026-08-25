import type { PeriodKey } from '@/types'

export const TARGET_METRICS = ['revenue'] as const
export type TargetMetric = (typeof TARGET_METRICS)[number]

export function isTargetMetric(value: string): value is TargetMetric {
  return (TARGET_METRICS as readonly string[]).includes(value)
}

export function fiscalYear(at = new Date()) {
  return at.getFullYear()
}

export function daysInCalendarYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365
}

/** Slice of an annual dollar goal for the dashboard period. YTD uses the full year. */
export function periodShareOfAnnual(
  annual: number,
  period: PeriodKey,
  at = new Date(),
) {
  if (!Number.isFinite(annual) || annual <= 0) return 0
  const year = at.getFullYear()
  const perDay = annual / daysInCalendarYear(year)
  if (period === 'ytd') return Math.round(annual)
  if (period === 'today') return Math.round(perDay)
  if (period === 'wtd') return Math.round(perDay * 7)
  const daysInMonth = new Date(year, at.getMonth() + 1, 0).getDate()
  return Math.round(perDay * daysInMonth)
}

export function parseDollarInput(raw: string) {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  if (!cleaned) return null
  const value = Number(cleaned)
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(value)
}
