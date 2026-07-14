import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Guard SSR: registrar el plugin a nivel de módulo reventaría el prerender.
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealOptions {
    rootMargin?: string;
    threshold?: number;
    stagger?: boolean;
    /**
     * Dependencias opcionales. Cuando cambian (p. ej. la clave de una lista
     * filtrada), el hook RECABLEA los ScrollTrigger sobre el nuevo DOM y revela
     * al instante lo que ya esté en viewport. Sin pasar `deps` el comportamiento
     * es IDÉNTICO al original: los triggers se cablean una sola vez en mount.
     */
    deps?: readonly unknown[];
}

const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

/**
 * Reveal al hacer scroll. ScrollTrigger actúa SOLO como disparador: al entrar
 * en viewport añade la clase `.revealed`, y toda la animación (distancia,
 * duración, easing) vive en index.css — el mismo camino CSS que useHeroReveal.
 * Así no hay dos sistemas compitiendo: aquí NO se aplican estilos inline de
 * GSAP (opacity/x/y/scale) que sobrescribirían las transiciones del CSS con
 * otros valores.
 */
export function useScrollReveal<T extends HTMLElement>(
    options: ScrollRevealOptions = {}
) {
    const ref = useRef<T>(null);
    // Marca la primera pasada del efecto: solo en re-cableados posteriores
    // (cambio de `deps`) revelamos en el acto lo que ya esté en viewport. Así el
    // reveal cinematográfico del mount se conserva y el filtrado da feedback
    // inmediato sin dejar tarjetas en opacity:0.
    const firstRun = useRef(true);
    const { stagger = false, deps } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof window === 'undefined') return;

        // Solo re-cableados (deps definidas y no es el primer render) revelan lo
        // que ya está en viewport. El mount sigue el camino ScrollTrigger normal.
        const revealInView = deps !== undefined && !firstRun.current;
        firstRun.current = false;

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        const targets: HTMLElement[] = stagger
            ? Array.from(el.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
            : (() => {
                if (
                    !el.classList.contains('reveal') &&
                    !el.classList.contains('reveal-left') &&
                    !el.classList.contains('reveal-right') &&
                    !el.classList.contains('reveal-scale')
                ) {
                    el.classList.add('reveal');
                }
                return [el];
            })();

        // Reduced motion: el CSS ya fuerza opacity:1/transform:none en las
        // variantes .reveal*, pero añadimos .revealed igual para dejar el estado
        // "revelado" consistente sin animar.
        if (reduce) {
            targets.forEach((t) => t.classList.add('revealed'));
            return;
        }

        const triggers: ScrollTrigger[] = [];
        const timeouts: number[] = [];

        // Umbral alineado con `start: 'top 88%'`: si el borde superior ya cruzó
        // el 88% del viewport, la tarjeta se considera "entrada".
        const vh = window.innerHeight || document.documentElement.clientHeight;

        targets.forEach((t, i) => {
            // Bug R1: al filtrar aparecen tarjetas nuevas ya visibles (o sin
            // scroll posible). Sin esto quedarían en opacity:0 para siempre
            // porque su onEnter nunca se dispara. Las revelamos en el acto y no
            // les creamos trigger.
            if (revealInView) {
                const rect = t.getBoundingClientRect();
                if (rect.top < vh * 0.88 && rect.bottom > 0) {
                    t.classList.add('revealed');
                    return;
                }
            }
            const st = ScrollTrigger.create({
                trigger: t,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    // Cascada: mismo escalonado (~70ms) que la utilidad CSS
                    // `.reveal-stagger` para mantener un único ritmo.
                    if (stagger && i > 0) {
                        timeouts.push(
                            window.setTimeout(() => t.classList.add('revealed'), i * 70)
                        );
                    } else {
                        t.classList.add('revealed');
                    }
                },
            });
            triggers.push(st);
        });

        return () => {
            triggers.forEach((t) => t.kill());
            timeouts.forEach((id) => window.clearTimeout(id));
        };
        // Sin `deps` el array es [stagger] — idéntico al original y a lo que usan
        // las demás páginas. Con `deps`, el efecto se re-ejecuta y recablea.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stagger, ...(deps ?? [])]);

    return ref;
}
