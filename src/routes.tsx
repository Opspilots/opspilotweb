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
        // Fallback de hidratación: vite-react-ssg añade un loader síncrono-async
        // (fetch del manifest de datos estáticos) a TODAS las rutas coincidentes
        // en build SSG, incluida esta raíz — no solo a los hijos `lazy`. Eso hace
        // que react-router v7 considere la ruta "no inicializada" en cada carga
        // inicial y, sin `HydrateFallback`, renderice `null` para TODO el árbol
        // mientras hidrata (log: "No `HydrateFallback` element provided..."):
        // un mismatch total contra el HTML pre-renderizado que en viewports
        // mobile (latencia real del fetch) hace que React descarte la hidratación
        // y monte un árbol nuevo desde cero, dejando duplicados <nav>/<footer>
        // del DOM SSR original junto a los recién montados.
        // Reutilizar el propio RootLayout como HydrateFallback evita el flash/CLS:
        // se renderiza en la MISMA posición del árbol que el `element` real (así
        // que Navbar/Footer no se remontan al resolver), y su <Outlet> interno
        // (vía useOutlet()) resuelve a `null` mientras tanto — sin contenido de
        // página que parpadee o cambie de layout.
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
