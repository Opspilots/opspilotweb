export const ROUTES = {
    home: '/',
    soluciones: '/soluciones',
    productos: '/productos',
    servicios: '/servicios',
    casos: '/casos',
    precios: '/precios',
    recursos: '/recursos',
    contacto: '/contacto',
    diagnostico: '/diagnostico',
} as const;

// Old paths kept reachable via 301-style client redirect so external links
// and previously-shipped CTAs continue to land on the right page.
export const LEGACY_REDIRECTS: ReadonlyArray<readonly [from: string, to: string]> = [
    ['/services', ROUTES.servicios],
    ['/cases', ROUTES.casos],
    ['/pricing', ROUTES.precios],
    ['/resources', ROUTES.recursos],
    ['/contact', ROUTES.contacto],
    ['/demo', ROUTES.contacto],
    ['/product', ROUTES.productos],
];
