import { useState, useEffect, useRef } from 'react';

export const useIntersectionObserver = (options: IntersectionObserverInit) => {
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    const [node, setNode] = useState<HTMLElement | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setEntry(entry);
                observer.current?.unobserve(entry.target);
            }
        }, options);

        const { current: currentObserver } = observer;
        if (node && currentObserver) currentObserver.observe(node);

        return () => currentObserver?.disconnect();
    }, [node, options]);

    return [setNode, entry] as const;
}; 