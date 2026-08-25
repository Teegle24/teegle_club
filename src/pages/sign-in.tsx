import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { isMockMode } from '@/lib/config'

export function SignInPage() {
  if (isMockMode()) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
          <p className="mb-6 text-xl font-semibold tracking-tight">
            Teegle Club
          </p>
          <SignIn
            routing="path"
            path="/sign-in"
            fallbackRedirectUrl="/"
            appearance={{
              variables: {
                colorPrimary: '#155e4b',
                borderRadius: '0.375rem',
              },
            }}
          />
        </div>
      </SignedOut>
    </>
  )
}
