import { missingConfig } from '@/lib/utils'

export function ConfigError() {
  const missing = missingConfig()

  return (
    <div className="flex min-h-svh items-center justify-center bg-sidebar px-6 text-sidebar-foreground">
      <div className="max-w-lg rounded-xl border border-white/10 bg-white/5 p-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-sidebar-muted">
          Teegle Club
        </p>
        <h1 className="mt-2 font-serif text-3xl">Environment not configured</h1>
        <p className="mt-3 text-sm text-sidebar-muted">
          This dashboard talks to a separate REST API and Clerk. Copy
          <code className="mx-1 rounded bg-black/30 px-1.5 py-0.5 text-xs">
            .env.example
          </code>
          to
          <code className="mx-1 rounded bg-black/30 px-1.5 py-0.5 text-xs">
            .env
          </code>
          and set:
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {missing.map((name) => (
            <li key={name} className="rounded-md bg-black/20 px-3 py-2 font-mono text-xs">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
