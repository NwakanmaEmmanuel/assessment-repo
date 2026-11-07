import { mockPayload } from '../data/mockData';
import type { DashboardPayload } from '../types';

/** Simulated network layer. Swap these two functions for real fetch() calls without touching any component. */

export const FETCH_LATENCY_MS = 1200;
export const SAVE_LATENCY_MS = 600;
export const FAVORITE_FAILURE_RATE = 0.2;

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** GET /dashboard — returns a fresh deep copy every call, like a real response would. */
export async function fetchDashboard(): Promise<DashboardPayload> {
  await wait(FETCH_LATENCY_MS);
  return structuredClone(mockPayload);
}

export interface SaveFavoriteOptions {
  /** Demo switch: guarantees a rejection so the rollback can be shown on demand. */
  forceFail?: boolean;
}

/** PUT /restaurants/:id/favorite — resolves after ~600ms; rejects ~20% of the time (or always when forced). */
export async function saveFavorite(_id: string, _value: boolean, options: SaveFavoriteOptions = {}): Promise<void> {
  await wait(SAVE_LATENCY_MS);
  if (options.forceFail === true || Math.random() < FAVORITE_FAILURE_RATE) {
    throw new ApiError('Network request failed', 503);
  }
}
