import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DashboardPayload } from '../types';

// Control the network layer completely: every saveFavorite call returns a promise we settle by hand.
interface Deferred {
  resolve: () => void;
  reject: (e: Error) => void;
}
const pending: Deferred[] = [];

const payload: DashboardPayload = {
  restaurants: [
    { id: 'r1', name: 'Mama Nkechi Kitchen', cuisineType: 'Nigerian', rating: 4.5, photoUrl: '', tags: [], isFavorited: false },
    { id: 'r2', name: 'Buka Express', cuisineType: 'Nigerian', rating: 4.1, photoUrl: '', tags: [], isFavorited: false },
  ],
  pointsBalance: 140,
  pointsHistory: [],
};

vi.mock('../services/api', () => ({
  fetchDashboard: () => Promise.resolve(structuredClone(payload)),
  saveFavorite: () => new Promise<void>((resolve, reject) => pending.push({ resolve, reject })),
}));

import { useDashboard } from '../hooks/useDashboard';

const fav = (result: { current: ReturnType<typeof useDashboard> }, id: string) =>
  result.current.restaurants.find((r) => r.id === id)?.isFavorited;

describe('optimistic favorite', () => {
  beforeEach(() => {
    pending.length = 0;
  });

  async function setup() {
    const onFavoriteError = vi.fn();
    const hook = renderHook(() => useDashboard({ forceFail: false, onFavoriteError }));
    await waitFor(() => expect(hook.result.current.status).toBe('ready'));
    return { ...hook, onFavoriteError };
  }

  it('updates immediately, then keeps the value when the request succeeds', async () => {
    const { result, onFavoriteError } = await setup();
    act(() => void result.current.toggleFavorite('r2'));
    expect(fav(result, 'r2')).toBe(true); // optimistic — request still pending
    await act(async () => pending[0]?.resolve());
    expect(fav(result, 'r2')).toBe(true);
    expect(onFavoriteError).not.toHaveBeenCalled();
  });

  it('rolls back and reports the error when the request rejects', async () => {
    const { result, onFavoriteError } = await setup();
    act(() => void result.current.toggleFavorite('r2'));
    expect(fav(result, 'r2')).toBe(true);
    await act(async () => pending[0]?.reject(new Error('503')));
    expect(fav(result, 'r2')).toBe(false);
    expect(onFavoriteError).toHaveBeenCalledExactlyOnceWith('Buka Express');
  });

  it('double-click while the first request is in flight: no stale-state flip, one error, ends at the last good value', async () => {
    const { result, onFavoriteError } = await setup();
    act(() => void result.current.toggleFavorite('r2')); // false -> true (request #1 pending)
    act(() => void result.current.toggleFavorite('r2')); // true -> false (request #2 pending)
    expect(fav(result, 'r2')).toBe(false);

    await act(async () => pending[0]?.reject(new Error('503'))); // older request fails: must NOT touch the UI
    expect(fav(result, 'r2')).toBe(false);
    expect(onFavoriteError).not.toHaveBeenCalled();

    await act(async () => pending[1]?.reject(new Error('503'))); // newest fails: roll back to last confirmed (false)
    expect(fav(result, 'r2')).toBe(false);
    expect(onFavoriteError).toHaveBeenCalledTimes(1);
  });

  it('only the failing restaurant is rolled back', async () => {
    const { result } = await setup();
    act(() => void result.current.toggleFavorite('r1'));
    act(() => void result.current.toggleFavorite('r2'));
    await act(async () => pending[0]?.resolve());
    await act(async () => pending[1]?.reject(new Error('503')));
    expect(fav(result, 'r1')).toBe(true);
    expect(fav(result, 'r2')).toBe(false);
  });
});
