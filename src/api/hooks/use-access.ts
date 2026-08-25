import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import type { Access } from '@/types'

export function useAccess() {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery({
    queryKey: ['access'],
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: 60_000,
    queryFn: async () => {
      const token = await getToken()
      return api.get<Access>('/me/access', { token })
    },
  })
}
