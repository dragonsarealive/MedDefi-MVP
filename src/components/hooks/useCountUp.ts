import { useEffect, useRef } from 'react';

export const useCountUp = (end: number, duration: number = 2000) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let start = 0;
    const startTime = performance.now();
    const endTime = startTime + duration;
    const updateNumber = (currentTime: number) => {
      if (!element) return;
      if (currentTime >= endTime) {
        element.textContent = end.toLocaleString() + (element.dataset.suffix || '');
        return;
      }
      const progress = (currentTime - startTime) / duration;
      const current = Math.floor(progress * end);
      if (current !== start) {
        start = current;
        element.textContent = current.toLocaleString() + (element.dataset.suffix || '');
      }
      requestAnimationFrame(updateNumber);
    };
    requestAnimationFrame(updateNumber);
  }, [end, duration]);
  return ref;
};