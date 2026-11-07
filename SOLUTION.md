# Solution Report — Frontend track

I completed the **Frontend Engineering** track (React + TypeScript web app). The backend (NestJS) and mobile (React Native) parts of the
repo's full-stack brief were not part of my assigned track, so sections for those are marked N/A. Full details and the written answers to
the assessment questions are in [`frontend/README.md`](frontend/README.md).

## 1. Local Setup Instructions

```bash
# Setup command for database:   N/A (frontend track — data is mocked in the frontend)
# Setup command for backend:    N/A (frontend track)
# Setup command for frontend:
cd frontend
npm install
npm run dev        # http://localhost:5173
npm test           # 12 unit/hook/component tests
```

No environment variables are required.

## 2. Technical Stack & Architecture Decisions

- **ORM/DB client:** N/A. A small typed service layer (`src/services/api.ts`) simulates the network (latency + 20% failure), so it can be
  swapped for real `fetch()` calls without changing components.
- **State management on Web:** React state in a single custom hook (`useDashboard`) plus `useToasts`. Only the grid and the points panel
  share state, so Context/Redux/Zustand would be unnecessary ceremony. Refs hold optimistic-update bookkeeping so callbacks stay stable.
- **API validation:** N/A on the backend. On the frontend, all payloads are typed (`Restaurant`, `PointsTransaction`, `DashboardPayload`)
  and TypeScript runs in `strict` mode with no `any`.

## 3. Handling Business Constraints & Corner Cases

- **Duplicate check-ins:** N/A (backend/mobile). The frontend's points panel only displays the ledger and supports redeeming in steps of 50.
- **Optimistic UI updates:** The heart updates immediately; the (simulated) request resolves after ~600 ms and fails ~20% of the time. On
  failure the UI reverts to the last server-confirmed value and a toast appears. A per-restaurant sequence number makes double-clicks safe:
  an older failing request cannot overwrite a newer click. Covered by tests (`src/__tests__/optimisticFavorite.test.tsx`).
- **Distance calculations:** N/A (backend). Filtering is by cuisine, minimum rating, price and text search.

## 4. Key Limitations & Future Enhancements

- Mock data only, nothing persisted; with a week more I would add a real API client (TanStack Query for caching, retries and built-in
  optimistic mutations), routing for restaurant detail pages, pagination/infinite scroll and list virtualisation (`@tanstack/react-virtual`).
- Add Playwright end-to-end tests for the favourite rollback and run a screen-reader accessibility pass.
- Geolocation-based "near me" sorting and the real check-in flow depend on the backend/mobile tracks and were out of scope.
