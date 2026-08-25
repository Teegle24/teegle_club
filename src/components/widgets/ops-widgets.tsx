import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMetrics, useOps } from '@/api/hooks'
import { ComparedBlock } from '@/components/dashboard/compared-block'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatMoney, formatNumber, formatPercent } from '@/lib/format'
import { LeagueWidget, MembershipWidget, NewRepeatWidget } from '@/components/widgets/stat-widgets'

export { LeagueWidget, MembershipWidget, NewRepeatWidget }

export function CompsWidget() {
  const query = useMetrics()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load comps'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <ComparedBlock value={query.data.compsDollars} format="money" invert size="md" />
      <p className="text-xs text-muted-foreground">
        {formatPercent(query.data.compsPct.current)} of revenue
      </p>
    </div>
  )
}

export function NoShowsWidget() {
  const query = useMetrics()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load no-shows'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return (
    <div className="flex h-full flex-col justify-between">
      <ComparedBlock value={query.data.noShowCount} format="number" invert size="md" />
      <p className="text-xs text-muted-foreground">
        {formatMoney(query.data.noShowRevenue.current)} lost green fees
      </p>
    </div>
  )
}

export function LoyaltyWidget() {
  const query = useMetrics()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load loyalty'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  return (
    <dl className="flex h-full flex-col justify-between">
      <div>
        <dt className="text-xs text-muted-foreground">Enrollment</dt>
        <dd className="text-2xl font-semibold tabular-nums">
          {formatPercent(query.data.loyaltyEnrollmentPct.current)}
        </dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">Redemption</dt>
        <dd className="text-xl tabular-nums">
          {formatPercent(query.data.loyaltyRedemptionPct.current)}
        </dd>
      </div>
    </dl>
  )
}

export function PaceWindowsWidget() {
  const query = useOps()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load pace'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  const rows = query.data?.bookingPaceWindows ?? []
  if (!rows.length) return <WidgetEmpty message="No advance bookings on the books." />

  return (
    <ul className="flex h-full flex-col justify-between">
      {rows.map((row) => {
        const delta = row.prior ? ((row.current - row.prior) / row.prior) * 100 : 0
        return (
          <li key={row.days} className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted-foreground">Next {row.days} days</span>
            <span className="text-right">
              <span className="text-lg font-semibold tabular-nums">{formatNumber(row.current)}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {delta >= 0 ? '+' : ''}
                {delta.toFixed(1)}% vs last period
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function MixTrendWidget() {
  const query = useOps()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data?.bookingMixTrend.length) {
    return query.isError ? (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load mix'}
        onRetry={() => void query.refetch()}
      />
    ) : (
      <WidgetEmpty message="No booking-mix history yet." />
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={query.data.bookingMixTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => formatDate(value)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value: number) => formatPercent(value, 0)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          labelFormatter={(label) => formatDate(String(label))}
          formatter={(value, name) => [formatPercent(Number(value)), String(name)]}
          contentStyle={tooltipStyle}
        />
        <Line type="monotone" dataKey="online" name="Online" stroke="var(--chart-1)" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="phone" name="Phone" stroke="var(--chart-2)" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="walkIn" name="Walk-in" stroke="var(--chart-3)" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="thirdParty" name="3rd party" stroke="var(--chart-4)" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function LeadTrendWidget() {
  const query = useOps()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data?.leadTimeTrend.length) {
    return query.isError ? (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load lead time'}
        onRetry={() => void query.refetch()}
      />
    ) : (
      <WidgetEmpty message="No lead-time history yet." />
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={query.data.leadTimeTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => formatDate(value)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          labelFormatter={(label) => formatDate(String(label))}
          formatter={(value) => [`${Number(value).toFixed(1)} days`, 'Lead time']}
          contentStyle={tooltipStyle}
        />
        <Line type="monotone" dataKey="days" stroke="var(--chart-1)" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SeasonalUtilitiesWidget() {
  const query = useOps()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data?.seasonalUtilities.length) {
    return query.isError ? (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load utilities'}
        onRetry={() => void query.refetch()}
      />
    ) : (
      <WidgetEmpty message="Utility meters are not connected." />
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={query.data.seasonalUtilities} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value: number) => formatMoney(value)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          formatter={(value, name) => [formatMoney(Number(value)), String(name)]}
          contentStyle={tooltipStyle}
        />
        <Line type="monotone" dataKey="water" name="Water" stroke="var(--chart-1)" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="electric" name="Electric" stroke="var(--chart-2)" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="fuel" name="Fuel" stroke="var(--chart-3)" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function StaffingWidget() {
  const query = useOps()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load staffing'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  const rows = query.data?.staffing ?? []
  if (!rows.length) return <WidgetEmpty message="Time clock feed is not connected." />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead className="text-right">Scheduled</TableHead>
          <TableHead className="text-right">Actual</TableHead>
          <TableHead className="text-right">OT hrs</TableHead>
          <TableHead className="text-right">Cost / budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.department}>
            <TableCell>{row.department}</TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(row.scheduledHours)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(row.actualHours)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(row.overtimeHours)}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatMoney(row.cost)}
              <span className="text-muted-foreground"> / {formatMoney(row.budget)}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function FleetWidget() {
  const query = useOps()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load fleet'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  const rows = query.data?.fleet ?? []
  if (!rows.length) return <WidgetEmpty message="Equipment log is not connected." />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead className="text-right">Age</TableHead>
          <TableHead className="text-right">Downtime</TableHead>
          <TableHead className="text-right">Flag</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell className="text-right tabular-nums">{row.ageYears} yrs</TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(row.downtimeHours)} hrs</TableCell>
            <TableCell className="text-right text-xs">
              {row.replacementDue ? <span className="text-destructive">Replace</span> : 'OK'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function WeatherEventsWidget() {
  const query = useOps()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load events'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  const rows = query.data?.weatherEvents ?? []
  if (!rows.length) return <WidgetEmpty message="No weather events logged." />

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.id} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
          <div>
            <p className="text-sm">{row.label}</p>
            <p className="text-xs text-muted-foreground">{formatDate(row.date)}</p>
          </div>
          <p className="tabular-nums">{formatMoney(row.cost)}</p>
        </li>
      ))}
    </ul>
  )
}

export function MaintLaborWidget() {
  const query = useOps()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError || !query.data) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load hours'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  const pct = query.data.maintLaborBudgetHours
    ? (query.data.maintLaborHours / query.data.maintLaborBudgetHours) * 100
    : 0
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="text-2xl font-semibold tabular-nums">{formatNumber(query.data.maintLaborHours)}</p>
      <p className="text-xs text-muted-foreground">
        {formatPercent(pct, 0)} of {formatNumber(query.data.maintLaborBudgetHours)} budgeted hours
      </p>
    </div>
  )
}

export function CourseCategoryWidget() {
  const query = useOps()
  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load courses'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  const rows = query.data?.courseCategory ?? []
  if (!rows.length) return <WidgetEmpty message="Need more than one linked course." />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead className="text-right">F&B</TableHead>
          <TableHead className="text-right">Maintenance</TableHead>
          <TableHead className="text-right">Labor %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.propertyId}>
            <TableCell>{row.propertyName}</TableCell>
            <TableCell className="text-right tabular-nums">{formatMoney(row.fb)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatMoney(row.maintenance)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatPercent(row.laborPct)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const tooltipStyle = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  fontSize: 12,
}
