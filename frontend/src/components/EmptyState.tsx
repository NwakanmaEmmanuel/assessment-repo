interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="empty" role="status">
      <div className="empty-icon" aria-hidden="true">🍲</div>
      <h3>No bukas match your filters</h3>
      <p>Try a different cuisine, lower the minimum rating, or clear your search.</p>
      <button type="button" className="btn btn-primary" onClick={onReset}>Clear all filters</button>
    </div>
  );
}
