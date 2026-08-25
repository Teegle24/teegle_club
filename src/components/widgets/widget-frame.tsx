import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, X } from 'lucide-react'
import type { WidgetId } from '@/components/widgets/catalog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function WidgetFrame({
  widgetId,
  title,
  eyebrow,
  onRemove,
  children,
  className,
  featured = false,
  interactive = true,
  showRemove = true,
}: {
  widgetId: WidgetId
  title: string
  eyebrow?: string
  onRemove?: () => void
  children: ReactNode
  className?: string
  featured?: boolean
  interactive?: boolean
  showRemove?: boolean
}) {
  const navigate = useNavigate()

  const openDetail = () => {
    if (!interactive) return
    navigate(`/metrics/${widgetId}`)
  }

  return (
    <section
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? openDetail : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openDetail()
              }
            }
          : undefined
      }
      className={cn(
        'group relative flex h-full min-h-0 flex-col overflow-hidden rounded-md border shadow-sm transition-shadow',
        interactive && 'cursor-pointer hover:shadow-md',
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
        {interactive ? (
          <ChevronRight
            className={cn(
              'mr-1 h-3.5 w-3.5 shrink-0 opacity-40 transition-opacity group-hover:opacity-100',
              featured ? 'text-white/40' : 'text-ink-soft/60',
            )}
            aria-hidden
          />
        ) : null}
        {showRemove && onRemove ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              'h-6 w-6',
              featured ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-ink-soft',
            )}
            onClick={(event) => {
              event.stopPropagation()
              onRemove()
            }}
            aria-label={`Remove ${title}`}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        ) : null}
      </header>
      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-3 pt-2">{children}</div>
    </section>
  )
}
