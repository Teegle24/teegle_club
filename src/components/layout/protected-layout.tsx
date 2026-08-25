import { Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { AppShell } from '@/components/layout/app-shell'
import { PropertyScopeProvider } from '@/context/property-scope'

export function ProtectedLayout() {
  return (
    <>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
      <SignedIn>
        <PropertyScopeProvider>
          <AppShell />
        </PropertyScopeProvider>
      </SignedIn>
    </>
  )
}
