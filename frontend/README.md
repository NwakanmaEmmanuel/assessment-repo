# LocalBuka — Frontend (Intern Assessment)

A responsive restaurant-discovery dashboard: filterable card grid, layout-matched skeleton loading, an optimistic
Favourite button that rolls back on failure, and a Points & Rewards panel. React 19 + TypeScript (strict) + Vite, plain CSS,
no UI libraries. All data is mocked in the frontend (`src/data/mockData.ts`, seeded from the repo's `mock_data.json`).

## Run it

```bash
cd frontend
npm install     # one install command
npm run dev     # one start command  ->  http://localhost:5173
```

Other scripts: `npm test` (Vitest, 12 tests) · `npm run build` (type-check + production build) · `npm run lint`.

**To watch the rollback on demand:** flip the **Force failures** switch in the header, then click any heart. It flips instantly,
~600 ms later it reverts and a toast appears. With the switch off, requests fail randomly ~20% of the time.

## What's where

```
src/
  types/        Restaurant, PointsTransaction, DashboardPayload, Filters (the API contract)
  data/         typed mock data (5 repo restaurants + 50 generated = 55, for the perf requirement)
  services/     fake network: fetchDashboard (~1.2s), saveFavorite (~600ms, 20% failure, forceFail switch)
  hooks/        useDashboard (fetch + optimistic favourite + redeem), useToasts
  components/   RestaurantCard, SkeletonCard, FiltersBar, PointsPanel, Toast, ... (explicit prop interfaces, no `any`)
  utils/        filterRestaurants, points (pure, unit-tested)
  __tests__/    filters, sorting, rollback (incl. double-click), memoisation
```

## Design decisions

- **Typed against the contract.** Every component takes an explicit props interface; `strict` and `noUncheckedIndexedAccess` are on; no `any`.
- **State lives in one hook** (`useDashboard`), not a global store. Only the grid and the points panel need it, so Context/Redux would be
  ceremony. Components stay presentational.
- **Skeleton = same box model as the card** (same aspect-ratio image, fixed row heights), so swapping skeleton → data does not shift
  layout (both measure 335.5 px tall). Filters are disabled while loading.
- **Fallbacks:** empty or broken photo URLs fall back to a branded placeholder (one restaurant has an empty URL on purpose);
  empty filter results show a dedicated empty state with a "Clear all filters" action instead of a blank grid.
- **Accessibility:** semantic landmarks, labelled form controls, `aria-pressed` on the favourite button, `role="alert"` toasts,
  visible focus rings, `prefers-reduced-motion` respected.
- **Extras taken from the repo brief:** text search, price filter, `isOpen` badge, and a "Redeem voucher" action (50 pts = ₦500, client-side only).

## Known limitations

- Everything is mocked; nothing persists across reloads (favourites and redemptions reset).
- Photos are remote Unsplash URLs, so they need internet; offline you will see the placeholder.
- The grid renders every card (55 in the demo); list virtualisation is described below but not implemented.
- No routing, pagination or real auth; the redeem voucher code is random and client-generated.
- Not audited with a real screen reader, and no end-to-end tests (unit/hook/component tests only).

---

## Technical assessment answers

### Q1 — Optimistic favourite & rollback

The toggle lives in `useDashboard` (`src/hooks/useDashboard.ts`). Rollback logic:

```ts
const next = !desired.current.get(id);          // decide from the latest click, not a possibly stale render
desired.current.set(id, next);
const seq = (latestSeq.current.get(id) ?? 0) + 1;
latestSeq.current.set(id, seq);
setFavorite(id, next);                          // 1) optimistic: UI updates immediately

try {
  await saveFavorite(id, next);
  confirmed.current.set(id, next);              // remember the last value the "server" accepted
} catch {
  if (latestSeq.current.get(id) !== seq) return; // a newer click owns the final state — don't touch the UI
  const lastGood = confirmed.current.get(id) ?? !next;
  desired.current.set(id, lastGood);
  setFavorite(id, lastGood);                    // 2) rollback to the last confirmed value
  onFavoriteError(name);                        //    and tell the user
}
```

**Why this approach:** the state is a single hook shared by the grid and the panel, so a shared store would add nothing; keeping the
bookkeeping in refs lets async callbacks read the newest value synchronously and keeps `toggleFavorite` referentially stable (needed
for `React.memo`). The stale-state bug on a double-click (click, click before request 1 resolves) is avoided with a per-restaurant
sequence number plus a "last confirmed" value: an older failing request is ignored, only the newest request may roll back, and it
rolls back to what the server last accepted rather than blindly inverting the current value. This is covered by a unit test.

### Q2 — Optimising 200+ cards

1. **`React.memo` on `RestaurantCard` + stable props — implemented.** Without it, every keystroke or single favourite re-renders all
   200+ cards even though only one (or a filtered subset) changed. `useDashboard` replaces only the changed restaurant object and
   `toggleFavorite` is stable, so memo's shallow compare skips every other card. Test: with 60 cards, favouriting one re-renders exactly
   1 card; typing in the search box re-renders 0. Also implemented: `useMemo` for the filtered list, `useDeferredValue` so the input
   stays instant while the grid reconciles from a deferred copy, and CSS `content-visibility: auto` so off-screen cards skip layout/paint.
2. **Windowing/virtualisation (e.g. `react-window` or `@tanstack/react-virtual`) — explained only.** Memo stops wasted *re-renders*, but
   200+ mounted cards still cost DOM nodes, memory and layout, which is what hurts scrolling on a mid-range phone. A virtualised list
   mounts only the cards in (and slightly beyond) the viewport (~10–15 instead of 230) and recycles them while scrolling, keeping the
   DOM small and frame time under 16 ms for 60 FPS. With a responsive grid I would compute the column count from container width
   (`ResizeObserver`), virtualise *rows* of N cards, give rows a fixed height (the card already has a fixed height, which makes this easy),
   and add a few rows of overscan to avoid blank flashes. The trade-offs are scroll-restoration and find-in-page behaviour, which I
   would handle explicitly.
