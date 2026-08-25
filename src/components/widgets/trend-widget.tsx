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
import { formatDate, formatMoney } from '@/lib/format'

export function TrendWidget() {
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
          tickFormatter={(value: number) => formatMoney(value)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={72}
        />
        <Tooltip
          formatter={(value) => formatMoney(Number(value))}
          labelFormatter={(label) => formatDate(String(label))}
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="var(--chart-1)" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="gop" name="GOP" stroke="var(--chart-2)" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="payrollCost" name="Payroll" stroke="var(--chart-4)" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
