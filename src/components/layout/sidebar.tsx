import { NavLink, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { LayoutDashboard, Receipt, Users } from 'lucide-react'
import { MetricCatalogBar } from '@/components/dashboard/metric-catalog-bar'
import { PropertySwitcher } from '@/components/layout/property-switcher'
import { useOptionalDashboardWidgets } from '@/context/dashboard-widgets'
import { isMockMode } from '@/lib/config'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/sales', label: 'Sales', icon: Receipt, end: false },
  { to: '/customers', label: 'Customers', icon: Users, end: false },
]

export function Sidebar() {
  const location = useLocation()
  const widgets = useOptionalDashboardWidgets()
  const onDashboard = location.pathname === '/'

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="px-3 py-3">
        <img
          src="/teegle-club-logo.png"
          alt="Teegle Club"
          className="mx-auto h-16 w-auto max-w-[200px] object-contain"
        />
      </div>

      <div className="px-3 py-4">
        <PropertySwitcher />
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                isActive
                  ? 'bg-brand/15 font-medium text-brand'
                  : 'text-sidebar-muted hover:bg-canvas-2 hover:text-sidebar-foreground',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {onDashboard && widgets ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <MetricCatalogBar
            selected={widgets.widgetIds}
            onToggle={widgets.onToggle}
            variant="sidebar"
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div className="flex shrink-0 items-center gap-2.5 border-t border-border px-3 py-3">
        {isMockMode() ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-canvas-2 text-[11px] text-sidebar-foreground">
            DG
          </span>
        ) : (
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-7 w-7',
              },
            }}
          />
        )}
        <div className="min-w-0">
          <p className="truncate text-[13px]">{isMockMode() ? 'Demo guest' : 'Account'}</p>
          <p className="truncate text-[11px] text-sidebar-muted">
            {isMockMode() ? 'Demo data' : 'Signed in'}
          </p>
        </div>
      </div>
    </aside>
  )
}
