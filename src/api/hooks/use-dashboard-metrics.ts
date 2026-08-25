import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { useSession } from '@/auth/session'
import { usePeriod } from '@/context/period'
import { usePropertyScope } from '@/context/property-scope'
import type {
  BudgetRow,
  CostMargins,
  MetricsBreakdown,
  MetricsPipeline,
  OpportunityItem,
  PropertyComparisonRow,
} from '@/types'
import { scopeKey } from '@/types'

function useScopedGet<T>(path: string, key: string) {
  const { getToken, isLoaded, isSignedIn } = useSession()
  const { scope, allowedPropertyIds } = usePropertyScope()
  const { period } = usePeriod()

  return useQuery({
    queryKey: [key, scopeKey(scope), period],
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: 15_000,
    refetchInterval: 30_000,
    queryFn: async () => {
      const token = await getToken()
      return api.get<T>(path, {
        token,
        scope,
        allowedPropertyIds,
        searchParams: { period },
      })
    },
  })
}

export function useBreakdown() {
  return useScopedGet<MetricsBreakdown>('/metrics/breakdown', 'metrics-breakdown')
}

export function useBudget() {
  return useScopedGet<BudgetRow[]>('/metrics/budget', 'metrics-budget')
}

export function useComparison() {
  return useScopedGet<PropertyComparisonRow[]>(
    '/metrics/comparison',
    'metrics-comparison',
  )
}

export function usePipeline() {
  return useScopedGet<MetricsPipeline>('/metrics/pipeline', 'metrics-pipeline')
}

export function useCosts() {
  return useScopedGet<CostMargins>('/metrics/costs', 'metrics-costs')
}

export function useOpportunities() {
  return useScopedGet<OpportunityItem[]>(
    '/metrics/opportunities',
    'metrics-opportunities',
  )
}
