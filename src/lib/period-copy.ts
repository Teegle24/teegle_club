import type { PeriodKey } from '@/types'

export const PRIOR_PERIOD_LABEL: Record<PeriodKey, string> = {
  today: 'vs yesterday',
  wtd: 'vs last week',
  mtd: 'vs last month',
  ytd: 'vs last year',
}
