import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/api/client'
import { usePropertyScope } from '@/context/property-scope'
import type { DashboardLayout } from '@/types'
import { scopeKey } from '@/types'

export function useDashboardLayout() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const { scope, allowedPropertyIds } = usePropertyScope()

  return useQuery({
    queryKey: ['dashboard-layout', scopeKey(scope)],
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: 60_000,
    queryFn: async () => {
      const token = await getToken()
      try {
        return await api.get<DashboardLayout>('/me/dashboard-layout', {
          token,
          scope,
          allowedPropertyIds,
        })
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null
        }
        throw error
      }
    },
  })
}

export function useSaveDashboardLayout() {
  const { getToken } = useAuth()
  const { scope, allowedPropertyIds } = usePropertyScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (layout: DashboardLayout) => {
      const token = await getToken()
      return api.put<DashboardLayout>('/me/dashboard-layout', layout, {
        token,
        scope,
        allowedPropertyIds,
      })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['dashboard-layout', scopeKey(scope)], data)
    },
  })
}
