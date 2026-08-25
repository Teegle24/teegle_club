import type { WidgetId, WidgetKind } from '@/components/widgets/catalog'
import { widgetById } from '@/components/widgets/catalog'
import { BreakdownWidget } from '@/components/widgets/breakdown-widget'
import { BudgetWidget } from '@/components/widgets/budget-widget'
import { ComparedKpiWidget } from '@/components/widgets/compared-kpi'
import { ComparisonWidget } from '@/components/widgets/comparison-widget'
import { HeatmapWidget } from '@/components/widgets/heatmap-widget'
import { OpportunityWidget } from '@/components/widgets/opportunity-widget'
import {
  CompsWidget,
  CourseCategoryWidget,
  FleetWidget,
  LeadTrendWidget,
  LeagueWidget,
  LoyaltyWidget,
  MaintLaborWidget,
  MembershipWidget,
  MixTrendWidget,
  NewRepeatWidget,
  NoShowsWidget,
  PaceWindowsWidget,
  SeasonalUtilitiesWidget,
  StaffingWidget,
  WeatherEventsWidget,
} from '@/components/widgets/ops-widgets'
import { RankingWidget } from '@/components/widgets/ranking-widget'
import { UtilizationWidget, YoyTrendWidget } from '@/components/widgets/trend-widget'

function renderKind(kind: WidgetKind) {
  switch (kind.kind) {
    case 'kpi':
      return (
        <ComparedKpiWidget
          metric={kind.metric}
          format={kind.format}
          invert={kind.invert}
        />
      )
    case 'breakdown':
      return (
        <BreakdownWidget
          field={kind.field}
          format={kind.format}
          showMargin={kind.showMargin}
        />
      )
    case 'ranking':
      return <RankingWidget field={kind.field} />
    case 'heatmap':
      return <HeatmapWidget />
    case 'yoy':
      return <YoyTrendWidget />
    case 'weather':
      return <YoyTrendWidget weather />
    case 'budget':
      return <BudgetWidget />
    case 'comparison':
      return <ComparisonWidget />
    case 'course-category':
      return <CourseCategoryWidget />
    case 'opportunities':
      return <OpportunityWidget />
    case 'utilization-trend':
      return <UtilizationWidget />
    case 'pace-windows':
      return <PaceWindowsWidget />
    case 'mix-trend':
      return <MixTrendWidget />
    case 'lead-trend':
      return <LeadTrendWidget />
    case 'staffing':
      return <StaffingWidget />
    case 'fleet':
      return <FleetWidget />
    case 'seasonal-utilities':
      return <SeasonalUtilitiesWidget />
    case 'weather-events':
      return <WeatherEventsWidget />
    case 'new-repeat':
      return <NewRepeatWidget />
    case 'loyalty':
      return <LoyaltyWidget />
    case 'league':
      return <LeagueWidget />
    case 'membership':
      return <MembershipWidget />
    case 'maint-labor':
      return <MaintLaborWidget />
    case 'comps':
      return <CompsWidget />
    case 'no-shows':
      return <NoShowsWidget />
    default:
      return null
  }
}

export function renderWidgetContent(
  id: WidgetId,
  featured = false,
  dark = featured,
  compact = false,
) {
  const widget = widgetById(id)
  if (!widget) return null
  if (widget.render.kind === 'budget') {
    return <BudgetWidget dark={dark} compact={compact} />
  }
  if (widget.render.kind === 'kpi') {
    return (
      <ComparedKpiWidget
        metric={widget.render.metric}
        format={widget.render.format}
        invert={widget.render.invert}
        dark={dark}
        compact={compact}
      />
    )
  }
  return renderKind(widget.render)
}
