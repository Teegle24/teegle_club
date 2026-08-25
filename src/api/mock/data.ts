import type { Access, Customer, CustomerProfile, Sale } from '@/types'

export const ORG_ID = 'org_high_desert'
export const PINE_RIDGE = 'prop_pine_ridge'
export const MILL_CREEK = 'prop_mill_creek'

export const access: Access = {
  userId: 'user_demo',
  organization: {
    id: ORG_ID,
    name: 'High Desert Golf Group',
  },
  properties: [
    {
      id: PINE_RIDGE,
      name: 'Pine Ridge Golf Club',
      organizationId: ORG_ID,
    },
    {
      id: MILL_CREEK,
      name: 'Mill Creek Country Club',
      organizationId: ORG_ID,
    },
  ],
  memberships: [
    { propertyId: PINE_RIDGE, label: 'gm' },
    { propertyId: MILL_CREEK, label: 'owner' },
  ],
}

const propertyNames: Record<string, string> = {
  [PINE_RIDGE]: 'Pine Ridge Golf Club',
  [MILL_CREEK]: 'Mill Creek Country Club',
}

function daysAgo(days: number, hours = 10, minutes = 0) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

export const metricsByProperty: Record<
  string,
  { gop: number; totalRevenue: number; payrollCost: number }
> = {
  [PINE_RIDGE]: { gop: 312_400, totalRevenue: 842_150, payrollCost: 198_600 },
  [MILL_CREEK]: { gop: 187_250, totalRevenue: 511_980, payrollCost: 141_200 },
}

export const period = {
  from: daysAgo(29, 0, 0),
  to: daysAgo(0, 23, 59),
}

function trendForProperty(
  propertyId: string,
  seed: { revenue: number; gop: number; payroll: number },
) {
  return Array.from({ length: 12 }, (_, index) => {
    const week = 11 - index
    const swing = 1 + Math.sin(index * 0.7 + seed.revenue) * 0.12
    return {
      date: daysAgo(week * 7 + 3, 0, 0),
      revenue: Math.round((seed.revenue / 12) * swing),
      gop: Math.round((seed.gop / 12) * swing),
      payrollCost: Math.round((seed.payroll / 12) * (0.96 + (index % 3) * 0.02)),
      propertyId,
    }
  })
}

export const trendByProperty: Record<
  string,
  { date: string; revenue: number; gop: number; payrollCost: number }[]
> = {
  [PINE_RIDGE]: trendForProperty(PINE_RIDGE, {
    revenue: 842_150,
    gop: 312_400,
    payroll: 198_600,
  }),
  [MILL_CREEK]: trendForProperty(MILL_CREEK, {
    revenue: 511_980,
    gop: 187_250,
    payroll: 141_200,
  }),
}

export const sales: Sale[] = [
  {
    id: 'sale_1',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    soldBy: { id: 'staff_mira', name: 'Mira Chen' },
    item: { id: 'sku_green', name: '18-hole green fee', category: 'Golf' },
    soldAt: daysAgo(0, 14, 22),
    amount: 185,
    customerId: 'cust_ellis',
    customerName: 'Ellis Ward',
  },
  {
    id: 'sale_2',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    soldBy: { id: 'staff_mira', name: 'Mira Chen' },
    item: { id: 'sku_cart', name: 'Cart fee', category: 'Golf' },
    soldAt: daysAgo(0, 14, 22),
    amount: 28,
    customerId: 'cust_ellis',
    customerName: 'Ellis Ward',
  },
  {
    id: 'sale_3',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    soldBy: { id: 'staff_jon', name: 'Jon Hale' },
    item: { id: 'sku_burger', name: 'Clubhouse burger', category: 'F&B' },
    soldAt: daysAgo(0, 12, 5),
    amount: 18,
    customerId: 'cust_priya',
    customerName: 'Priya Nair',
  },
  {
    id: 'sale_4',
    propertyId: MILL_CREEK,
    propertyName: propertyNames[MILL_CREEK],
    soldBy: { id: 'staff_dana', name: 'Dana Brooks' },
    item: { id: 'sku_range', name: 'Range bucket — large', category: 'Practice' },
    soldAt: daysAgo(0, 11, 40),
    amount: 14,
    customerId: 'cust_owen',
    customerName: 'Owen Blake',
  },
  {
    id: 'sale_5',
    propertyId: MILL_CREEK,
    propertyName: propertyNames[MILL_CREEK],
    soldBy: { id: 'staff_dana', name: 'Dana Brooks' },
    item: { id: 'sku_glove', name: 'Titleist Players glove', category: 'Pro shop' },
    soldAt: daysAgo(1, 16, 12),
    amount: 28,
    customerId: 'cust_owen',
    customerName: 'Owen Blake',
  },
  {
    id: 'sale_6',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    soldBy: { id: 'staff_lea', name: 'Lea Ortiz' },
    item: { id: 'sku_lesson', name: '45-min lesson', category: 'Instruction' },
    soldAt: daysAgo(1, 9, 30),
    amount: 95,
    customerId: 'cust_sam',
    customerName: 'Sam Okonkwo',
  },
  {
    id: 'sale_7',
    propertyId: MILL_CREEK,
    propertyName: propertyNames[MILL_CREEK],
    soldBy: { id: 'staff_cole', name: 'Cole Nguyen' },
    item: { id: 'sku_nine', name: '9-hole twilight', category: 'Golf' },
    soldAt: daysAgo(2, 17, 8),
    amount: 62,
    customerId: 'cust_hana',
    customerName: 'Hana Sato',
  },
  {
    id: 'sale_8',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    soldBy: { id: 'staff_jon', name: 'Jon Hale' },
    item: { id: 'sku_wine', name: 'House cabernet', category: 'F&B' },
    soldAt: daysAgo(2, 19, 15),
    amount: 14,
    customerId: 'cust_priya',
    customerName: 'Priya Nair',
  },
  {
    id: 'sale_9',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    soldBy: { id: 'staff_lea', name: 'Lea Ortiz' },
    item: { id: 'sku_balls', name: 'Pro V1 dozen', category: 'Pro shop' },
    soldAt: daysAgo(3, 10, 2),
    amount: 54.99,
    customerId: 'cust_ellis',
    customerName: 'Ellis Ward',
  },
  {
    id: 'sale_10',
    propertyId: MILL_CREEK,
    propertyName: propertyNames[MILL_CREEK],
    soldBy: { id: 'staff_cole', name: 'Cole Nguyen' },
    item: { id: 'sku_event', name: 'Member-guest lunch', category: 'F&B' },
    soldAt: daysAgo(4, 13, 0),
    amount: 42,
    customerId: 'cust_ruth',
    customerName: 'Ruth Keller',
  },
  {
    id: 'sale_11',
    propertyId: MILL_CREEK,
    propertyName: propertyNames[MILL_CREEK],
    soldBy: { id: 'staff_dana', name: 'Dana Brooks' },
    item: { id: 'sku_green_mc', name: '18-hole member round', category: 'Golf' },
    soldAt: daysAgo(5, 8, 45),
    amount: 95,
    customerId: 'cust_ruth',
    customerName: 'Ruth Keller',
  },
  {
    id: 'sale_12',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    soldBy: { id: 'staff_mira', name: 'Mira Chen' },
    item: { id: 'sku_replay', name: 'Replay 9', category: 'Golf' },
    soldAt: daysAgo(6, 15, 18),
    amount: 48,
    customerId: 'cust_sam',
    customerName: 'Sam Okonkwo',
  },
]

