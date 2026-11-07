import { useCallback, useRef, useState } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);

  const push = useCallback((text: string) => {
    const id = nextId.current++;
    setToasts((list) => [...list.slice(-2), { id, text }]); // keep at most 3 on screen
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}
