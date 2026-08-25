import type { GridWidgetLayout, SizeTier } from '@/types'

export const GRID_COLS = 12

export const SIZE_TIERS: Record<
  SizeTier,
  { w: number; h: number; label: string; perRow: number }
> = {
  sm: { w: 2, h: 4, label: 'Small', perRow: 6 },
  md: { w: 3, h: 4, label: 'Medium', perRow: 4 },
  lg: { w: 4, h: 4, label: 'Large', perRow: 3 },
  half: { w: 6, h: 6, label: 'Half width', perRow: 2 },
  full: { w: 12, h: 8, label: 'Full width', perRow: 1 },
}

export function lockedLayout(id: string, tier: SizeTier): GridWidgetLayout {
  const { w, h } = SIZE_TIERS[tier]
  return {
    i: id,
    x: 0,
    y: 0,
    w,
    h,
    minW: w,
    maxW: w,
    minH: h,
    maxH: h,
  }
}

export function packWidgets(
  ids: string[],
  resolveTier: (id: string) => SizeTier,
): GridWidgetLayout[] {
  let x = 0
  let y = 0
  let rowHeight = 0
  const placed: GridWidgetLayout[] = []

  for (const id of ids) {
    const { w, h } = SIZE_TIERS[resolveTier(id)]
    if (x + w > GRID_COLS) {
      y += rowHeight
      x = 0
      rowHeight = 0
    }
    placed.push({
      i: id,
      x,
      y,
      w,
      h,
      minW: w,
      maxW: w,
      minH: h,
      maxH: h,
    })
    x += w
    rowHeight = Math.max(rowHeight, h)
  }

  return placed
}
