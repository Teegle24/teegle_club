import { useOps } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatMoney, formatNumber } from '@/lib/format'
import type { RankField } from '@/components/widgets/catalog'

export function RankingWidget({ field }: { field: RankField }) {
  const query = useOps()
  const rows = query.data?.[field] ?? []

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load ranking'}
        onRetry={() => void query.refetch()}
      />
    )
  }
  if (rows.length === 0) {
    return <WidgetEmpty message="No items for this period." />
  }

  const showStock = rows.some((row) => row.onHand != null)
  const showAge = rows.some((row) => row.ageDays != null)

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground">
            <th className="pb-2 font-medium">Item</th>
            <th className="pb-2 text-right font-medium">Units</th>
            {showStock ? (
              <th className="pb-2 text-right font-medium">On hand</th>
            ) : (
              <th className="pb-2 text-right font-medium">Sales</th>
            )}
            {showAge ? <th className="pb-2 text-right font-medium">Age</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-border">
              <td className="py-2 pr-3">{row.name}</td>
              <td className="py-2 text-right tabular-nums">{formatNumber(row.units)}</td>
              <td className="py-2 text-right tabular-nums">
                {showStock && row.onHand != null
                  ? formatNumber(row.onHand)
                  : formatMoney(row.amount)}
              </td>
              {showAge ? (
                <td className="py-2 text-right tabular-nums text-muted-foreground">
                  {row.ageDays != null ? `${row.ageDays}d` : '—'}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
