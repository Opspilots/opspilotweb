export const ROUTES = {
    home: '/',
    soluciones: '/soluciones',
    servicios: '/servicios',
    casos: '/casos',
    precios: '/precios',
    recursos: '/recursos',
    // Hub de productos verticales. Hasta este bloque, `/productos` era un
    // LEGACY_REDIRECT hacia /recursos (los productos vivían como artículos del
    // blog); ahora es una página de verdad y ese redirect se ha retirado —
    // tenerlo declarado a la vez que la ruta habría dejado dos entradas con el
    // mismo path compitiendo en el router. Ver .seo/01-rutas-y-metadatos.md.
    productos: '/productos',
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
    // `/product` (en inglés, de una versión anterior de la web) sigue cayendo
    // en /recursos y no en el hub nuevo: nunca fue una URL nuestra publicada,
    // solo un alias defensivo, y no hay motivo para cambiar a dónde apunta.
    //
    // `/productos` YA NO ESTÁ AQUÍ. Era un redirect a /recursos porque los
    // productos vivían como artículos del blog; desde este bloque es una página
    // real (ROUTES.productos → src/pages/Products.tsx). Dejarlo declarado
    // habría metido dos rutas con el mismo path en routes.tsx.
    ['/product', ROUTES.recursos],
];
