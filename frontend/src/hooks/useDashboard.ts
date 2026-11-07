import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchDashboard, saveFavorite } from '../services/api';
import type { PointsTransaction, Restaurant } from '../types';
import { REDEEM_STEP } from '../utils/points';

export type LoadStatus = 'loading' | 'ready';

interface UseDashboardOptions {
  /** Demo switch: make every favorite request fail. */
  forceFail: boolean;
  /** Called with the restaurant name when a favorite request fails and the UI was rolled back. */
  onFavoriteError: (restaurantName: string) => void;
}

export function useDashboard({ forceFail, onFavoriteError }: UseDashboardOptions) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([]);

  // --- Bookkeeping for optimistic updates. Refs (not state) because they must be readable synchronously
  // --- inside async callbacks and must not trigger renders.
  const names = useRef(new Map<string, string>()); // id -> name (for the error toast)
  const confirmed = useRef(new Map<string, boolean>()); // last value the "server" accepted
  const confirmedSeq = useRef(new Map<string, number>()); // sequence number of that acceptance
  const desired = useRef(new Map<string, boolean>()); // what the UI currently shows (latest click wins)
  const latestSeq = useRef(new Map<string, number>()); // newest request number per restaurant

  // Keep the latest callbacks/flags in refs so toggleFavorite stays referentially stable (needed for React.memo cards).
  const forceFailRef = useRef(forceFail);
  const onErrorRef = useRef(onFavoriteError);
  useEffect(() => {
    forceFailRef.current = forceFail;
    onErrorRef.current = onFavoriteError;
  });

  useEffect(() => {
    let cancelled = false; // guards against StrictMode double-invoke / unmount
    fetchDashboard().then((payload) => {
      if (cancelled) return;
      for (const r of payload.restaurants) {
        names.current.set(r.id, r.name);
        confirmed.current.set(r.id, r.isFavorited);
        desired.current.set(r.id, r.isFavorited);
      }
      setRestaurants(payload.restaurants);
      setPointsBalance(payload.pointsBalance);
      setPointsHistory(payload.pointsHistory);
      setStatus('ready');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setFavorite = useCallback((id: string, value: boolean) => {
    setRestaurants((list) => list.map((r) => (r.id === id && r.isFavorited !== value ? { ...r, isFavorited: value } : r)));
  }, []);

  const toggleFavorite = useCallback(
    async (id: string) => {
      const current = desired.current.get(id);
      if (current === undefined) return;

      // 1) Optimistic update — decided from the *latest desired value*, not from a possibly stale render.
      const next = !current;
      desired.current.set(id, next);
      const seq = (latestSeq.current.get(id) ?? 0) + 1;
      latestSeq.current.set(id, seq);
      setFavorite(id, next);

      try {
        await saveFavorite(id, next, { forceFail: forceFailRef.current });
        if (seq >= (confirmedSeq.current.get(id) ?? 0)) {
          confirmed.current.set(id, next);
          confirmedSeq.current.set(id, seq);
        }
      } catch {
        // 2) Rollback — only if no newer click has happened since; otherwise that newer request owns the final state.
        if (latestSeq.current.get(id) !== seq) return;
        const lastGood = confirmed.current.get(id) ?? !next;
        desired.current.set(id, lastGood);
        setFavorite(id, lastGood);
        onErrorRef.current(names.current.get(id) ?? 'this restaurant');
      }
    },
    [setFavorite],
  );

  /** Redeems one voucher (50 pts). Pure client-side mock: updates balance and appends a REDEEM ledger entry. */
  const redeemVoucher = useCallback(() => {
    if (pointsBalance < REDEEM_STEP) return;
    setPointsBalance(pointsBalance - REDEEM_STEP);
    setPointsHistory((history) => [
      ...history,
      {
        id: `t${Date.now()}`,
        type: 'REDEEM',
        points: -REDEEM_STEP,
        restaurantName: `Voucher BUKA-DISC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [pointsBalance]);

  return { status, restaurants, pointsBalance, pointsHistory, toggleFavorite, redeemVoucher };
}
