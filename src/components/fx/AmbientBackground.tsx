import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './AmbientBackground.module.css';

interface AmbientBackgroundProps {
    /**
     * · 'full' (Home): mesh completo — 3 halos que derivan + rejilla + grano +
     *   viñeta. Es la versión "hero" cinematográfica.
     * · 'subtle' (páginas internas): solo grano + 1 halo cenital estático y
     *   tenue. Da profundidad al canvas navy sin competir con el contenido ni
     *   pagar la animación pesada de los 3 blobs.
     */
    variant?: 'full' | 'subtle';
}

/**
 * Capa ambiental global, fija detrás de todo el contenido:
 *   · dos/tres halos de luz (mint + ámbar + azul frío) muy tenues que
 *     derivan lentamente — dan profundidad al canvas navy plano.
 *   · una rejilla hairline casi imperceptible.
 *   · grano (SVG turbulence) + viñeta encima para el acabado "caro".
 *
 * La deriva de los halos se apaga bajo prefers-reduced-motion; el grano y la
 * viñeta son estáticos y siempre válidos. Es puramente decorativa
 * (aria-hidden, pointer-events:none) y se sitúa en z-index 0 — las secciones
 * viven por encima con fondos translúcidos, así que el glow asoma a través.
 *
 * La variante 'subtle' se usa en las rutas internas (ver RootLayout): no anima
 * nada, así que respeta reduced-motion por construcción, y su único halo es
 * mucho más tenue para no dañar contraste ni legibilidad.
 */
export function AmbientBackground({ variant = 'full' }: AmbientBackgroundProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // La deriva de los blobs solo existe en la variante completa; la sutil
        // es 100% estática (grano + halo fijo), así que no monta GSAP.
        if (variant !== 'full') return;

        const root = rootRef.current;
        if (!root) return;
        if (typeof window === 'undefined') return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // En móvil los halos quedan estáticos: la deriva con blur grande es cara
        // en GPUs móviles y aporta poco a pantalla pequeña.
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        if (reduce || isMobile) return;

        const blobs = root.querySelectorAll<HTMLElement>(`.${styles.blob}`);

        // La deriva es mejora progresiva: el fondo estático (halos + grano +
        // viñeta) se ve idéntico desde el primer frame; solo la animación GSAP
        // arranca tras el paint (requestIdleCallback, fallback setTimeout) para
        // no competir con el primer render. El desplazamiento es imperceptible
        // en el instante extra que tarda en empezar.
        let ctx: gsap.Context | null = null;
        let idleId = 0;
        let usedIdle = false;
        let cancelled = false;

        const start = () => {
            if (cancelled) return;
            // will-change solo mientras corre la deriva (aquí ya sabemos que NO
            // es móvil ni reduced-motion). Se limpia en el cleanup para no dejar
            // capas compuestas caras vivas de forma permanente.
            blobs.forEach((blob) => {
                blob.style.willChange = 'transform';
            });

            ctx = gsap.context(() => {
                blobs.forEach((blob, i) => {
                    gsap.to(blob, {
                        xPercent: i % 2 === 0 ? 12 : -14,
                        yPercent: i % 2 === 0 ? -10 : 12,
                        scale: 1.15,
                        duration: 22 + i * 6,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    });
                });
            }, root);
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
            ctx?.revert();
            blobs.forEach((blob) => {
                blob.style.willChange = '';
            });
        };
    }, [variant]);

    // Variante sutil: solo grano + 1 halo estático tenue. Sin rejilla, sin
    // viñeta, sin animación → coherente con Home pero mucho más contenida.
    if (variant === 'subtle') {
        return (
            <div className={`${styles.root} ${styles.rootSubtle}`} aria-hidden="true">
                <div className={`${styles.blob} ${styles.blobSubtle}`} />
                <div className={styles.grain} />
            </div>
        );
    }

    return (
        <div ref={rootRef} className={styles.root} aria-hidden="true">
            <div className={styles.grid} />
            <div className={`${styles.blob} ${styles.blobMint}`} />
            <div className={`${styles.blob} ${styles.blobWarm}`} />
            <div className={`${styles.blob} ${styles.blobBlue}`} />
            <div className={styles.grain} />
            <div className={styles.vignette} />
        </div>
    );
}
