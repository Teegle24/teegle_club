import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'
import { ConfigError } from '@/components/config-error'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from '@/lib/query-client'
import { isConfigReady } from '@/lib/utils'
import './index.css'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(root).render(
  <StrictMode>
    {isConfigReady() ? (
      <ClerkProvider
        publishableKey={clerkKey}
        afterSignOutUrl="/sign-in"
        signInUrl="/sign-in"
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={200}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ClerkProvider>
    ) : (
      <ConfigError />
    )}
  </StrictMode>,
)
