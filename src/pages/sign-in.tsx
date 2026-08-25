import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

export function SignInPage() {
  return (
    <>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-svh flex-col items-center justify-center bg-sidebar px-4">
          <p className="mb-6 font-serif text-3xl text-sidebar-foreground">
            Teegle Club
          </p>
          <SignIn
            routing="path"
            path="/sign-in"
            fallbackRedirectUrl="/"
            appearance={{
              variables: {
                colorPrimary: '#1a3c34',
                borderRadius: '0.5rem',
              },
            }}
          />
        </div>
      </SignedOut>
    </>
  )
}
