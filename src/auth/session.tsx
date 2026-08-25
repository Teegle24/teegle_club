import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { isMockMode } from '@/lib/config'

export interface Session {
  getToken: () => Promise<string | null>
  isLoaded: boolean
  isSignedIn: boolean
}

const MOCK_SESSION: Session = {
  getToken: async () => 'mock-token',
  isLoaded: true,
  isSignedIn: true,
}

const SessionContext = createContext<Session | null>(null)

function ClerkSessionBridge({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const value = useMemo<Session>(
    () => ({
      getToken: () => auth.getToken(),
      isLoaded: auth.isLoaded,
      isSignedIn: Boolean(auth.isSignedIn),
    }),
    [auth],
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function SessionProvider({ children }: { children: ReactNode }) {
  if (isMockMode()) {
    return (
      <SessionContext.Provider value={MOCK_SESSION}>
        {children}
      </SessionContext.Provider>
    )
  }

  return <ClerkSessionBridge>{children}</ClerkSessionBridge>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}
