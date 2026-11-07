import type { Filters, Restaurant } from '../types';

/** Pure + unit-tested. Cuisine & rating filters narrow results; text search matches name/cuisine/tags. */
export function filterRestaurants(restaurants: readonly Restaurant[], filters: Filters): Restaurant[] {
  const q = filters.query.trim().toLowerCase();
  return restaurants.filter((r) => {
    if (filters.cuisine !== 'all' && r.cuisineType !== filters.cuisine) return false;
    if (r.rating < filters.minRating) return false;
    if (filters.maxPrice !== 0 && (r.priceRange ?? 4) > filters.maxPrice) return false;
    if (q === '') return true;
    const haystack = [r.name, r.cuisineType, ...r.tags].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

export function uniqueCuisines(restaurants: readonly Restaurant[]): string[] {
  return [...new Set(restaurants.map((r) => r.cuisineType))].sort();
}
