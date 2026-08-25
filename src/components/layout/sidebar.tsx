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
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-sidebar text-sidebar-foreground">
      <div className="px-4 pb-4 pt-5">
        <p className="text-[15px] font-semibold tracking-tight">Teegle Club</p>
      </div>

      <div className="px-3 pb-4">
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
                  ? 'bg-white/10 text-white'
                  : 'text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground',
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

      <div className="flex shrink-0 items-center gap-2.5 border-t border-white/10 px-3 py-3">
        {isMockMode() ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-[11px] text-sidebar-foreground">
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
