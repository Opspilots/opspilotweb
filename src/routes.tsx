import type { RouteRecord } from 'vite-react-ssg';
import { RootLayout } from './components/layout/RootLayout';
import { RedirectTo } from './components/common/RedirectTo';
import { ROUTES, LEGACY_REDIRECTS } from './lib/routes';
import { RESOURCES } from './lib/resources';
import { PRODUCT_PAGES } from './data/productPages';

// Los paths hijos van relativos a la raíz '/', sin barra inicial.
const stripLeading = (p: string) => p.replace(/^\//, '');

// Redirects: alias en español + URLs antiguas en inglés → destino canónico.
const redirectRoutes: RouteRecord[] = [
    { path: stripLeading(ROUTES.servicios), element: <RedirectTo to={ROUTES.contacto} /> },
    { path: stripLeading(ROUTES.precios), element: <RedirectTo to={ROUTES.contacto} /> },
    { path: stripLeading(ROUTES.diagnostico), element: <RedirectTo to={ROUTES.contacto} /> },
    ...LEGACY_REDIRECTS.map(([from, to]) => ({
        path: stripLeading(from),
        element: <RedirectTo to={to} />,
    })),
];

export const routes: RouteRecord[] = [
    {
        path: '/',
        element: <RootLayout />,
        // Fallback de hidratación defensivo (ya NO cubre una carrera real).
        //
        // Contexto histórico: vite-react-ssg añade un loader síncrono-async
        // (fetch del manifest de datos estáticos) a TODAS las rutas coincidentes
        // en build SSG, incluida esta raíz. Antes, el `loaderData` embebido por
        // el SSR en `window.__staticRouterHydrationData` llegaba vacío (`{}`)
        // para cualquier ruta sin loader de usuario real — así que react-router
        // consideraba la ruta "no inicializada" en cada carga inicial y, sin
        // `HydrateFallback`, renderizaba `null` para TODO el árbol mientras
        // esperaba ese fetch de red (log: "No `HydrateFallback` element
        // provided..."). En Home, cuyo chunk es bastante más pesado que el del
        // resto de páginas, esa ventana asíncrona a veces perdía la carrera
        // contra `hydrateRoot()` y dejaba <main> vacío para siempre (React
        // error #418, no siempre recuperable) — reproducido y confirmado en
        // ~10% de las cargas a 375px y ~80% a 768px antes del fix.
        //
        // El root cause real está arreglado de raíz vía patch a
        // `vite-react-ssg` (ver patches/vite-react-ssg+0.9.1.patch): el build
        // SSR ahora rellena `loaderData` con una entrada por cada ruta
        // coincidente, así que `window.__staticRouterHydrationData` siempre
        // satisface a react-router y `router.state.initialized` es `true`
        // desde el primer render de cliente — sin fetch de red de por medio,
        // sin ventana de carrera. Este `HydrateFallback` ya no se llega a
        // invocar en el camino normal; se deja como red de seguridad (mismo
        // componente, misma posición en el árbol, sin remonte de Navbar/Footer
        // si algún día algo distinto vuelve a dejar la ruta "no inicializada").
        HydrateFallback: RootLayout,
        entry: 'src/components/layout/RootLayout.tsx',
        children: [
            {
                index: true,
                lazy: async () => ({ Component: (await import('./pages/Home')).Home }),
            },
            {
                path: stripLeading(ROUTES.soluciones),
                lazy: async () => ({ Component: (await import('./pages/Soluciones')).Soluciones }),
            },
            {
                path: stripLeading(ROUTES.casos),
                lazy: async () => ({ Component: (await import('./pages/Cases')).Cases }),
            },
            {
                path: stripLeading(ROUTES.recursos),
                lazy: async () => ({ Component: (await import('./pages/Resources')).Resources }),
            },
            {
                path: `${stripLeading(ROUTES.recursos)}/:slug`,
                lazy: async () => ({ Component: (await import('./pages/ResourceDetail')).ResourceDetail }),
                // Prerenderiza una página estática por cada recurso real.
                getStaticPaths: () => RESOURCES.map((r) => `${stripLeading(ROUTES.recursos)}/${r.slug}`),
            },
            {
                path: stripLeading(ROUTES.productos),
                lazy: async () => ({ Component: (await import('./pages/Products')).Products }),
            },
            {
                // RUTA DINÁMICA CON `getStaticPaths`, IGUAL QUE /recursos/:slug,
                // y no una ruta estática por producto. El motivo no es ahorrar
                // líneas en este fichero:
                //
                //  · Las páginas de producto son la MISMA página con distintos
                //    datos. Todas componen su cuerpo desde /recursos, todas
                //    montan la misma vista previa, el mismo SoftwareApplication
                //    y el mismo breadcrumb. Con rutas estáticas habría que
                //    escribir un componente por producto que se limitaría a
                //    pasar un slug distinto — tres copias de un fichero que
                //    divergen en cuanto alguien arregle un detalle en una sola.
                //  · Publicar la segunda página (presupuestos-obra, en cuanto
                //    se decida el nombre del producto) es añadir UNA FILA en
                //    src/data/productPages.ts. Cero cambios aquí, cero riesgo de
                //    publicar el componente y olvidar la ruta.
                //  · El prerender sale igual de estático: `getStaticPaths` le
                //    da a vite-react-ssg la lista exacta de URLs, así que en
                //    dist/ hay una carpeta con su index.html por producto — el
                //    contenido y los enlaces están en el HTML servido, que es
                //    la condición que impone el SSG.
                //
                // La lista sale de PRODUCT_PAGES y NO de PRODUCTS: son 4
                // productos y hoy 1 sola página. Prerenderizar sobre PRODUCTS
                // publicaría las dos rutas que la especificación deja fuera a
                // propósito (§5 y el TODO de marca).
                path: `${stripLeading(ROUTES.productos)}/:slug`,
                lazy: async () => ({ Component: (await import('./pages/ProductDetail')).ProductDetail }),
                getStaticPaths: () =>
                    PRODUCT_PAGES.map((p) => `${stripLeading(ROUTES.productos)}/${p.slug}`),
            },
            {
                path: stripLeading(ROUTES.contacto),
                lazy: async () => ({ Component: (await import('./pages/Contact')).Contact }),
            },
            ...redirectRoutes,
            // Ruta 404 estática (genera dist/404/index.html con noindex).
            {
                path: '404',
                lazy: async () => ({ Component: (await import('./pages/NotFound')).NotFound }),
            },
            // Catch-all en runtime para cualquier URL desconocida (SPA fallback).
            {
                path: '*',
                lazy: async () => ({ Component: (await import('./pages/NotFound')).NotFound }),
            },
        ],
    },
];
