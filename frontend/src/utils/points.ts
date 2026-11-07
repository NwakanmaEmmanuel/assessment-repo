import type { PointsTransaction } from '../types';

/** Most-recent-first. Returns a new array (never mutates the input, which may be React state). */
export function sortNewestFirst(history: readonly PointsTransaction[]): PointsTransaction[] {
  return [...history].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export const REDEEM_STEP = 50; // points per voucher
export const REDEEM_VALUE_NAIRA = 500;

export const TYPE_LABEL: Record<PointsTransaction['type'], string> = {
  CHECK_IN: 'Check-in',
  REVIEW: 'Review',
  REDEEM: 'Voucher redeemed',
};

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}
