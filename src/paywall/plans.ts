export type PlanId = 'monthly' | 'annual'

export interface Plan {
  id: PlanId
  /** Card heading, e.g. "ANNUAL". */
  label: string
  trial: string
  /** Price line on the card. */
  price: string
  /** Smaller per-month equivalent shown after the price. */
  priceNote?: string
  /** Pill on the card's top edge. */
  badge?: string
  /** Price shown in the CTA subtitle. */
  ctaPrice: string
}

export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: 'monthly',
    label: 'MONTHLY',
    trial: 'Free for 3 days',
    price: 'then $49.99/mo',
    ctaPrice: 'then $49.99 /month',
  },
  annual: {
    id: 'annual',
    label: 'ANNUAL',
    trial: 'Free for 3 days',
    price: 'then $149.99/yr',
    priceNote: '($12.50/mo)',
    badge: 'Save $450',
    ctaPrice: 'then $149.99 /year',
  },
}

export const PLAN_ORDER: PlanId[] = ['monthly', 'annual']
