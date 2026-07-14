import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

const INTERACTIVE_SELECTOR =
    'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]';

/**
 * CustomCursor — decorative dot + trailing ring that follows the pointer.
 *
 * - Only renders on devices with a fine pointer (mouse/trackpad).
 * - Disabled when the user prefers reduced motion.
 * - Purely additive: the native cursor stays visible, so nothing breaks
 *   if this component unmounts or JS fails.
 */
export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const finePointer = window.matchMedia('(pointer: fine)');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        const update = () => setEnabled(finePointer.matches && !reducedMotion.matches);
        update();

        finePointer.addEventListener('change', update);
        reducedMotion.addEventListener('change', update);
        return () => {
            finePointer.removeEventListener('change', update);
            reducedMotion.removeEventListener('change', update);
        };
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let targetX = -100;
        let targetY = -100;
        let ringX = -100;
        let ringY = -100;
        let visible = false;
        let raf = 0;

        const onMove = (e: MouseEvent) => {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!visible) {
                visible = true;
                ringX = targetX;
                ringY = targetY;
                dot.classList.add(styles.visible);
                ring.classList.add(styles.visible);
            }
            dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        };

        const onLeave = () => {
            visible = false;
            dot.classList.remove(styles.visible);
            ring.classList.remove(styles.visible);
        };

        const onOver = (e: MouseEvent) => {
            const target = e.target as Element | null;
            const interactive = !!target?.closest?.(INTERACTIVE_SELECTOR);
            ring.classList.toggle(styles.hovering, interactive);
            dot.classList.toggle(styles.hovering, interactive);
        };

        const tick = () => {
            // Lerp the ring towards the pointer for a soft trailing feel.
            ringX += (targetX - ringX) * 0.18;
            ringY += (targetY - ringY) * 0.18;
            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            raf = requestAnimationFrame(tick);
        };

        // El cursor decorativo es mejora progresiva: hasta que arranca, el
        // cursor nativo sigue visible y usable. Diferimos rAF + listeners a
        // post-paint (requestIdleCallback, fallback setTimeout) para no robar
        // trabajo al primer render; el dot/ring aparecen unos ms después.
        let idleId = 0;
        let usedIdle = false;
        let cancelled = false;

        const start = () => {
            if (cancelled) return;
            // Oculta el cursor nativo (regla global en index.css) para que el
            // dot/ring lo reemplace en lugar de duplicarlo.
            document.documentElement.setAttribute('data-custom-cursor', 'on');
            window.addEventListener('mousemove', onMove, { passive: true });
            window.addEventListener('mouseover', onOver, { passive: true });
            document.documentElement.addEventListener('mouseleave', onLeave);
            raf = requestAnimationFrame(tick);
        };

        if (typeof window.requestIdleCallback === 'function') {
            usedIdle = true;
            idleId = window.requestIdleCallback(start);
        } else {
            idleId = window.setTimeout(start, 1);
        }

        return () => {
            cancelled = true;
            if (usedIdle) window.cancelIdleCallback(idleId);
            else window.clearTimeout(idleId);
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onOver);
            document.documentElement.removeEventListener('mouseleave', onLeave);
            document.documentElement.removeAttribute('data-custom-cursor');
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <>
            <div ref={dotRef} className={styles.dot} aria-hidden="true">
                <div className={styles.dotCore} />
            </div>
            <div ref={ringRef} className={styles.ring} aria-hidden="true">
                <div className={styles.ringCore} />
            </div>
        </>
    );
}
