import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { useSession } from '@/auth/session'
import { usePeriod } from '@/context/period'
import { usePropertyScope } from '@/context/property-scope'
import type { MetricsSummary, SalesTrendPoint } from '@/types'
import { scopeKey } from '@/types'

const METRICS_REFETCH = 30_000

export function useMetrics() {
  const { getToken, isLoaded, isSignedIn } = useSession()
  const { scope, allowedPropertyIds } = usePropertyScope()
  const { period } = usePeriod()

  return useQuery({
    queryKey: ['metrics-summary', scopeKey(scope), period],
    enabled: isLoaded && Boolean(isSignedIn),
    refetchInterval: METRICS_REFETCH,
    queryFn: async () => {
      const token = await getToken()
      return api.get<MetricsSummary>('/metrics/summary', {
        token,
        scope,
        allowedPropertyIds,
        searchParams: { period },
      })
    },
  })
}

export function useSalesTrend() {
  const { getToken, isLoaded, isSignedIn } = useSession()
  const { scope, allowedPropertyIds } = usePropertyScope()

  return useQuery({
    queryKey: ['metrics-trend', scopeKey(scope)],
    enabled: isLoaded && Boolean(isSignedIn),
    refetchInterval: METRICS_REFETCH,
    queryFn: async () => {
      const token = await getToken()
      return api.get<SalesTrendPoint[]>('/metrics/trend', {
        token,
        scope,
        allowedPropertyIds,
      })
    },
  })
}
