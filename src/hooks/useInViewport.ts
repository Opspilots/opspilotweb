import { useEffect, useRef, useState } from 'react';

export interface UseInViewportOptions {
    /** Passed straight to `IntersectionObserver` — defaults to '20% 0px'. */
    rootMargin?: string;
    /** When true, stops observing after the first time it enters view. */
    once?: boolean;
}

/**
 * Generic IntersectionObserver hook. Returns a ref to attach to the element
 * being watched and whether it is currently considered "in viewport".
 * Falls back to `inView: true` when `IntersectionObserver` isn't available
 * (e.g. very old browsers / non-DOM environments).
 */
export function useInViewport<T extends HTMLElement>(opts?: UseInViewportOptions) {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }

        const obs = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
                if (entry.isIntersecting && opts?.once) obs.disconnect();
            },
            { rootMargin: opts?.rootMargin ?? '20% 0px' }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, [opts?.rootMargin, opts?.once]);

    return { ref, inView };
}
