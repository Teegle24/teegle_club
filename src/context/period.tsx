import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { PeriodKey } from '@/types'

const STORAGE_KEY = 'teegle-club.period'

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'wtd', label: 'WTD' },
  { key: 'mtd', label: 'MTD' },
  { key: 'ytd', label: 'YTD' },
]

interface PeriodValue {
  period: PeriodKey
  setPeriod: (period: PeriodKey) => void
  options: typeof PERIODS
}

const PeriodContext = createContext<PeriodValue | null>(null)

function parsePeriod(raw: string | null): PeriodKey {
  if (raw === 'today' || raw === 'wtd' || raw === 'mtd' || raw === 'ytd') {
    return raw
  }
  return 'mtd'
}

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriodState] = useState<PeriodKey>(() =>
    parsePeriod(localStorage.getItem(STORAGE_KEY)),
  )

  const setPeriod = useCallback((next: PeriodKey) => {
    setPeriodState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo(
    () => ({ period, setPeriod, options: PERIODS }),
    [period, setPeriod],
  )

  return (
    <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>
  )
}

export function usePeriod() {
  const context = useContext(PeriodContext)
  if (!context) {
    throw new Error('usePeriod must be used within PeriodProvider')
  }
  return context
}
