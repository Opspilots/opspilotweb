import { useEffect, useRef, type RefObject } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export interface UseHeroRevealOptions {
    /** Delay between each `.reveal` target's class toggle, in ms. Defaults to 100. */
    staggerMs?: number;
}

/**
 * Hero is above the fold — ScrollTrigger won't reliably fire on load, so we
 * trigger the same `.reveal`/`.revealed` CSS fallback (see index.css) on
 * mount instead of on scroll, mirroring Home's mount-driven hero timeline.
 *
 * Replaces the manual useRef + useEffect + rAF + staggered setTimeout block
 * duplicated across Cases.tsx, Product.tsx, Resources.tsx and Soluciones.tsx.
 * The CSS already forces `opacity: 1` on `.reveal` under
 * `prefers-reduced-motion: reduce`, so this hook simply skips adding
 * `.revealed` in that case — identical to the previous per-page behavior.
 */
export function useHeroReveal<T extends HTMLElement>(
    options: UseHeroRevealOptions = {}
): RefObject<T | null> {
    const ref = useRef<T>(null);
    const reduce = usePrefersReducedMotion();
    const { staggerMs = 100 } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (reduce) return;

        const targets = Array.from(el.querySelectorAll<HTMLElement>('.reveal'));
        const timeouts: number[] = [];
        const id = requestAnimationFrame(() => {
            targets.forEach((t, i) => {
                timeouts.push(window.setTimeout(() => t.classList.add('revealed'), i * staggerMs));
            });
        });

        return () => {
            cancelAnimationFrame(id);
            timeouts.forEach((t) => window.clearTimeout(t));
        };
    }, [reduce, staggerMs]);

    return ref;
}
