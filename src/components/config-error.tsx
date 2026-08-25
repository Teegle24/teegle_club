import { missingConfig } from '@/lib/utils'

export function ConfigError() {
  const missing = missingConfig()

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-lg rounded-xl border border-border bg-card p-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Teegle Club
        </p>
        <h1 className="mt-2 text-xl font-semibold">Environment not configured</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This dashboard talks to a separate REST API and Clerk. Copy
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
            .env.example
          </code>
          to
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
            .env
          </code>
          and set the keys below. To click around without an API, set
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
            VITE_USE_MOCK=true
          </code>
          instead.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {missing.map((name) => (
            <li key={name} className="rounded-md bg-muted px-3 py-2 font-mono text-xs">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
