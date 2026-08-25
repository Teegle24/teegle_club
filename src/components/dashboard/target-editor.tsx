import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import { formatMoney } from '@/lib/format'
import { parseDollarInput } from '@/lib/targets'
import { cn } from '@/lib/utils'

export function TargetEditor({
  annual,
  periodLabel,
  periodAmount,
  pace,
  editable,
  lockedHint,
  saving,
  dark,
  compact,
  onSave,
}: {
  annual: number | null
  periodLabel: string
  periodAmount: number | null
  pace: string | null
  editable: boolean
  lockedHint?: string
  saving?: boolean
  dark?: boolean
  compact?: boolean
  onSave: (amount: number) => Promise<unknown>
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setDraft(annual != null ? String(annual) : '')
    setError(null)
  }, [annual, open])

  const mute = dark ? 'text-white/60' : 'text-ink-soft'
  const ink = dark ? 'text-white' : 'text-ink'

  async function submit(event: FormEvent) {
    event.preventDefault()
    event.stopPropagation()
    const amount = parseDollarInput(draft)
    if (amount == null) {
      setError('Enter a dollar amount')
      return
    }
    try {
      await onSave(amount)
      setOpen(false)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save')
    }
  }

  function stopNav(event: { stopPropagation: () => void }) {
    event.stopPropagation()
  }

  if (open && editable) {
    return (
      <form
        data-stop-nav
        className="space-y-1.5"
        onClick={stopNav}
        onMouseDown={stopNav}
        onKeyDown={(event: KeyboardEvent<HTMLFormElement>) => event.stopPropagation()}
        onSubmit={submit}
      >
        <label className={cn('block text-[11px]', mute)}>This year’s revenue goal</label>
        <div className="flex items-center gap-1.5">
          <span className={cn('text-[13px]', mute)}>$</span>
          <input
            autoFocus
            inputMode="numeric"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className={cn(
              'h-7 min-w-0 flex-1 rounded border bg-transparent px-2 text-[12px] tabular-nums outline-none',
              dark
                ? 'border-white/20 text-white focus:border-white/50'
                : 'border-input text-ink focus:border-brand',
            )}
            aria-label="This year’s revenue goal"
          />
          <button
            type="submit"
            disabled={saving}
            className={cn(
              'h-7 rounded px-2 text-[11px] font-medium',
              dark ? 'bg-white/15 text-white' : 'bg-brand text-primary-foreground',
            )}
          >
            {saving ? 'Saving' : 'Save'}
          </button>
          <button
            type="button"
            className={cn('h-7 px-1 text-[11px]', mute)}
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
        {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
      </form>
    )
  }

  if (periodAmount == null) {
    if (!editable) {
      return (
        <p className={cn('pt-1 text-[11px]', mute)}>
          {lockedHint ?? 'No revenue goal yet'}
        </p>
      )
    }
    return (
      <button
        type="button"
        data-stop-nav
        className={cn('pt-1 text-left text-[11px] font-medium', dark ? 'text-ice' : 'text-brand')}
        onClick={(event) => {
          event.stopPropagation()
          setOpen(true)
        }}
        onMouseDown={stopNav}
      >
        Set a revenue goal
      </button>
    )
  }

  return (
    <>
      <div className={cn('mb-1 flex items-baseline justify-between gap-2 text-[11px]', mute)}>
        {editable ? (
          <button
            type="button"
            data-stop-nav
            className={cn('min-w-0 truncate text-left hover:underline', ink)}
            onClick={(event) => {
              event.stopPropagation()
              setOpen(true)
            }}
            onMouseDown={stopNav}
          >
            {periodLabel} {formatMoney(periodAmount)}
            {!compact && annual != null && periodAmount !== annual ? (
              <span className={cn('ml-1 font-normal', mute)}>of {formatMoney(annual)}</span>
            ) : null}
          </button>
        ) : (
          <span>
            {periodLabel} {formatMoney(periodAmount)}
          </span>
        )}
        {pace ? <span className="shrink-0 tabular-nums">{pace}</span> : null}
      </div>
    </>
  )
}
