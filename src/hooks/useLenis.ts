import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Guard SSR: en build (node) no hay `window`; registrar el plugin a nivel de
// módulo reventaría el prerender. En cliente se registra con normalidad.
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Instancia singleton accesible fuera del hook (p. ej. ScrollToTop) para poder
// resetear el scroll de verdad — window.scrollTo no basta porque Lenis mantiene
// su propia posición interna y volvería a ella en el siguiente frame.
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export function useLenis() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Reduced motion: no inicializamos Lenis. Se conserva el scroll nativo
        // del navegador (instantáneo, sin interpolación). getLenis() devolverá
        // null y los consumidores (p. ej. ScrollToTop) ya lo contemplan con `?.`.
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        // El smooth-scroll es mejora progresiva: hasta que arranca, el scroll
        // nativo funciona igual. Diferimos su instanciación a post-paint con
        // requestIdleCallback (fallback setTimeout) para no competir con el
        // primer render; el efecto percibido es idéntico unos ms después.
        let lenis: Lenis | null = null;
        let rafCallback: ((time: number) => void) | null = null;
        let idleId = 0;
        let usedIdle = false;
        let cancelled = false;

        const start = () => {
            if (cancelled) return;
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
            });
            lenisInstance = lenis;

            rafCallback = (time: number) => lenis!.raf(time * 1000);
            gsap.ticker.add(rafCallback);
            gsap.ticker.lagSmoothing(0);
            lenis.on('scroll', ScrollTrigger.update);
        };

        if (typeof window.requestIdleCallback === 'function') {
            usedIdle = true;
            idleId = window.requestIdleCallback(start);
        } else {
            idleId = window.setTimeout(start, 1);
        }

        return () => {
            cancelled = true;
            // Cancela el arranque diferido si aún no corrió…
            if (usedIdle) window.cancelIdleCallback(idleId);
            else window.clearTimeout(idleId);
            // …y desmonta Lenis solo si ya se había creado.
            if (rafCallback) gsap.ticker.remove(rafCallback);
            if (lenis) {
                lenis.destroy();
                lenisInstance = null;
            }
        };
    }, []);
}
