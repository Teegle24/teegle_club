import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
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
}: {
  selected: WidgetId[]
  onToggle: (id: WidgetId, next: boolean) => void
}) {
  const selectedSet = useMemo(() => new Set(selected), [selected])

  return (
    <aside className="w-40 shrink-0">
      <p className="mb-2 px-2 text-[11px] font-medium text-muted-foreground">
        Add metrics
      </p>
      <nav className="flex flex-col gap-px">
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
                    'flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground',
                    count > 0 && 'text-foreground',
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{category.label}</span>
                  {count > 0 ? (
                    <span className="tabular-nums text-[11px] text-muted-foreground">
                      {count}
                    </span>
                  ) : null}
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                sideOffset={6}
                className="max-h-80 w-64 overflow-auto"
              >
                <DropdownMenuLabel>High-level</DropdownMenuLabel>
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
                    <DropdownMenuLabel>Detail</DropdownMenuLabel>
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
    </aside>
  )
}
