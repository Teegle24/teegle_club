import { Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { AppShell } from '@/components/layout/app-shell'
import { PeriodProvider } from '@/context/period'
import { PropertyScopeProvider } from '@/context/property-scope'
import { isMockMode } from '@/lib/config'

function ShellTree() {
  return (
    <PropertyScopeProvider>
      <PeriodProvider>
        <AppShell />
      </PeriodProvider>
    </PropertyScopeProvider>
  )
}

export function ProtectedLayout() {
  if (isMockMode()) {
    return <ShellTree />
  }

  return (
    <>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
      <SignedIn>
        <ShellTree />
      </SignedIn>
    </>
  )
}
