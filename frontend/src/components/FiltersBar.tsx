import type { Filters } from '../types';

interface FiltersBarProps {
  filters: Filters;
  cuisines: string[];
  resultCount: number;
  onChange: (next: Filters) => void;
  onReset: () => void;
  disabled?: boolean;
}

const RATING_OPTIONS = [0, 3, 3.5, 4, 4.5] as const;
const PRICE_OPTIONS = [0, 1, 2, 3, 4] as const;

export function FiltersBar({ filters, cuisines, resultCount, onChange, onReset, disabled = false }: FiltersBarProps) {
  const isDirty = JSON.stringify(filters) !== JSON.stringify({ query: '', cuisine: 'all', minRating: 0, maxPrice: 0 });
  return (
    <form className="filters" role="search" aria-label="Filter restaurants" onSubmit={(e) => e.preventDefault()}>
      <label className="field field-search">
        <span className="field-label">Search</span>
        <input
          type="search"
          placeholder="Search name, cuisine or dish…"
          value={filters.query}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
        />
      </label>
      <label className="field">
        <span className="field-label">Cuisine</span>
        <select
          value={filters.cuisine}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, cuisine: e.target.value })}
        >
          <option value="all">All cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field-label">Min rating</span>
        <select
          value={filters.minRating}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, minRating: Number(e.target.value) })}
        >
          {RATING_OPTIONS.map((r) => (
            <option key={r} value={r}>{r === 0 ? 'Any rating' : `${r}+ stars`}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field-label">Price</span>
        <select
          value={filters.maxPrice}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) as Filters['maxPrice'] })}
        >
          {PRICE_OPTIONS.map((p) => (
            <option key={p} value={p}>{p === 0 ? 'Any price' : `Up to ${'₦'.repeat(p)}`}</option>
          ))}
        </select>
      </label>
      <div className="filters-foot">
        <span className="count" aria-live="polite">{disabled ? 'Loading…' : `${resultCount} ${resultCount === 1 ? 'place' : 'places'}`}</span>
        {isDirty && !disabled && (
          <button type="button" className="btn btn-link" onClick={onReset}>Reset</button>
        )}
      </div>
    </form>
  );
}
