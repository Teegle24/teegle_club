import { createContext, useContext, type ReactNode } from 'react'
import { useDashboardWidgets } from '@/hooks/use-dashboard-widgets'
import type { WidgetId } from '@/components/widgets/catalog'

type DashboardWidgetsContextValue = ReturnType<typeof useDashboardWidgets>

const DashboardWidgetsContext = createContext<DashboardWidgetsContextValue | null>(null)

export function DashboardWidgetsProvider({ children }: { children: ReactNode }) {
  const value = useDashboardWidgets()
  return (
    <DashboardWidgetsContext.Provider value={value}>{children}</DashboardWidgetsContext.Provider>
  )
}

export function useDashboardWidgetsContext() {
  const context = useContext(DashboardWidgetsContext)
  if (!context) {
    throw new Error('useDashboardWidgetsContext must be used within DashboardWidgetsProvider')
  }
  return context
}

export function useOptionalDashboardWidgets() {
  return useContext(DashboardWidgetsContext)
}

export type { WidgetId }
