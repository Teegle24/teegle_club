import type { ReactNode } from 'react'
import { GripVertical, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function WidgetFrame({
  title,
  eyebrow,
  onRemove,
  children,
  className,
  draggable = true,
  featured = false,
}: {
  title: string
  eyebrow?: string
  onRemove: () => void
  children: ReactNode
  className?: string
  draggable?: boolean
  featured?: boolean
}) {
  return (
    <section
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-md border shadow-sm',
        featured
          ? 'border-brand/25 bg-navy text-white shadow-brand/10'
          : 'border-border/80 bg-card text-card-foreground',
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-0.5',
          featured ? 'bg-brand-2' : 'bg-brand/70',
        )}
      />
      <header
        className={cn(
          'flex items-center gap-1 border-b px-2 py-1.5',
          featured ? 'border-white/10' : 'border-border/60 bg-canvas-2/50',
        )}
      >
        {draggable ? (
          <button
            type="button"
            className={cn(
              'widget-drag-handle flex h-6 w-6 cursor-grab items-center justify-center rounded active:cursor-grabbing',
              featured ? 'text-white/50 hover:text-white/80' : 'text-ink-soft/70 hover:text-ink',
            )}
            aria-label={`Move ${title}`}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="h-6 w-6 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p
              className={cn(
                'label truncate leading-none',
                featured ? 'text-ice/80' : 'text-brand',
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={cn(
              'truncate font-display text-[13px] font-semibold tracking-tight',
              featured ? 'text-white' : 'text-ink',
            )}
          >
            {title}
          </h2>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={cn(
            'h-6 w-6',
            featured ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-ink-soft',
          )}
          onClick={onRemove}
          aria-label={`Remove ${title}`}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </header>
      <div className="min-h-0 flex-1 px-4 pb-4 pt-3">{children}</div>
    </section>
  )
}
