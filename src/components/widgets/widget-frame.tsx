import type { ReactNode } from 'react'
import { GripVertical, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function WidgetFrame({
  title,
  onRemove,
  children,
  className,
}: {
  title: string
  onRemove: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm',
        className,
      )}
    >
      <header className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        <button
          type="button"
          className="widget-drag-handle flex h-7 w-7 cursor-grab items-center justify-center rounded-md text-muted-foreground active:cursor-grabbing"
          aria-label={`Move ${title}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <h2 className="flex-1 truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </h2>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-muted-foreground"
          onClick={onRemove}
          aria-label={`Remove ${title}`}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </header>
      <div className="min-h-0 flex-1 p-4">{children}</div>
    </section>
  )
}
