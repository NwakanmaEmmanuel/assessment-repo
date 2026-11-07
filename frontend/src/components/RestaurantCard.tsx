import { memo } from 'react';
import type { Restaurant } from '../types';
import { FavoriteButton } from './FavoriteButton';
import { RestaurantImage } from './RestaurantImage';
import { StarRating } from './StarRating';

export interface RestaurantCardProps {
  restaurant: Restaurant;
  /** Receives the restaurant id so a single stable callback can serve every card. */
  onToggleFavorite: (id: string) => void;
}

const MAX_TAGS = 3;

/**
 * Memoised: with 200+ cards, typing in the search box or favouriting ONE card must not re-render the rest.
 * Works because (a) the hook only replaces the changed restaurant object and (b) onToggleFavorite is referentially stable.
 */
export const RestaurantCard = memo(function RestaurantCard({ restaurant, onToggleFavorite }: RestaurantCardProps) {
  const { id, name, cuisineType, rating, photoUrl, tags, priceRange, isOpen, isFavorited } = restaurant;
  const visibleTags = tags.slice(0, MAX_TAGS);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <article className="card" aria-label={name}>
      <div className="card-media">
        <RestaurantImage src={photoUrl} alt={name} />
        <FavoriteButton restaurantName={name} isFavorited={isFavorited} onToggle={() => onToggleFavorite(id)} />
        {isOpen !== undefined && (
          <span className={`status ${isOpen ? 'status-open' : 'status-closed'}`}>{isOpen ? 'Open' : 'Closed'}</span>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title" title={name}>{name}</h3>
        <p className="card-meta">
          <span>{cuisineType}</span>
          {priceRange && (
            <span className="price" aria-label={`Price level ${priceRange} of 4`}>
              <span className="price-on">{'₦'.repeat(priceRange)}</span>
              <span className="price-off">{'₦'.repeat(4 - priceRange)}</span>
            </span>
          )}
        </p>
        <StarRating rating={rating} />
        <ul className="tags" aria-label="Tags">
          {visibleTags.map((t) => (
            <li key={t} className="tag">{t}</li>
          ))}
          {hiddenCount > 0 && <li className="tag tag-more">+{hiddenCount}</li>}
        </ul>
      </div>
    </article>
  );
});
