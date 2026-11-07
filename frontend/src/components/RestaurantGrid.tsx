import type { Restaurant } from '../types';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  return (
    <ul className="grid" aria-label="Restaurants">
      {restaurants.map((r) => (
        <li key={r.id} className="grid-item">
          <RestaurantCard restaurant={r} />
        </li>
      ))}
    </ul>
  );
}
