import { useCallback, useRef, useState } from 'react';

export function useBoundingClientRect() {
  const elementRef = useRef<HTMLElement>();
  const [boundingClientRect, setBoundingClientRect] = useState<DOMRect | null>(null);

  const handleRef = useCallback((instance: HTMLElement | null) => {
    if (!instance) return;
    elementRef.current = instance;
    const rect = instance.getBoundingClientRect();
    setBoundingClientRect(rect);
  }, []);

  return { handleRef, elementRef, boundingClientRect };
}
