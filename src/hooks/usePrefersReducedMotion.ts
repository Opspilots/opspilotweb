import { useEffect, useState } from 'react';

/**
 * Tracks the `prefers-reduced-motion: reduce` media query, including live
 * updates if the user toggles the OS-level setting while the app is open.
 * SSR-safe (defaults to `false` when `window`/`matchMedia` aren't available).
 */
export function usePrefersReducedMotion(): boolean {
    const [reduce, setReduce] = useState<boolean>(() =>
        typeof window !== 'undefined'
            ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
            : false
    );

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduce(mq.matches);
        update();
        mq.addEventListener?.('change', update);
        return () => mq.removeEventListener?.('change', update);
    }, []);

    return reduce;
}
