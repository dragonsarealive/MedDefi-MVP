import { useEffect } from 'react';
import type { RefObject } from 'react';

export const useTilt = (ref: RefObject<HTMLDivElement | null>) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onMouseMove = (e: MouseEvent) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            const rotateX = (y - 0.5) * -12;
            const rotateY = (x - 0.5) * 12;
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        };

        const onMouseLeave = () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        };

        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);

        return () => {
            el.removeEventListener('mousemove', onMouseMove);
            el.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [ref]);
};