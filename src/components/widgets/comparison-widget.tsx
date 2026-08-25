import { useComparison } from '@/api/hooks'
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
import { formatMoney, formatNumber, formatPercent } from '@/lib/format'

export function ComparisonWidget() {
  const query = useComparison()

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load comparison'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (!query.data?.length) {
    return <WidgetEmpty message="No courses in this view." />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead className="text-right">Rounds</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Rev / round</TableHead>
          <TableHead className="text-right">Util.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {query.data.map((row) => (
          <TableRow key={row.propertyId}>
            <TableCell className="font-medium">{row.propertyName}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(row.rounds)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatMoney(row.revenue)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatMoney(row.revenuePerRound)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatPercent(row.utilizationPct)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