export const customers: Customer[] = [
  {
    id: 'cust_ellis',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    name: 'Ellis Ward',
    email: 'ellis.ward@example.com',
    phone: '208-555-0142',
    lastVisitAt: daysAgo(0, 14, 22),
    lifetimeValue: 4_820,
    visitCount: 38,
    preferredItems: ['18-hole green fee', 'Pro V1 dozen'],
  },
  {
    id: 'cust_priya',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    lastVisitAt: daysAgo(0, 12, 5),
    lifetimeValue: 1_240,
    visitCount: 11,
    preferredItems: ['Clubhouse burger'],
  },
  {
    id: 'cust_sam',
    propertyId: PINE_RIDGE,
    propertyName: propertyNames[PINE_RIDGE],
    name: 'Sam Okonkwo',
    email: 'sam.okonkwo@example.com',
    phone: '208-555-0190',
    lastVisitAt: daysAgo(1, 9, 30),
    lifetimeValue: 2_110,
    visitCount: 16,
    preferredItems: ['45-min lesson'],
  },
  {
    id: 'cust_owen',
    propertyId: MILL_CREEK,
    propertyName: propertyNames[MILL_CREEK],
    name: 'Owen Blake',
    email: 'owen.blake@example.com',
    lastVisitAt: daysAgo(0, 11, 40),
    lifetimeValue: 890,
    visitCount: 9,
    preferredItems: ['Range bucket — large'],
  },
  {
    id: 'cust_hana',
    propertyId: MILL_CREEK,
    propertyName: propertyNames[MILL_CREEK],
    name: 'Hana Sato',
    email: 'hana.sato@example.com',
    lastVisitAt: daysAgo(2, 17, 8),
    lifetimeValue: 1_560,
    visitCount: 14,
  },
  {
    id: 'cust_ruth',
    propertyId: MILL_CREEK,
    propertyName: propertyNames[MILL_CREEK],
    name: 'Ruth Keller',
    email: 'ruth.keller@example.com',
    phone: '208-555-0118',
    lastVisitAt: daysAgo(4, 13, 0),
    lifetimeValue: 6_440,
    visitCount: 52,
    preferredItems: ['18-hole member round', 'Member-guest lunch'],
  },
]

const customerNotes: Record<string, string> = {
  cust_ellis: 'Prefers morning tee times. Responds well to pro-shop ball promotions.',
  cust_ruth: 'Board member at Mill Creek. Host for two member-guest events this season.',
  cust_sam: 'Working on short game. Booked a 6-pack of lessons.',
}

export function customerProfile(id: string): CustomerProfile | null {
  const customer = customers.find((item) => item.id === id)
  if (!customer) return null
  return {
    ...customer,
    purchases: sales.filter((sale) => sale.customerId === id),
    notes: customerNotes[id],
  }
}
