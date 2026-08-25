import { useEffect, useMemo, useRef, useState } from 'react'
import GridLayout from 'react-grid-layout'
import { RotateCcw } from 'lucide-react'
import { SectionHeading } from '@/components/dashboard/section-heading'
import {
  categoryIcon,
  groupDetailByCategory,
  isWidgetId,
  splitWidgetIds,
  widgetById,
  type WidgetId,
} from '@/components/widgets/catalog'
import {
  COL_SPAN,
  GLANCE_GRID_MARGIN,
  GLANCE_ROW_HEIGHT,
  orderFromLayout,
  packDetailBands,
  packGlanceLayout,
  SIZE_TIERS,
  TILE_MIN_HEIGHT,
} from '@/components/widgets/grid-tiers'
import { renderWidgetContent } from '@/components/widgets/widget-renderer'
import { WidgetFrame } from '@/components/widgets/widget-frame'
import { WidgetLoading } from '@/components/widget-states'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import 'react-grid-layout/css/styles.css'

function useGlanceCols() {
  const [cols, setCols] = useState(4)

  useEffect(() => {
    const xl = window.matchMedia('(min-width: 1280px)')
    const sm = window.matchMedia('(min-width: 640px)')
    const update = () => setCols(xl.matches ? 4 : sm.matches ? 2 : 1)
    update()
    xl.addEventListener('change', update)
    sm.addEventListener('change', update)
    return () => {
      xl.removeEventListener('change', update)
      sm.removeEventListener('change', update)
    }
  }, [])

  return cols
}

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(Math.round(el.getBoundingClientRect().width))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

function WidgetTile({
  id,
  onRemove,
  onReorderKey,
  featured = false,
  compact = false,
  fill = false,
  reorderable = false,
}: {
  id: WidgetId
  onRemove: () => void
  onReorderKey?: (delta: -1 | 1) => void
  featured?: boolean
  compact?: boolean
  fill?: boolean
  reorderable?: boolean
}) {
  const widget = widgetById(id)
  if (!widget) return null
  const sizeTier = widget.sizeTier
  const colSpan = compact || fill ? undefined : (COL_SPAN[SIZE_TIERS[sizeTier].w] ?? 'col-span-12')

  return (
    <div className={cn(compact || fill ? 'h-full min-h-0' : cn('col-span-12', colSpan))}>
      <WidgetFrame
        widgetId={id}
        title={widget.title}
        icon={categoryIcon(widget.category)}
        onRemove={onRemove}
        onReorderKey={onReorderKey}
        featured={featured}
        reorderable={reorderable}
        className={cn(compact || fill ? 'h-full' : TILE_MIN_HEIGHT[sizeTier])}
      >
        {renderWidgetContent(id, featured, featured, compact)}
      </WidgetFrame>
    </div>
  )
}

function GlanceGrid({
  ids,
  onRemove,
  onReorder,
}: {
  ids: WidgetId[]
  onRemove: (id: WidgetId) => void
  onReorder: (next: WidgetId[]) => void
}) {
  const cols = useGlanceCols()
  const { ref, width } = useContainerWidth()
  const layout = useMemo(() => packGlanceLayout(ids, cols), [ids, cols])

  const moveBy = (id: WidgetId, delta: -1 | 1) => {
    const index = ids.indexOf(id)
    const nextIndex = index + delta
    if (index < 0 || nextIndex < 0 || nextIndex >= ids.length) return
    const next = [...ids]
    const [item] = next.splice(index, 1)
    next.splice(nextIndex, 0, item)
    onReorder(next)
  }

  return (
    <div ref={ref} className="w-full">
      {width > 0 ? (
        <GridLayout
          className="glance-grid"
          layout={layout}
          width={width}
          cols={cols}
          rowHeight={GLANCE_ROW_HEIGHT}
          margin={GLANCE_GRID_MARGIN}
          containerPadding={[0, 0]}
          isResizable={false}
          isBounded
          compactType="horizontal"
          draggableHandle=".widget-drag-handle"
          onDragStop={(nextLayout) => {
            const ordered = orderFromLayout(nextLayout).filter(isWidgetId)
            if (ordered.length !== ids.length) return
            if (ordered.every((id, index) => id === ids[index])) return
            onReorder(ordered)
          }}
        >
          {ids.map((id) => (
            <div key={id} className="h-full">
              <WidgetTile
                id={id}
                onRemove={() => onRemove(id)}
                onReorderKey={(delta) => moveBy(id, delta)}
                compact
                fill
                reorderable
              />
            </div>
          ))}
        </GridLayout>
      ) : (
        <div className="grid auto-rows-[16.5rem] grid-cols-12 gap-3">
          {ids.map((id) => (
            <div key={id} className="col-span-12 h-full min-h-0 sm:col-span-6 xl:col-span-3">
              <WidgetTile
                id={id}
                onRemove={() => onRemove(id)}
                compact
                fill
                reorderable
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DetailCategoryGrid({
  ids,
  onRemove,
}: {
  ids: WidgetId[]
  onRemove: (id: WidgetId) => void
}) {
  const bands = useMemo(
    () => packDetailBands(ids, (id) => widgetById(id)?.sizeTier ?? 'md'),
    [ids],
  )

  return (
    <div className="grid grid-cols-12 gap-3">
      {bands.map((band) => {
        if (band.kind === 'full') {
          return (
            <div key={band.id} className="col-span-12">
              <WidgetTile id={band.id} onRemove={() => onRemove(band.id)} fill />
            </div>
          )
        }

        const { smalls, larges } = band
        if (smalls.length === 0) {
          return (
            <div key={larges.join('-')} className="contents">
              {larges.map((id) => (
                <div key={id} className="col-span-12 md:col-span-6">
                  <WidgetTile id={id} onRemove={() => onRemove(id)} />
                </div>
              ))}
            </div>
          )
        }

        const rows = Math.max(smalls.length, 1)
        return (
          <div
            key={[...smalls, ...larges].join('-')}
            className="col-span-12 grid grid-cols-12 gap-3"
            style={{ gridTemplateRows: `repeat(${rows}, minmax(10.5rem, auto))` }}
          >
            {smalls.map((id, index) => (
              <div
                key={id}
                className="col-span-12 min-h-0 sm:col-span-3"
                style={{ gridRow: index + 1 }}
              >
                <WidgetTile id={id} onRemove={() => onRemove(id)} compact fill />
              </div>
            ))}
            {larges.map((id) => (
              <div
                key={id}
                className="col-span-12 min-h-0 sm:col-span-9"
                style={{ gridRow: `1 / span ${rows}` }}
              >
                <WidgetTile id={id} onRemove={() => onRemove(id)} fill />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function DashboardGrid({
  widgetIds,
  onRemove,
  onReorderHighLevel,
  resetLayout,
  isPending,
}: {
  widgetIds: WidgetId[]
  onRemove: (id: WidgetId) => void
  onReorderHighLevel: (next: WidgetId[]) => void
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
            description="Sparkline, pace to plan, and change vs the selected period. Drag the handle to reorder."
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
          <GlanceGrid
            ids={hlIds}
            onRemove={onRemove}
            onReorder={onReorderHighLevel}
          />
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
                <DetailCategoryGrid ids={ids} onRemove={onRemove} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
