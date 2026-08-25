import { Link } from 'react-router-dom'
import { useSales } from '@/api/hooks'
import { PageState } from '@/components/widget-states'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, formatMoneyPrecise } from '@/lib/format'
import { useState } from 'react'

export function SalesPage() {
  const [page, setPage] = useState(1)
  const query = useSales(page, 25)

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-serif text-3xl tracking-tight">Sales</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Individual tickets: who sold, what was purchased, and when.
        </p>
      </div>

      {query.isLoading ? (
        <div className="space-y-2 rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : null}

      {query.isError ? (
        <PageState
          title="Sales unavailable"
          message={
            query.error instanceof Error
              ? query.error.message
              : 'Could not load sales for this scope.'
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isSuccess && query.data.items.length === 0 ? (
        <PageState
          title="No sales"
          message="There are no tickets in this property scope for the current period."
        />
      ) : null}

      {query.isSuccess && query.data.items.length > 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Sold by</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data.items.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDateTime(sale.soldAt)}
                  </TableCell>
                  <TableCell>{sale.soldBy.name}</TableCell>
                  <TableCell>
                    <div>{sale.item.name}</div>
                    {sale.item.category ? (
                      <div className="text-xs text-muted-foreground">
                        {sale.item.category}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {sale.customerId ? (
                      <Link
                        to={`/customers/${sale.customerId}`}
                        className="hover:underline"
                      >
                        {sale.customerName ?? 'Profile'}
                      </Link>
                    ) : (
                      sale.customerName ?? '—'
                    )}
                  </TableCell>
                  <TableCell>{sale.propertyName}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoneyPrecise(sale.amount, sale.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
            <span>
              {query.data.total} ticket{query.data.total === 1 ? '' : 's'}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page * query.data.pageSize >= query.data.total}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
