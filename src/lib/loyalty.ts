import type { Order } from '@/context/StoreContext';

export const POINTS_PER_RS = 1 / 10; // 1 point for every Rs 10 spent

export type Tier = { name: 'Bronze' | 'Silver' | 'Gold'; min: number };
export const TIERS: Tier[] = [
  { name: 'Bronze', min: 0 },
  { name: 'Silver', min: 300 },
  { name: 'Gold', min: 800 },
];

export function pointsFor(orders: Order[]): number {
  return orders.reduce((sum, o) => sum + Math.floor(o.total * POINTS_PER_RS), 0);
}

export function tierFor(points: number) {
  let idx = 0;
  TIERS.forEach((t, i) => {
    if (points >= t.min) idx = i;
  });
  const current = TIERS[idx];
  const next = TIERS[idx + 1];
  const progress = next ? (points - current.min) / (next.min - current.min) : 1;
  return { current, next, progress, toNext: next ? next.min - points : 0 };
}
