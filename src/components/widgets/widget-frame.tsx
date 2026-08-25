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
        'flex h-full flex-col overflow-hidden rounded-md border border-border bg-card',
        className,
      )}
    >
      <header className="flex items-center gap-1 px-2 py-1.5">
        <button
          type="button"
          className="widget-drag-handle flex h-6 w-6 cursor-grab items-center justify-center rounded text-muted-foreground/70 active:cursor-grabbing"
          aria-label={`Move ${title}`}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <h2 className="flex-1 truncate text-[13px] font-medium">{title}</h2>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-muted-foreground"
          onClick={onRemove}
          aria-label={`Remove ${title}`}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </header>
      <div className="min-h-0 flex-1 px-4 pb-4 pt-1">{children}</div>
    </section>
  )
}
