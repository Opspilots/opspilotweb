import type { RouteRecord } from 'vite-react-ssg';
import { RootLayout } from './components/layout/RootLayout';
import { RedirectTo } from './components/common/RedirectTo';
import { ROUTES, LEGACY_REDIRECTS } from './lib/routes';
import { RESOURCES } from './lib/resources';

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
