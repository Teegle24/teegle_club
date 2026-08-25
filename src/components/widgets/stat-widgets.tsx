import { useCosts, useMetrics, usePipeline } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatMoney, formatNumber, formatPercent } from '@/lib/format'

export function BookingPaceWidget() {
  const query = usePipeline()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load pace'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (!query.data) return <WidgetEmpty message="No advance bookings on the books." />

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <p className="text-2xl font-semibold tabular-nums">
          {formatNumber(query.data.advanceRounds)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">rounds booked forward</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {formatMoney(query.data.advanceRevenue)} on the books
      </p>
    </div>
  )
}

export function CaptureWidget() {
  const query = useMetrics()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load attach rates'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return (
    <dl className="grid h-full grid-cols-1 content-between gap-4">
      <div>
        <dt className="text-xs text-muted-foreground">
          F&B capture
        </dt>
        <dd className="text-2xl font-semibold tabular-nums">
          {formatPercent(query.data.fbCapturePct.current)}
        </dd>
        <p className="text-xs text-muted-foreground">rounds that bought food or drink</p>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">
          Cart attach
        </dt>
        <dd className="text-2xl font-semibold tabular-nums">
          {formatPercent(query.data.cartAttachPct.current)}
        </dd>
        <p className="text-xs text-muted-foreground">rounds that hit the beverage cart</p>
      </div>
    </dl>
  )
}

export function NewRepeatWidget() {
  const query = usePipeline()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load mix'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return (
    <dl className="flex h-full flex-col justify-between">
      <div>
        <dt className="text-xs text-muted-foreground">
          Repeat
        </dt>
        <dd className="text-2xl font-semibold tabular-nums">
          {formatPercent(query.data.repeatGolferPct)}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">
          New
        </dt>
        <dd className="text-xl tabular-nums">{formatPercent(query.data.newGolferPct)}</dd>
      </div>
    </dl>
  )
}

export function MembershipWidget() {
  const query = usePipeline()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load membership'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return (
    <dl className="flex h-full flex-col justify-between">
      <div>
        <dt className="text-xs text-muted-foreground">
          Renewal
        </dt>
        <dd className="text-2xl font-semibold tabular-nums">
          {formatPercent(query.data.membershipRenewalPct)}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">
          New enrollment
        </dt>
        <dd className="text-xl tabular-nums">
          {formatPercent(query.data.membershipEnrollmentPct)}
        </dd>
      </div>
    </dl>
  )
}

export function LeagueWidget() {
  const query = usePipeline()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load pipeline'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="text-2xl font-semibold tabular-nums">
        {formatMoney(query.data.leagueOutingRevenue)}
      </p>
      <p className="text-xs text-muted-foreground">
        League and outing revenue in this period
      </p>
    </div>
  )
}

export function CostsWidget() {
  const query = useCosts()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load margins'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return (
    <dl className="flex h-full flex-col justify-between text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Pro shop margin</dt>
        <dd className="tabular-nums">{formatPercent(query.data.proShopMarginPct)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">F&B margin</dt>
        <dd className="tabular-nums">{formatPercent(query.data.fbMarginPct)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Labor</dt>
        <dd className="tabular-nums">{formatPercent(query.data.laborPct)}</dd>
      </div>
    </dl>
  )
}

export function MaintenanceWidget() {
  const query = useCosts()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load spend'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return (
    <dl className="flex h-full flex-col justify-between">
      <div>
        <dt className="text-xs text-muted-foreground">
          Maintenance
        </dt>
        <dd className="text-2xl font-semibold tabular-nums">
          {formatMoney(query.data.maintenanceSpend)}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">
          Capex
        </dt>
        <dd className="text-xl tabular-nums">{formatMoney(query.data.capexSpend)}</dd>
      </div>
    </dl>
  )
}
