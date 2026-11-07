import { useMemo, useState } from 'react';
import { EmptyState } from './components/EmptyState';
import { FiltersBar } from './components/FiltersBar';
import { Header } from './components/Header';
import { RestaurantGrid } from './components/RestaurantGrid';
import { SkeletonGrid } from './components/SkeletonCard';
import { ToastRegion } from './components/Toast';
import { useDashboard } from './hooks/useDashboard';
import { useToasts } from './hooks/useToasts';
import { DEFAULT_FILTERS, type Filters } from './types';
import { filterRestaurants, uniqueCuisines } from './utils/filterRestaurants';

export default function App() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [forceFail, setForceFail] = useState(false);
  const { toasts, push, dismiss } = useToasts();

  const { status, restaurants, toggleFavorite } = useDashboard({
    forceFail,
    onFavoriteError: (name) => push(`Could not save ${name}. Please try again.`),
  });

  const cuisines = useMemo(() => uniqueCuisines(restaurants), [restaurants]);
  const visible = useMemo(() => filterRestaurants(restaurants, filters), [restaurants, filters]);
  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const loading = status === 'loading';

  return (
    <>
      <Header forceFail={forceFail} onForceFailChange={setForceFail} />
      <main className="container layout" id="discover">
        <section className="feed" aria-labelledby="feed-title">
          <div className="section-head">
            <h1 id="feed-title">Discover local bukas</h1>
            <p>Find your next favourite plate of jollof, amala and more.</p>
          </div>
          <FiltersBar
            filters={filters}
            cuisines={cuisines}
            resultCount={visible.length}
            onChange={setFilters}
            onReset={resetFilters}
            disabled={loading}
          />
          {loading ? (
            <SkeletonGrid />
          ) : visible.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <RestaurantGrid restaurants={visible} onToggleFavorite={toggleFavorite} />
          )}
        </section>
        <aside className="side" id="rewards" aria-label="Points and rewards">
          {/* Points & Rewards panel lands in Phase 3 */}
        </aside>
      </main>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
