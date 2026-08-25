import { Link, useParams } from 'react-router-dom'
import { useCustomer } from '@/api/hooks'
import { PageState } from '@/components/widget-states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, formatMoney, formatMoneyPrecise, formatNumber } from '@/lib/format'

export function CustomerProfilePage() {
  const { customerId } = useParams()
  const query = useCustomer(customerId)

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (query.isError) {
    return (
      <PageState
        title="Profile unavailable"
        message={
          query.error instanceof Error
            ? query.error.message
            : 'Could not load this customer.'
        }
        onRetry={() => void query.refetch()}
      />
    )
  }

  const customer = query.data
  if (!customer) {
    return (
      <PageState
        title="Customer not found"
        message="This profile is not in the courses linked to your account."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button asChild size="sm" variant="ghost" className="-ml-2 mb-2">
            <Link to="/customers">← Customers</Link>
          </Button>
          <h1 className="font-serif text-3xl tracking-tight">{customer.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer.propertyName}
            {customer.email ? ` · ${customer.email}` : ''}
            {customer.phone ? ` · ${customer.phone}` : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Lifetime value
            </CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">
            {formatMoney(customer.lifetimeValue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Visits
            </CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl">
            {formatNumber(customer.visitCount)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Last visit
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            {formatDateTime(customer.lastVisitAt)}
          </CardContent>
        </Card>
      </div>

      {customer.preferredItems?.length ? (
        <div className="flex flex-wrap gap-2">
          {customer.preferredItems.map((item) => (
            <Badge key={item} variant="gold">
              {item}
            </Badge>
          ))}
        </div>
      ) : null}

      {customer.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {customer.notes}
          </CardContent>
        </Card>
      ) : null}

      <div>
        <h2 className="mb-3 font-serif text-xl">Purchases</h2>
        {customer.purchases.length === 0 ? (
          <PageState
            title="No purchases"
            message="This profile has no ticket history in the current scope."
          />
        ) : (
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Sold by</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.purchases.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(sale.soldAt)}
                    </TableCell>
                    <TableCell>{sale.soldBy.name}</TableCell>
                    <TableCell>{sale.item.name}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoneyPrecise(sale.amount, sale.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
