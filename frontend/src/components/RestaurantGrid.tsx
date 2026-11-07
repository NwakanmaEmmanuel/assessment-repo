import type { Restaurant } from '../types';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  onToggleFavorite: (id: string) => void;
}

export function RestaurantGrid({ restaurants, onToggleFavorite }: RestaurantGridProps) {
  return (
    <ul className="grid" aria-label="Restaurants">
      {restaurants.map((r) => (
        <li key={r.id} className="grid-item">
          <RestaurantCard restaurant={r} onToggleFavorite={onToggleFavorite} />
        </li>
      ))}
    </ul>
  );
}
