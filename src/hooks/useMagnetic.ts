import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';

interface MagneticOptions {
    /** Fuerza del tirón (px de desplazamiento máx. relativo al tamaño). */
    strength?: number;
    /** Radio de activación en px alrededor del elemento. */
    radius?: number;
}

/**
 * Tirón magnético hacia el cursor — SOLO para CTAs principales.
 * (Deliberadamente NO se usa en cards de contenido: cansa y mobile lo ignora.)
 *
 * Implementado con motion `useMotionValue` + `useSpring` (NO useState, no hay
 * re-render de React por frame). Los springs escriben directamente el
 * `transform` del elemento vía suscripción `.on('change')`.
 *
 * Devuelve una ref para el elemento interactivo. El movimiento se desactiva
 * bajo prefers-reduced-motion y en punteros gruesos (táctil). Si la ref no se
 * asigna a ningún nodo (p. ej. una variante no-magnética), el efecto no hace
 * nada.
 */
export function useMagnetic<T extends HTMLElement>(options: MagneticOptions = {}) {
    const ref = useRef<T>(null);
    const { strength = 0.4, radius = 90 } = options;

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springConfig = { stiffness: 260, damping: 22, mass: 0.6 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof window === 'undefined') return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (reduce || !fine) return;

        const render = () => {
            el.style.transform = `translate3d(${springX.get()}px, ${springY.get()}px, 0)`;
        };
        const unsubX = springX.on('change', render);
        const unsubY = springY.on('change', render);

        // Cacheamos el rect: getBoundingClientRect fuerza layout, así que en vez
        // de llamarlo en cada pointermove lo recalculamos solo cuando puede haber
        // cambiado (scroll, resize, o al entrar el puntero en el elemento).
        let cx = 0;
        let cy = 0;
        let reach = 0;
        const measure = () => {
            const rect = el.getBoundingClientRect();
            cx = rect.left + rect.width / 2;
            cy = rect.top + rect.height / 2;
            reach = Math.max(rect.width, rect.height) / 2 + radius;
        };
        measure();

        const onMove = (e: PointerEvent) => {
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.hypot(dx, dy);

            if (dist < reach) {
                x.set(dx * strength);
                y.set(dy * strength);
                el.dataset.magnetHover = 'true';
            } else if (el.dataset.magnetHover) {
                x.set(0);
                y.set(0);
                delete el.dataset.magnetHover;
            }
        };

        const onLeave = () => {
            x.set(0);
            y.set(0);
            delete el.dataset.magnetHover;
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('scroll', measure, { passive: true });
        window.addEventListener('resize', measure);
        el.addEventListener('pointerenter', measure);
        el.addEventListener('pointerleave', onLeave);

        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('scroll', measure);
            window.removeEventListener('resize', measure);
            el.removeEventListener('pointerenter', measure);
            el.removeEventListener('pointerleave', onLeave);
            unsubX();
            unsubY();
            x.set(0);
            y.set(0);
            el.style.transform = '';
        };
    }, [strength, radius, x, y, springX, springY]);

    return ref;
}
