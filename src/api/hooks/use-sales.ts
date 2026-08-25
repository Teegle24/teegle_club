import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { useSession } from '@/auth/session'
import { usePropertyScope } from '@/context/property-scope'
import type { Paginated, Sale } from '@/types'
import { scopeKey } from '@/types'

export function useSales(page = 1, pageSize = 50) {
  const { getToken, isLoaded, isSignedIn } = useSession()
  const { scope, allowedPropertyIds } = usePropertyScope()

  return useQuery({
    queryKey: ['sales', scopeKey(scope), page, pageSize],
    enabled: isLoaded && Boolean(isSignedIn),
    refetchInterval: 20_000,
    queryFn: async () => {
      const token = await getToken()
      return api.get<Paginated<Sale>>('/sales', {
        token,
        scope,
        allowedPropertyIds,
        searchParams: { page, pageSize },
      })
    },
  })
}

export function useRecentSales(limit = 8) {
  const { getToken, isLoaded, isSignedIn } = useSession()
  const { scope, allowedPropertyIds } = usePropertyScope()

  return useQuery({
    queryKey: ['sales-recent', scopeKey(scope), limit],
    enabled: isLoaded && Boolean(isSignedIn),
    refetchInterval: 20_000,
    queryFn: async () => {
      const token = await getToken()
      return api.get<Paginated<Sale>>('/sales', {
        token,
        scope,
        allowedPropertyIds,
        searchParams: { page: 1, pageSize: limit },
      })
    },
  })
}
