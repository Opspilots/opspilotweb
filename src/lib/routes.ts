export const ROUTES = {
    home: '/',
    soluciones: '/soluciones',
    servicios: '/servicios',
    casos: '/casos',
    precios: '/precios',
    recursos: '/recursos',
    contacto: '/contacto',
    diagnostico: '/diagnostico',
    // TODO(negocio): la página NO existe todavía — este enlace responde 404
    // hasta que se cree. Se declara igualmente porque la cláusula de
    // consentimiento del embudo (HeroLeadWidget) tiene que enlazar a algún
    // sitio, y no se puede redactar la política sin razón social ni NIF (ver
    // src/lib/company.ts). Al estar en ROUTES, el día que la página exista se
    // conecta añadiendo la ruta en routes.tsx y ni un consumidor cambia.
    privacidad: '/privacidad',
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
    // Los productos ahora viven como artículos dentro de Recursos.
    ['/product', ROUTES.recursos],
    ['/productos', ROUTES.recursos],
];
