import { describe, expect, it } from 'vitest';
import { mockPointsHistory, mockRestaurants } from '../data/mockData';
import { DEFAULT_FILTERS, type Restaurant } from '../types';
import { filterRestaurants } from '../utils/filterRestaurants';
import { sortNewestFirst } from '../utils/points';

describe('filterRestaurants', () => {
  it('returns everything with default filters', () => {
    expect(filterRestaurants(mockRestaurants, DEFAULT_FILTERS)).toHaveLength(mockRestaurants.length);
  });

  it('narrows by cuisine', () => {
    const result = filterRestaurants(mockRestaurants, { ...DEFAULT_FILTERS, cuisine: 'Afro-Fusion' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((r) => r.cuisineType === 'Afro-Fusion')).toBe(true);
  });

  it('narrows by minimum rating', () => {
    const result = filterRestaurants(mockRestaurants, { ...DEFAULT_FILTERS, minRating: 4.5 });
    expect(result.every((r) => r.rating >= 4.5)).toBe(true);
    expect(result.length).toBeLessThan(mockRestaurants.length);
  });

  it('combines filters down to zero results (Phase 1 checkpoint)', () => {
    // Deterministic list: the only Fast Food place is rated 4.2, so cuisine + 4.5+ must be empty.
    const list: Restaurant[] = [
      { id: 'a', name: 'A', cuisineType: 'Fast Food', rating: 4.2, photoUrl: '', tags: [], isFavorited: false },
      { id: 'b', name: 'B', cuisineType: 'Nigerian', rating: 4.9, photoUrl: '', tags: [], isFavorited: false },
    ];
    expect(filterRestaurants(list, { ...DEFAULT_FILTERS, cuisine: 'Fast Food' })).toHaveLength(1);
    expect(filterRestaurants(list, { ...DEFAULT_FILTERS, cuisine: 'Fast Food', minRating: 4.5 })).toHaveLength(0);
  });

  it('searches name, cuisine and tags case-insensitively', () => {
    expect(filterRestaurants(mockRestaurants, { ...DEFAULT_FILTERS, query: 'MAMA CASS' }).map((r) => r.id)).toContain('buka_001');
    expect(filterRestaurants(mockRestaurants, { ...DEFAULT_FILTERS, query: 'amala' }).map((r) => r.id)).toContain('buka_002');
    expect(filterRestaurants(mockRestaurants, { ...DEFAULT_FILTERS, query: 'zzzz-no-match' })).toHaveLength(0);
  });
});

describe('sortNewestFirst', () => {
  it('orders transactions most-recent-first without mutating the input', () => {
    const snapshot = mockPointsHistory.map((t) => t.id);
    const sorted = sortNewestFirst(mockPointsHistory);
    const times = sorted.map((t) => Date.parse(t.createdAt));
    expect(times).toEqual([...times].sort((a, b) => b - a));
    expect(mockPointsHistory.map((t) => t.id)).toEqual(snapshot);
  });
});
