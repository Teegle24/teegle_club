import { NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { Flag, LayoutDashboard, Receipt, Users } from 'lucide-react'
import { PropertySwitcher } from '@/components/layout/property-switcher'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/sales', label: 'Sales', icon: Receipt, end: false },
  { to: '/customers', label: 'Customers', icon: Users, end: false },
]

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Flag className="h-4 w-4" />
        </span>
        <div>
          <p className="font-serif text-lg leading-none tracking-tight">
            Teegle Club
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-sidebar-muted">
            Course operations
          </p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <PropertySwitcher />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
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

      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4">
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
            },
          }}
        />
        <div className="min-w-0">
          <p className="truncate text-sm">Account</p>
          <p className="truncate text-[11px] text-sidebar-muted">Signed in</p>
        </div>
      </div>
    </aside>
  )
}
