interface StarRatingProps {
  rating: number; // 0-5
}

/** Accessible read-only rating: visual stars are hidden from AT, the number is read out. */
export function StarRating({ rating }: StarRatingProps) {
  const pct = Math.max(0, Math.min(5, rating)) * 20;
  return (
    <span className="rating" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      <span className="stars" aria-hidden="true">
        <span className="stars-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="rating-value" aria-hidden="true">{rating.toFixed(1)}</span>
    </span>
  );
}
