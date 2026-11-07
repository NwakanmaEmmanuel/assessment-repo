import { useEffect } from 'react';
import type { ToastMessage } from '../hooks/useToasts';

const AUTO_DISMISS_MS = 5000;

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="toast" role="alert">
      <span className="toast-icon" aria-hidden="true">!</span>
      <span className="toast-text">{toast.text}</span>
      <button type="button" className="toast-close" aria-label="Dismiss message" onClick={() => onDismiss(toast.id)}>×</button>
    </div>
  );
}

interface ToastRegionProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function ToastRegion({ toasts, onDismiss }: ToastRegionProps) {
  return (
    <div className="toast-region" aria-live="assertive">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
