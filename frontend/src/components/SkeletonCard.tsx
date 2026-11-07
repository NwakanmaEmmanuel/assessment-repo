/** Mirrors RestaurantCard's exact box model (same aspect ratio + fixed row heights) so nothing jumps on swap. */
export function SkeletonCard() {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <div className="card-media skeleton" />
      <div className="card-body">
        <div className="sk-line sk-title skeleton" />
        <div className="sk-line sk-meta skeleton" />
        <div className="sk-line sk-rating skeleton" />
        <div className="sk-tags">
          <span className="skeleton sk-pill" />
          <span className="skeleton sk-pill" />
          <span className="skeleton sk-pill sk-pill-sm" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
}

export function SkeletonGrid({ count = 8 }: SkeletonGridProps) {
  return (
    <ul className="grid" aria-busy="true" aria-label="Loading restaurants">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="grid-item">
          <SkeletonCard />
        </li>
      ))}
      <li className="sr-only" role="status">Loading restaurants…</li>
    </ul>
  );
}
