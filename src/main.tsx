import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'
import { SessionProvider } from '@/auth/session'
import { ConfigError } from '@/components/config-error'
import { TooltipProvider } from '@/components/ui/tooltip'
import { isConfigReady, isMockMode } from '@/lib/config'
import { queryClient } from '@/lib/query-client'
import './index.css'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function AppTree() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider delayDuration={200}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}

createRoot(root).render(
  <StrictMode>
    {isMockMode() ? (
      <AppTree />
    ) : isConfigReady() ? (
      <ClerkProvider
        publishableKey={clerkKey}
        afterSignOutUrl="/sign-in"
        signInUrl="/sign-in"
      >
        <AppTree />
      </ClerkProvider>
    ) : (
      <ConfigError />
    )}
  </StrictMode>,
)
