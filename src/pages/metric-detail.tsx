import { Link, useParams } from 'react-router-dom'
import { PeriodPicker } from '@/components/dashboard/period-picker'
import { SectionHeading } from '@/components/dashboard/section-heading'
import {
  categoryIcon,
  categoryLabel,
  isWidgetId,
  widgetById,
} from '@/components/widgets/catalog'
import { renderWidgetContent } from '@/components/widgets/widget-renderer'
import { WidgetFrame } from '@/components/widgets/widget-frame'
import { PageState } from '@/components/widget-states'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePropertyScope } from '@/context/property-scope'

const DETAIL_NOTES: Partial<Record<string, string>> = {
  revenue:
    'Total revenue rolls up green fees, carts, F&B, pro shop, lessons, and memberships for the selected period. Click the plan line on the tile to set this year’s dollar goal. Month, week, and today are a linear slice of that year. Compare vs prior and last year separately from the goal.',
  rounds:
    'Rounds played drives utilization and labor planning. A drop here often preceds revenue softness unless revenue per round is rising.',
  utilization:
    'Utilization is booked rounds divided by available tee capacity. Weather, pricing, and booking mix all move this number.',
  'channel-revenue':
    'Channel mix shows where demand originates. Over-reliance on third-party tee sheets can compress margin even when top-line revenue looks fine.',
  category:
    'Category mix reveals which profit centers carry the property. Watch F&B and shop attach when rounds are flat.',
}

export function MetricDetailPage() {
  const { widgetId } = useParams()
  const { isRollup, selectedProperty } = usePropertyScope()

  if (!widgetId || !isWidgetId(widgetId)) {
    return (
      <div className="space-y-4">
        <PageState
          title="Metric not found"
          message="That metric is not in the catalog."
        />
        <Button asChild size="sm">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    )
  }

  const widget = widgetById(widgetId)
  if (!widget) {
    return (
      <div className="space-y-4">
        <PageState
          title="Metric not found"
          message="That metric is not in the catalog."
        />
        <Button asChild size="sm">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    )
  }

  const notes = DETAIL_NOTES[widgetId] ?? widget.description

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Button asChild size="sm" variant="ghost" className="-ml-2 mb-2">
            <Link to="/">← Dashboard</Link>
          </Button>
          <SectionHeading
            eyebrow={categoryLabel(widget.category)}
            title={widget.title}
            description={
              isRollup
                ? 'All linked properties · aggregated view'
                : selectedProperty?.name
            }
          />
        </div>
        <PeriodPicker />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <WidgetFrame
            widgetId={widgetId}
            title={widget.title}
            icon={categoryIcon(widget.category)}
            interactive={false}
            showRemove={false}
            featured={widgetId === 'budget'}
            className="min-h-[22rem]"
          >
            {renderWidgetContent(widgetId, widgetId === 'budget')}
          </WidgetFrame>
        </div>

        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">What this shows</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-ink-soft">
              {widget.description}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">How to read it</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-ink-soft">
              <p>{notes}</p>
              <p>
                Use the period picker to compare today, week-to-date, month-to-date, or
                year-to-date. Prior period and last year baselines help separate seasonality
                from real operational change.
              </p>
            </CardContent>
          </Card>

          <Card className="border-brand/20 bg-brand/5">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-brand">
                {widget.tier === 'hl' ? 'High-level KPI' : 'Detail metric'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-ink-soft">
              {widget.tier === 'hl'
                ? 'This metric appears in the At a glance row on your dashboard.'
                : 'This metric appears under its category section in Detail metrics on your dashboard.'}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
