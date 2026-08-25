import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useSalesTrend } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatDate, formatMoney, formatNumber, formatPercent } from '@/lib/format'

export function YoyTrendWidget({ weather = false }: { weather?: boolean }) {
  const query = useSalesTrend()

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load trend'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (!query.data?.length) {
    return <WidgetEmpty message="No trend data for this scope yet." />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={query.data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => formatDate(value)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="revenue"
          tickFormatter={(value: number) => formatMoney(value)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={72}
        />
        <YAxis
          yAxisId="rounds"
          orientation="right"
          tickFormatter={(value: number) => formatNumber(value)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          labelFormatter={(label) => formatDate(String(label))}
          formatter={(value, name) => {
            if (name === 'Rounds') return [formatNumber(Number(value)), name]
            if (name === 'Utilization') return [formatPercent(Number(value)), name]
            return [formatMoney(Number(value)), name]
          }}
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="var(--chart-1)"
          dot={false}
          strokeWidth={2}
        />
        {weather ? (
          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="weatherAdjustedRevenue"
            name="Weather-adjusted"
            stroke="var(--chart-2)"
            dot={false}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        ) : (
          <Line
            yAxisId="rounds"
            type="monotone"
            dataKey="rounds"
            name="Rounds"
            stroke="var(--chart-2)"
            dot={false}
            strokeWidth={2}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function UtilizationWidget() {
  const query = useSalesTrend()

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load utilization'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (!query.data?.length) {
    return <WidgetEmpty message="Tee-sheet feed not connected for this period." />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={query.data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => formatDate(value)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[50, 100]}
          tickFormatter={(value: number) => formatPercent(value, 0)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          formatter={(value) => formatPercent(Number(value))}
          labelFormatter={(label) => formatDate(String(label))}
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="utilizationPct"
          name="Utilization"
          stroke="var(--chart-1)"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
