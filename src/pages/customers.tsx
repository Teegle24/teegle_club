import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCustomers } from '@/api/hooks'
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
import { formatDateTime, formatMoney, formatNumber } from '@/lib/format'

export function CustomersPage() {
  const [page, setPage] = useState(1)
  const query = useCustomers(page, 25)

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-serif text-3xl tracking-tight">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Profiles for guests and members in the current property scope.
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
          title="Customers unavailable"
          message={
            query.error instanceof Error
              ? query.error.message
              : 'Could not load customers for this scope.'
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isSuccess && query.data.items.length === 0 ? (
        <PageState
          title="No customers"
          message="No customer profiles are linked to the courses you can access."
        />
      ) : null}

      {query.isSuccess && query.data.items.length > 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Last visit</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead className="text-right">Lifetime value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data.items.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link
                      to={`/customers/${customer.id}`}
                      className="font-medium hover:underline"
                    >
                      {customer.name}
                    </Link>
                    {customer.email ? (
                      <div className="text-xs text-muted-foreground">
                        {customer.email}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>{customer.propertyName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(customer.lastVisitAt)}
                  </TableCell>
                  <TableCell>{formatNumber(customer.visitCount)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(customer.lifetimeValue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
            <span>
              {query.data.total} customer{query.data.total === 1 ? '' : 's'}
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
