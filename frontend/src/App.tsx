import { useMemo, useState } from 'react';
import { EmptyState } from './components/EmptyState';
import { FiltersBar } from './components/FiltersBar';
import { Header } from './components/Header';
import { RestaurantGrid } from './components/RestaurantGrid';
import { mockRestaurants } from './data/mockData';
import { DEFAULT_FILTERS, type Filters } from './types';
import { filterRestaurants, uniqueCuisines } from './utils/filterRestaurants';

export default function App() {
  const [restaurants] = useState(mockRestaurants);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const cuisines = useMemo(() => uniqueCuisines(restaurants), [restaurants]);
  const visible = useMemo(() => filterRestaurants(restaurants, filters), [restaurants, filters]);

  return (
    <>
      <Header />
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
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
          {visible.length === 0 ? (
            <EmptyState onReset={() => setFilters(DEFAULT_FILTERS)} />
          ) : (
            <RestaurantGrid restaurants={visible} />
          )}
        </section>
        <aside className="side" id="rewards" aria-label="Points and rewards">
          {/* Points & Rewards panel lands in Phase 3 */}
        </aside>
      </main>
    </>
  );
}
