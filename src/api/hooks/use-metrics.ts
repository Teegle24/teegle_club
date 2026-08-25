import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { usePropertyScope } from '@/context/property-scope'
import type { MetricsSummary, SalesTrendPoint } from '@/types'
import { scopeKey } from '@/types'

const METRICS_REFETCH = 30_000

export function useMetrics() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const { scope, allowedPropertyIds } = usePropertyScope()

  return useQuery({
    queryKey: ['metrics', scopeKey(scope)],
    enabled: isLoaded && Boolean(isSignedIn),
    refetchInterval: METRICS_REFETCH,
    queryFn: async () => {
      const token = await getToken()
      return api.get<MetricsSummary>('/metrics', {
        token,
        scope,
        allowedPropertyIds,
      })
    },
  })
}

export function useSalesTrend() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
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
