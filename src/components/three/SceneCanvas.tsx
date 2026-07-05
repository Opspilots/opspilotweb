import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { useInViewport } from '../../hooks/useInViewport';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { SceneCanvasMountProps } from './SceneCanvasMount';
import styles from './SceneCanvas.module.css';

export interface SceneCanvasProps<P extends object> {
    /** Dynamic import of the heavy R3F scene component, e.g. `() => import('./scenes/PrimitiveHeroScene')`. */
    loader: () => Promise<{ default: ComponentType<P> }>;
    /** Props forwarded to the lazy-loaded scene component once mounted. */
    sceneProps?: P;
    /**
     * Static fallback rendered while `prefers-reduced-motion: reduce` is on,
     * before the section first enters the viewport, and while the
     * `@react-three/fiber`/scene chunks are loading. Should visually
     * approximate the animated scene.
     */
    fallback: ReactNode;
    className?: string;
}

// Lazy-loads `SceneCanvasMount`, which is the module that actually imports
// `@react-three/fiber` (and transitively `three`). Declared once at module
// scope — shared across all `SceneCanvas` instances — so its identity stays
// stable across renders and it is fetched only once per page load.
const Mount = lazy(() => import('./SceneCanvasMount')) as unknown as <P extends object>(
    props: SceneCanvasMountProps<P>
) => ReactNode;

/**
 * Generic wrapper for lazy-loaded React Three Fiber scenes used as
 * decorative hero backgrounds across pages (Product, Soluciones, Resources,
 * Contact, Cases — all sharing `PrimitiveHeroScene`). Mirrors the lazy +
 * fallback + reduced-motion molde of
 * `src/components/common/Aurora.tsx`, adapted for R3F (no manual WebGL
 * cleanup needed — the fiber reconciler disposes the GL context on unmount).
 *
 * Behavior:
 * - Renders only `fallback` (no chunk download — not even
 *   `@react-three/fiber`/`three`, both deferred to `SceneCanvasMount`) when
 *   the user prefers reduced motion.
 * - Renders only `fallback` until the container first enters the viewport
 *   (`useInViewport`, rootMargin '25% 0px').
 * - Once mounted, the Canvas stays mounted for the lifetime of the
 *   component — leaving/re-entering the viewport only toggles
 *   `frameloop` between 'always' and 'never' (pauses RAF without
 *   destroying the WebGL context), it never unmounts/remounts.
 */
export function SceneCanvas<P extends object>({
    loader,
    sceneProps,
    fallback,
    className,
}: SceneCanvasProps<P>) {
    const { ref, inView } = useInViewport<HTMLDivElement>({ rootMargin: '25% 0px' });
    const reduceMotion = usePrefersReducedMotion();

    // Sticky flag: true forever once the section has been near the
    // viewport at least once. Keeps the Canvas mounted afterwards so we
    // never tear down / recreate the WebGL context on scroll.
    const [hasEntered, setHasEntered] = useState(false);
    useEffect(() => {
        if (inView) setHasEntered(true);
    }, [inView]);

    const showCanvas = !reduceMotion && hasEntered;

    return (
        <div ref={ref} className={[styles.container, className].filter(Boolean).join(' ')} aria-hidden="true">
            {showCanvas ? (
                <Suspense fallback={fallback}>
                    <Mount loader={loader} sceneProps={sceneProps} fallback={fallback} inView={inView} />
                </Suspense>
            ) : (
                fallback
            )}
        </div>
    );
}

export default SceneCanvas;
