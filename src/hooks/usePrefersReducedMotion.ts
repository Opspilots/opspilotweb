import { useEffect, useState } from 'react';

/**
 * Tracks the `prefers-reduced-motion: reduce` media query, including live
 * updates if the user toggles the OS-level setting while the app is open.
 *
 * Hydration-safe by construction: the initial state is ALWAYS `false`,
 * identical on server and on the client's first render (no synchronous
 * `window.matchMedia` read during render). The real value is read in a
 * `useEffect`, which only runs after mount/hydration — so any adjustment to
 * `true` happens as a normal post-hydration state update, not a mismatch.
 * (Previously this initialized via `useState(() => window.matchMedia(...))`,
 * which read `window` synchronously on the client's first render while SSR
 * had no `window` and produced `false` — a classic hydration mismatch that
 * crashed the whole tree on ~768-800px viewports with reduced-motion
 * enabled, since Home's Navbar/hero couldn't recover from it.)
 */
export function usePrefersReducedMotion(): boolean {
    const [reduce, setReduce] = useState<boolean>(false);

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
