import { Link } from 'react-router-dom'
import { useRecentSales } from '@/api/hooks'
import {
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from '@/components/widget-states'
import { formatDateTime, formatMoneyPrecise } from '@/lib/format'

export function RecentSalesWidget() {
  const query = useRecentSales(8)

  if (query.isLoading) return <WidgetLoading />
  if (query.isError) {
    return (
      <WidgetError
        message={query.error instanceof Error ? query.error.message : 'Could not load sales'}
        onRetry={() => void query.refetch()}
      />
    )
  }

  const items = query.data?.items ?? []
  if (items.length === 0) {
    return <WidgetEmpty message="No sales in this view yet." />
  }

  return (
    <ul className="h-full space-y-3 overflow-auto pr-1">
      {items.map((sale) => (
        <li key={sale.id} className="border-b border-border pb-3 last:border-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-sm font-medium">{sale.item.name}</p>
            <p className="shrink-0 text-sm tabular-nums">
              {formatMoneyPrecise(sale.amount, sale.currency)}
            </p>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {sale.soldBy.name}
            {sale.customerName ? ` · ${sale.customerName}` : ''}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {formatDateTime(sale.soldAt)}
            {sale.customerId ? (
              <>
                {' · '}
                <Link
                  to={`/customers/${sale.customerId}`}
                  className="underline-offset-2 hover:underline"
                >
                  Profile
                </Link>
              </>
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  )
}
