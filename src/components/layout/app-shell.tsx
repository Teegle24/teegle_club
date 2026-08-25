import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { Badge } from '@/components/ui/badge'
import { usePropertyScope } from '@/context/property-scope'
import { isMockMode } from '@/lib/config'

export function AppShell() {
  const { isRollup, selectedProperty, access } = usePropertyScope()
  const contextLabel = isRollup
    ? 'All properties'
    : selectedProperty?.name ?? 'Property'

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center justify-between border-b border-border bg-card px-6">
          <p className="text-[13px] text-muted-foreground">
            <span className="text-foreground">{access?.organization.name ?? 'Teegle Club'}</span>
            <span className="mx-2 text-border">/</span>
            {contextLabel}
          </p>
          {isMockMode() ? (
            <Badge variant="outline">Demo</Badge>
          ) : null}
        </header>
        <main className="min-w-0 flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
