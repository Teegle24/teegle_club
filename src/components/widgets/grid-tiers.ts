import type { GridWidgetLayout, SizeTier } from '@/types'

export const GLANCE_ROW_HEIGHT = 264
export const GLANCE_GRID_MARGIN: [number, number] = [12, 12]

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

export const COL_SPAN: Record<number, string> = {
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
  12: 'col-span-12',
}

export const TILE_MIN_HEIGHT: Record<SizeTier, string> = {
  sm: 'min-h-[8rem]',
  md: 'min-h-[9.5rem]',
  lg: 'min-h-[10rem]',
  half: 'min-h-[14rem]',
  full: 'min-h-[18rem]',
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

export function isSmallDetailTier(tier: SizeTier) {
  return tier === 'sm' || tier === 'md'
}

export function packGlanceLayout(ids: string[], cols: number): GridWidgetLayout[] {
  return ids.map((id, index) => ({
    i: id,
    x: index % cols,
    y: Math.floor(index / cols),
    w: 1,
    h: 1,
    minW: 1,
    maxW: 1,
    minH: 1,
    maxH: 1,
  }))
}

export function orderFromLayout(layout: { i: string; x: number; y: number }[]): string[] {
  return [...layout].sort((a, b) => a.y - b.y || a.x - b.x).map((item) => item.i)
}

export type DetailBand<T extends string = string> =
  | { kind: 'full'; id: T }
  | { kind: 'split'; smalls: T[]; larges: T[] }

/** Two small tiles stacked on the left, larger charts on the right. Extra larges pair two-up. */
export function packDetailBands<T extends string>(
  ids: T[],
  resolveTier: (id: T) => SizeTier,
): DetailBand<T>[] {
  const smalls: T[] = []
  const larges: T[] = []
  const bands: DetailBand<T>[] = []

  const flush = () => {
    while (smalls.length > 0 || larges.length > 0) {
      if (smalls.length === 0) {
        bands.push({ kind: 'split', smalls: [], larges: larges.splice(0, 2) })
        continue
      }
      bands.push({
        kind: 'split',
        smalls: smalls.splice(0, 2),
        larges: larges.splice(0, 1),
      })
    }
  }

  for (const id of ids) {
    const tier = resolveTier(id)
    if (tier === 'full') {
      flush()
      bands.push({ kind: 'full', id })
      continue
    }
    if (isSmallDetailTier(tier)) smalls.push(id)
    else larges.push(id)
  }
  flush()
  return bands
}

function lockedItem(id: string, x: number, y: number, w: number, h: number): GridWidgetLayout {
  return { i: id, x, y, w, h, minW: w, maxW: w, minH: h, maxH: h }
}

export function packWidgets(
  ids: string[],
  resolveTier: (id: string) => SizeTier,
): GridWidgetLayout[] {
  const bands = packDetailBands(ids, resolveTier)
  const placed: GridWidgetLayout[] = []
  let y = 0

  for (const band of bands) {
    if (band.kind === 'full') {
      const { w, h } = SIZE_TIERS.full
      placed.push(lockedItem(band.id, 0, y, w, h))
      y += h
      continue
    }

    const { smalls, larges } = band
    if (smalls.length === 0) {
      larges.forEach((id, index) => {
        placed.push(lockedItem(id, index * 6, y, 6, 6))
      })
      y += 6
      continue
    }

    const rows = Math.max(smalls.length, 1)
    const rowH = 3
    smalls.forEach((id, index) => {
      placed.push(lockedItem(id, 0, y + index * rowH, 3, rowH))
    })
    larges.forEach((id) => {
      placed.push(lockedItem(id, 3, y, 9, rows * rowH))
    })
    y += rows * rowH
  }

  return placed
}
