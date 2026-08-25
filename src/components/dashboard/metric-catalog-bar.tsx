import { useMemo } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  CATEGORIES,
  widgetsByCategory,
  type WidgetId,
} from '@/components/widgets/catalog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function MetricCatalogBar({
  selected,
  onToggle,
  variant = 'sidebar',
}: {
  selected: WidgetId[]
  onToggle: (id: WidgetId, next: boolean) => void
  variant?: 'sidebar' | 'inline'
}) {
  const selectedSet = useMemo(() => new Set(selected), [selected])
  const isSidebar = variant === 'sidebar'

  return (
    <div
      className={cn(
        isSidebar
          ? 'border-t border-white/10 px-2 py-3'
          : 'mb-8 rounded-md border border-border/80 bg-card p-3 shadow-sm',
      )}
    >
      <p
        className={cn(
          'label mb-2 px-1',
          isSidebar ? 'text-sidebar-muted' : 'text-brand',
        )}
      >
        Add metrics
      </p>
      <nav className={cn(isSidebar ? 'flex flex-col gap-px' : 'flex flex-wrap gap-2')}>
        {CATEGORIES.map((category) => {
          const widgets = widgetsByCategory(category.id)
          const count = widgets.filter((widget) => selectedSet.has(widget.id)).length
          const high = widgets.filter((widget) => widget.tier === 'hl')
          const detail = widgets.filter((widget) => widget.tier === 'det')
          return (
            <DropdownMenu key={category.id}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    isSidebar
                      ? 'flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] transition-colors'
                      : 'inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px] transition-colors',
                    isSidebar
                      ? count > 0
                        ? 'bg-white/10 text-white'
                        : 'text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground'
                      : count > 0
                        ? 'border-brand/30 bg-brand/5 text-ink'
                        : 'border-border bg-canvas-2/40 text-ink-soft hover:border-border hover:bg-canvas-2 hover:text-ink',
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{category.label}</span>
                  {count > 0 ? (
                    <span
                      className={cn(
                        'tabular-nums',
                        isSidebar
                          ? 'text-[11px] text-ice/90'
                          : 'rounded-full bg-brand px-1.5 text-[10px] font-semibold text-primary-foreground',
                      )}
                    >
                      {count}
                    </span>
                  ) : null}
                  {isSidebar ? (
                    <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isSidebar ? 'right' : 'bottom'}
                align={isSidebar ? 'start' : 'start'}
                sideOffset={isSidebar ? 8 : 4}
                className="max-h-80 w-64 overflow-auto"
              >
                <DropdownMenuLabel className="label text-brand">High-level</DropdownMenuLabel>
                {high.map((widget) => (
                  <DropdownMenuCheckboxItem
                    key={widget.id}
                    checked={selectedSet.has(widget.id)}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={(checked) => onToggle(widget.id, Boolean(checked))}
                  >
                    {widget.title}
                  </DropdownMenuCheckboxItem>
                ))}
                {detail.length > 0 ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="label text-ink-soft">Detail</DropdownMenuLabel>
                    {detail.map((widget) => (
                      <DropdownMenuCheckboxItem
                        key={widget.id}
                        checked={selectedSet.has(widget.id)}
                        onSelect={(event) => event.preventDefault()}
                        onCheckedChange={(checked) => onToggle(widget.id, Boolean(checked))}
                      >
                        {widget.title}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}
      </nav>
    </div>
  )
}
