import { useMemo } from 'react';
import type { PointsTransaction } from '../types';
import { formatDate, REDEEM_STEP, REDEEM_VALUE_NAIRA, sortNewestFirst, TYPE_LABEL } from '../utils/points';

interface PointsPanelProps {
  balance: number;
  history: PointsTransaction[];
  loading: boolean;
  onRedeem: () => void;
}

export function PointsPanel({ balance, history, loading, onRedeem }: PointsPanelProps) {
  const sorted = useMemo(() => sortNewestFirst(history), [history]);
  const canRedeem = !loading && balance >= REDEEM_STEP;

  return (
    <section className="panel" aria-labelledby="points-title">
      <h2 id="points-title" className="panel-title">Points &amp; Rewards</h2>

      <div className="balance" aria-live="polite">
        <span className="balance-label">Your balance</span>
        {loading ? (
          <span className="skeleton balance-skeleton" aria-hidden="true" />
        ) : (
          <span className="balance-value">{balance}<small> pts</small></span>
        )}
      </div>

      <button type="button" className="btn btn-primary btn-block" disabled={!canRedeem} onClick={onRedeem}>
        Redeem voucher · {REDEEM_STEP} pts = ₦{REDEEM_VALUE_NAIRA} off
      </button>
      {!loading && !canRedeem && <p className="hint">You need at least {REDEEM_STEP} points to redeem a voucher.</p>}

      <h3 className="panel-sub">Recent activity</h3>
      {loading ? (
        <ul className="ledger" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="ledger-row">
              <span className="skeleton ledger-skeleton" />
            </li>
          ))}
        </ul>
      ) : sorted.length === 0 ? (
        <p className="hint">No activity yet. Check in at a buka to earn your first points.</p>
      ) : (
        <ul className="ledger">
          {sorted.map((t) => (
            <li key={t.id} className="ledger-row">
              <div className="ledger-main">
                <span className="ledger-type">{TYPE_LABEL[t.type]}</span>
                <span className="ledger-where">{t.restaurantName}</span>
                <time className="ledger-date" dateTime={t.createdAt}>{formatDate(t.createdAt)}</time>
              </div>
              <span className={`ledger-points ${t.points < 0 ? 'neg' : 'pos'}`}>
                {t.points > 0 ? '+' : ''}{t.points}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
