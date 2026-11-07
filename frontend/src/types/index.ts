/** Response shapes of the (mock) API contract. Components are typed against these directly. */

export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string; // e.g. 'Nigerian', 'Continental'
  rating: number; // 0-5
  photoUrl: string; // may be '' or broken -> UI falls back to a placeholder
  tags: string[]; // e.g. ['Jollof', 'Delivery', 'Open Now']
  isFavorited: boolean;
  /** Extras from the repo's mock_data.json (optional so the core contract stays intact). */
  priceRange?: 1 | 2 | 3 | 4;
  address?: string;
  isOpen?: boolean;
}

export type TransactionType = 'CHECK_IN' | 'REVIEW' | 'REDEEM';

export interface PointsTransaction {
  id: string;
  type: TransactionType;
  points: number; // +50, +20, or negative for REDEEM
  restaurantName: string;
  createdAt: string; // ISO 8601
}

export interface DashboardPayload {
  restaurants: Restaurant[];
  pointsBalance: number;
  pointsHistory: PointsTransaction[];
}

export interface Filters {
  query: string;
  cuisine: string; // 'all' or a cuisine name
  minRating: number; // 0 = any
  maxPrice: 0 | 1 | 2 | 3 | 4; // 0 = any
}

export const DEFAULT_FILTERS: Filters = {
  query: '',
  cuisine: 'all',
  minRating: 0,
  maxPrice: 0,
};
