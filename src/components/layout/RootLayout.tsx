import { Suspense, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layout } from './Layout';
import { ScrollToTop } from '../common/ScrollToTop';
import { AmbientBackground } from '../fx/AmbientBackground';

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const pageVariants = {
    initial: { opacity: 0, y: 26, scale: 0.992, filter: 'blur(10px)' },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: EASE_EXPO },
    },
    exit: {
        opacity: 0,
        y: -14,
        scale: 0.996,
        filter: 'blur(6px)',
        transition: { duration: 0.32, ease: [0.4, 0, 1, 1] as const },
    },
};

/**
 * Envuelve el `<Outlet>` de la ruta con las transiciones de página de
 * motion/react (mismas variantes que antes vivían en App.tsx). Usa
 * `useOutlet()` para que AnimatePresence conserve la vista saliente durante
 * la transición mode="wait".
 */
function AnimatedOutlet() {
    const location = useLocation();
    const outlet = useOutlet();
    const wrapperRef = useRef<HTMLDivElement>(null);

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                ref={wrapperRef}
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                onAnimationComplete={(def) => {
                    // Al terminar la entrada, limpiar transform/filter/will-change
                    // residuales. Si se quedan, este wrapper crea un containing
                    // block y rompe TODO position:fixed de la página (pin de
                    // ScrollTrigger y AmbientBackground pasan a ser relativos a
                    // él en vez de al viewport). Durante la transición estás
                    // arriba del todo, sin secciones fijadas, así que ahí es
                    // inofensivo — solo importa el estado en reposo.
                    if (def === 'enter' && wrapperRef.current) {
                        wrapperRef.current.style.transform = 'none';
                        wrapperRef.current.style.filter = 'none';
                        wrapperRef.current.style.willChange = 'auto';
                        // Los pins de ScrollTrigger se crearon mientras el
                        // wrapper aún tenía transform (containing block), así que
                        // sus medidas quedaron obsoletas. Recalcular ahora que el
                        // fixed vuelve a referirse al viewport.
                        ScrollTrigger.refresh();
                    }
                }}
                style={{ minHeight: '100%' }}
            >
                {outlet}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Layout raíz de la app en formato data-router (vite-react-ssg).
 * Reproduce la estructura del antiguo App.tsx: chrome compartido (Layout con
 * Lenis, cursor, navbar, footer) + ScrollToTop + Outlet animado bajo Suspense.
 */
export function RootLayout() {
    const location = useLocation();
    // AmbientBackground se monta SIEMPRE aquí, como hermano de <AnimatedOutlet>
    // (fuera del wrapper animado de motion/react) — nunca dentro de la página
    // de ruta. `pageVariants.enter` fija `filter: 'blur(0px)'` en el
    // <motion.div> del outlet, y ese valor (aunque visualmente sea un no-op)
    // instaura un containing block nuevo para cualquier descendiente
    // `position: fixed`: motion/react reafirma ese estilo desde su propio
    // scheduler (rAF), así que intentar limpiarlo a mano después (transform/
    // filter/willChange = 'none') no es fiable — motion lo vuelve a escribir.
    // Antes Home montaba su propio `<AmbientBackground variant="full" />`
    // DENTRO de Home.tsx (es decir, dentro de {outlet}, descendiente del
    // wrapper animado), así que en Home — y solo en Home — su capa fixed
    // dejaba de anclarse al viewport: `.root`/`.grain` pasaban a medirse
    // contra la altura total del documento, y cualquier cambio de esa altura
    // (swap de fuente, reveals, ScrollTrigger.refresh) se contabilizaba como
    // un layout shift enorme (root cause confirmado del CLS ~0.39–1.46 que
    // medía Lighthouse en Home). Unificado aquí, con la MISMA variante que ya
    // usaban el resto de rutas, se elimina la causa de raíz en vez de
    // parchear el síntoma.
    const isHome = location.pathname === '/';

    return (
        <Layout>
            <ScrollToTop />
            <AmbientBackground variant={isHome ? 'full' : 'subtle'} />
            <Suspense fallback={null}>
                <AnimatedOutlet />
            </Suspense>
        </Layout>
    );
}
