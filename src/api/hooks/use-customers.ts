import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { usePropertyScope } from '@/context/property-scope'
import type { Customer, CustomerProfile, Paginated } from '@/types'
import { scopeKey } from '@/types'

export function useCustomers(page = 1, pageSize = 50) {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const { scope, allowedPropertyIds } = usePropertyScope()

  return useQuery({
    queryKey: ['customers', scopeKey(scope), page, pageSize],
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: 30_000,
    queryFn: async () => {
      const token = await getToken()
      return api.get<Paginated<Customer>>('/customers', {
        token,
        scope,
        allowedPropertyIds,
        searchParams: { page, pageSize },
      })
    },
  })
}

export function useCustomer(customerId: string | undefined) {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const { scope, allowedPropertyIds } = usePropertyScope()

  return useQuery({
    queryKey: ['customer', customerId, scopeKey(scope)],
    enabled: isLoaded && Boolean(isSignedIn) && Boolean(customerId),
    queryFn: async () => {
      const token = await getToken()
      return api.get<CustomerProfile>(`/customers/${customerId}`, {
        token,
        scope,
        allowedPropertyIds,
      })
    },
  })
}
