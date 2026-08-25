import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useAccess } from '@/api/hooks/use-access'
import type { Access, Property, PropertyScope } from '@/types'
import { isPropertyAllowed } from '@/types'

const STORAGE_KEY = 'teegle-club.property-scope'
const EMPTY_PROPERTIES: Property[] = []

interface PropertyScopeValue {
  access: Access | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
  scope: PropertyScope
  setScope: (scope: PropertyScope) => void
  allowedPropertyIds: string[]
  properties: Property[]
  selectedProperty: Property | undefined
  isRollup: boolean
}

const PropertyScopeContext = createContext<PropertyScopeValue | null>(null)

function parseStoredScope(
  raw: string | null,
  allowedPropertyIds: string[],
): PropertyScope {
  if (!raw) return { type: 'rollup' }
  try {
    const parsed = JSON.parse(raw) as PropertyScope
    if (parsed.type === 'rollup') return { type: 'rollup' }
    if (parsed.type === 'property' && parsed.propertyId) {
      if (
        allowedPropertyIds.length === 0 ||
        isPropertyAllowed(parsed, allowedPropertyIds)
      ) {
        return parsed
      }
    }
  } catch {
    return { type: 'rollup' }
  }
  return { type: 'rollup' }
}

export function PropertyScopeProvider({ children }: { children: ReactNode }) {
  const accessQuery = useAccess()
  const properties = accessQuery.data?.properties ?? EMPTY_PROPERTIES
  const allowedPropertyIds = useMemo(
    () => properties.map((property) => property.id),
    [properties],
  )

  const [scope, setScopeState] = useState<PropertyScope>(() =>
    parseStoredScope(localStorage.getItem(STORAGE_KEY), []),
  )

  const setScope = useCallback(
    (next: PropertyScope) => {
      if (!isPropertyAllowed(next, allowedPropertyIds) && next.type === 'property') {
        return
      }
      setScopeState(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    },
    [allowedPropertyIds],
  )

  const resolvedScope = useMemo(() => {
    if (!accessQuery.data) return scope
    if (scope.type === 'property' && !isPropertyAllowed(scope, allowedPropertyIds)) {
      return { type: 'rollup' } satisfies PropertyScope
    }
    return scope
  }, [accessQuery.data, allowedPropertyIds, scope])

  const selectedProperty = properties.find(
    (property) =>
      resolvedScope.type === 'property' && property.id === resolvedScope.propertyId,
  )

  const value = useMemo<PropertyScopeValue>(
    () => ({
      access: accessQuery.data,
      isLoading: accessQuery.isLoading,
      error: accessQuery.error instanceof Error ? accessQuery.error : null,
      refetch: () => {
        void accessQuery.refetch()
      },
      scope: resolvedScope,
      setScope,
      allowedPropertyIds,
      properties,
      selectedProperty,
      isRollup: resolvedScope.type === 'rollup',
    }),
    [
      accessQuery.data,
      accessQuery.error,
      accessQuery.isLoading,
      accessQuery.refetch,
      allowedPropertyIds,
      properties,
      resolvedScope,
      selectedProperty,
      setScope,
    ],
  )

  return (
    <PropertyScopeContext.Provider value={value}>
      {children}
    </PropertyScopeContext.Provider>
  )
}

export function usePropertyScope() {
  const context = useContext(PropertyScopeContext)
  if (!context) {
    throw new Error('usePropertyScope must be used within PropertyScopeProvider')
  }
  return context
}
