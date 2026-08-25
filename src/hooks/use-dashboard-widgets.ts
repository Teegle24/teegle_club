import { useEffect, useRef, useState } from 'react'
import { useDashboardLayout, useSaveDashboardLayout } from '@/api/hooks'
import {
  DEFAULT_WIDGETS,
  isWidgetId,
  packDetailLayouts,
  splitWidgetIds,
  type WidgetId,
} from '@/components/widgets/catalog'
import type { DashboardLayout } from '@/types'

export function useDashboardWidgets() {
  const layoutQuery = useDashboardLayout()
  const saveLayout = useSaveDashboardLayout()
  const [widgetIds, setWidgetIds] = useState<WidgetId[]>(DEFAULT_WIDGETS)
  const hydrated = useRef(false)
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    if (layoutQuery.isError) {
      hydrated.current = true
      return
    }
    if (!layoutQuery.isSuccess) return
    const remote = layoutQuery.data
    if (remote?.widgets?.length) {
      const nextIds = remote.widgets.filter(isWidgetId)
      setWidgetIds(nextIds.length ? nextIds : DEFAULT_WIDGETS)
    } else {
      setWidgetIds(DEFAULT_WIDGETS)
    }
    hydrated.current = true
  }, [layoutQuery.data, layoutQuery.isError, layoutQuery.isSuccess])

  const persist = (nextIds: WidgetId[]) => {
    if (!hydrated.current) return
    const { det } = splitWidgetIds(nextIds)
    const payload: DashboardLayout = {
      widgets: nextIds,
      layouts: packDetailLayouts(det),
    }
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      saveLayout.mutate(payload)
    }, 700)
  }

  const removeWidget = (id: WidgetId) => {
    const nextIds = widgetIds.filter((item) => item !== id)
    setWidgetIds(nextIds)
    persist(nextIds)
  }

  const addWidget = (id: WidgetId) => {
    if (widgetIds.includes(id)) return
    const nextIds = [...widgetIds, id]
    setWidgetIds(nextIds)
    persist(nextIds)
  }

  const onToggle = (id: WidgetId, next: boolean) => {
    if (next) addWidget(id)
    else removeWidget(id)
  }

  const resetLayout = () => {
    setWidgetIds(DEFAULT_WIDGETS)
    persist(DEFAULT_WIDGETS)
  }

  return {
    widgetIds,
    onToggle,
    removeWidget,
    resetLayout,
    isPending: layoutQuery.isPending,
    isError: layoutQuery.isError,
  }
}
