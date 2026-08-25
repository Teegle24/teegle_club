import { useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import { SectionHeading } from '@/components/dashboard/section-heading'
import {
  categoryIcon,
  groupDetailByCategory,
  splitWidgetIds,
  widgetById,
  type WidgetId,
} from '@/components/widgets/catalog'
import { COL_SPAN, SIZE_TIERS, TILE_MIN_HEIGHT } from '@/components/widgets/grid-tiers'
import { renderWidgetContent } from '@/components/widgets/widget-renderer'
import { WidgetFrame } from '@/components/widgets/widget-frame'
import { WidgetLoading } from '@/components/widget-states'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function WidgetTile({
  id,
  onRemove,
  featured = false,
  compact = false,
}: {
  id: WidgetId
  onRemove: () => void
  featured?: boolean
  compact?: boolean
}) {
  const widget = widgetById(id)
  if (!widget) return null
  const sizeTier = widget.sizeTier
  const colSpan = compact ? undefined : (COL_SPAN[SIZE_TIERS[sizeTier].w] ?? 'col-span-12')

  return (
    <div className={cn(compact ? 'h-full min-h-0' : cn('col-span-12', colSpan))}>
      <WidgetFrame
        widgetId={id}
        title={widget.title}
        icon={categoryIcon(widget.category)}
        onRemove={onRemove}
        featured={featured}
        className={cn(
          compact ? 'h-full' : TILE_MIN_HEIGHT[sizeTier],
        )}
      >
        {renderWidgetContent(id, featured, featured, compact)}
      </WidgetFrame>
    </div>
  )
}

export function DashboardGrid({
  widgetIds,
  onRemove,
  resetLayout,
  isPending,
}: {
  widgetIds: WidgetId[]
  onRemove: (id: WidgetId) => void
  resetLayout: () => void
  isPending: boolean
}) {
  const { hl: hlIds, det: detIds } = useMemo(() => splitWidgetIds(widgetIds), [widgetIds])
  const categoryGroups = useMemo(() => groupDetailByCategory(detIds), [detIds])

  if (isPending) {
    return (
      <div className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-36 rounded-md border border-border bg-card p-4"
            >
              <WidgetLoading />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            eyebrow="High level"
            title="At a glance"
            description="Sparkline, pace to plan, and change vs the selected period."
          />
          <Button type="button" variant="outline" size="sm" onClick={resetLayout}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset layout
          </Button>
        </div>

        {hlIds.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-border bg-canvas-2 text-sm text-ink-soft">
            No high-level metrics selected. Add them from the sidebar metric list.
          </div>
        ) : (
          <div className="grid auto-rows-[15rem] grid-cols-12 gap-3">
            {hlIds.map((id) => (
              <div key={id} className="col-span-12 h-full min-h-0 sm:col-span-6 xl:col-span-3">
                <WidgetTile
                  id={id}
                  onRemove={() => onRemove(id)}
                  compact
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading
          eyebrow="Operations"
          title="Detail metrics"
          description="Grouped by category. Click any tile for a deeper breakdown."
          className="mb-6"
        />

        {categoryGroups.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center rounded-md border border-dashed border-border bg-canvas-2 text-sm text-ink-soft">
            Pick detail metrics from the sidebar under Dashboard, Sales, and Customers.
          </div>
        ) : (
          <div className="space-y-8">
            {categoryGroups.map(({ category, label, ids }) => (
              <div key={category}>
                <SectionHeading
                  eyebrow={label}
                  title={`${label} metrics`}
                  className="mb-3"
                />
                <div className="grid grid-cols-12 gap-3">
                  {ids.map((id) => (
                    <WidgetTile key={id} id={id} onRemove={() => onRemove(id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
