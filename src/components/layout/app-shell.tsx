import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { usePropertyScope } from '@/context/property-scope'

export function AppShell() {
  const { isRollup, selectedProperty, access } = usePropertyScope()
  const contextLabel = isRollup
    ? 'All linked properties'
    : selectedProperty?.name ?? 'Property'

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card/70 px-6 backdrop-blur">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {access?.organization.name ?? 'Teegle Club'}
            </p>
            <p className="text-sm font-medium">{contextLabel}</p>
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
