import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/client'
import { useSession } from '@/auth/session'
import { usePeriod } from '@/context/period'
import { usePropertyScope } from '@/context/property-scope'
import { fiscalYear } from '@/lib/targets'
import type { MetricTargetView } from '@/types'
import { scopeKey } from '@/types'

export function useRevenueTarget() {
  const { getToken, isLoaded, isSignedIn } = useSession()
  const { scope, allowedPropertyIds } = usePropertyScope()
  const { period } = usePeriod()
  const year = fiscalYear()

  return useQuery({
    queryKey: ['metric-target', 'revenue', scopeKey(scope), period, year],
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: 15_000,
    queryFn: async () => {
      const token = await getToken()
      return api.get<MetricTargetView>('/targets', {
        token,
        scope,
        allowedPropertyIds,
        searchParams: { period, year, metric: 'revenue' },
      })
    },
  })
}

export function useSaveRevenueTarget() {
  const { getToken } = useSession()
  const { scope, allowedPropertyIds } = usePropertyScope()
  const { period } = usePeriod()
  const queryClient = useQueryClient()
  const year = fiscalYear()

  return useMutation({
    mutationFn: async (amount: number) => {
      const token = await getToken()
      return api.put<MetricTargetView>(
        '/targets',
        { metric: 'revenue', year, amount },
        {
          token,
          scope,
          allowedPropertyIds,
          searchParams: { period, year },
        },
      )
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['metric-target', 'revenue', scopeKey(scope), period, year],
        data,
      )
      void queryClient.invalidateQueries({ queryKey: ['metrics-summary'] })
      void queryClient.invalidateQueries({ queryKey: ['metrics-budget'] })
    },
  })
}
