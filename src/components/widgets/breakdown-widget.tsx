import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useBreakdown } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatMoney, formatNumber, formatPercent } from '@/lib/format'
import type { MetricsBreakdown } from '@/types'

export function BreakdownWidget({
  field,
  format = 'money',
  showMargin = false,
}: {
  field: keyof MetricsBreakdown
  format?: 'money' | 'number' | 'percent'
  showMargin?: boolean
}) {
  const query = useBreakdown()
  const rows = query.data?.[field] ?? []

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load breakdown'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (rows.length === 0) {
    return <WidgetEmpty message="No mix data for this scope yet." />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(value: number) =>
            format === 'money'
              ? formatMoney(value)
              : format === 'percent'
                ? formatPercent(value, 0)
                : formatNumber(value)
          }
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={118}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value, _name, item) => {
            const payload = item?.payload as { marginPct?: number; sharePct?: number }
            const main =
              format === 'money'
                ? formatMoney(Number(value))
                : format === 'percent'
                  ? formatPercent(Number(value))
                  : formatNumber(Number(value))
            const extra = showMargin && payload.marginPct != null
              ? ` · ${formatPercent(payload.marginPct)} margin`
              : payload.sharePct != null
                ? ` · ${formatPercent(payload.sharePct)}`
                : ''
            return [`${main}${extra}`, '']
          }}
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar dataKey="amount" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
