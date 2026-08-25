import { usePropertyScope } from '@/context/property-scope'
import { membershipLabel } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export function PropertySwitcher() {
  const {
    access,
    isLoading,
    error,
    refetch,
    scope,
    setScope,
    properties,
  } = usePropertyScope()

  if (isLoading) {
    return <Skeleton className="h-9 w-full bg-white/10" />
  }

  if (error) {
    return (
      <button
        type="button"
        onClick={refetch}
        className="w-full rounded-md border border-white/15 px-3 py-2 text-left text-xs text-red-300"
      >
        Couldn’t load courses. Retry
      </button>
    )
  }

  if (!access || properties.length === 0) {
    return (
      <p className="rounded-md border border-white/10 px-3 py-2 text-xs text-sidebar-muted">
        No courses linked to this account.
      </p>
    )
  }

  const value = scope.type === 'rollup' ? 'rollup' : scope.propertyId

  return (
    <div className="space-y-1.5">
      <p className="px-0.5 text-[11px] text-sidebar-muted">
        {access.organization.name}
      </p>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next === 'rollup') {
            setScope({ type: 'rollup' })
            return
          }
          setScope({ type: 'property', propertyId: next })
        }}
      >
        <SelectTrigger className="h-9 border-white/15 bg-white/5 text-sidebar-foreground hover:bg-white/10">
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rollup">
            All properties ({properties.length})
          </SelectItem>
          <SelectSeparator />
          {properties.map((property) => {
            const label = membershipLabel(
              access.memberships.find((item) => item.propertyId === property.id)
                ?.label,
            )
            return (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
                {label ? ` · ${label}` : ''}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
