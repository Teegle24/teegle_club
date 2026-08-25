import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('mb-4', className)}>
      {eyebrow ? (
        <div className="mb-2 flex items-center gap-2.5">
          <span className="h-px w-6 bg-brand" />
          <span className="label text-brand">{eyebrow}</span>
        </div>
      ) : null}
      <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      ) : null}
    </div>
  )
}
