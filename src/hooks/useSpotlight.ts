import { useEffect, useRef } from 'react';

/**
 * Spotlight que sigue el puntero dentro de una card: escribe --mx / --my
 * (posición del ratón relativa a la card, en %) como custom properties que
 * el CSS consume para pintar un halo radial y un borde iluminado.
 *
 * Barato: un solo listener por card, sin re-render de React, rAF-throttled.
 * No hace nada bajo prefers-reduced-motion ni en punteros gruesos (táctil):
 * en esos casos la card se queda en su estado estático, que ya es válido.
 */
export function useSpotlight<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!fine || reduce) return;

        let raf = 0;
        let px = 0;
        let py = 0;

        const apply = () => {
            raf = 0;
            el.style.setProperty('--mx', `${px}%`);
            el.style.setProperty('--my', `${py}%`);
        };

        const onMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            px = ((e.clientX - rect.left) / rect.width) * 100;
            py = ((e.clientY - rect.top) / rect.height) * 100;
            if (!raf) raf = requestAnimationFrame(apply);
        };

        const onEnter = () => el.setAttribute('data-spotlight-active', 'true');
        const onLeave = () => {
            el.removeAttribute('data-spotlight-active');
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
        };

        el.addEventListener('pointermove', onMove, { passive: true });
        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointerleave', onLeave);

        return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerenter', onEnter);
            el.removeEventListener('pointerleave', onLeave);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return ref;
}
