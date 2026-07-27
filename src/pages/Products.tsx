import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TextLink } from '../components/common/TextLink';
import { PageSEO } from '../hooks/usePageSEO';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { ROUTES } from '../lib/routes';
import { getResourceBySlug } from '../lib/resources';
import { buildBreadcrumb, SITE_URL } from '../lib/seo';
import { StructuredData } from '../components/seo/StructuredData';
import type { Product } from '../data';
import {
    PRODUCTS,
    getProductPageByProductId,
    getSector,
    isLinkable,
    productPagePath,
} from '../data';
import sys from '../styles/page-system.module.css';
import styles from './Products.module.css';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * /productos/ — el hub de los productos verticales
 * ═══════════════════════════════════════════════════════════════════════
 *
 * ─── PARA QUÉ EXISTE ───
 *
 * Es el nodo que reparte autoridad hacia las páginas de producto, que hoy no la
 * reciben de ningún sitio. Los 4 productos están vivos y en producción, y hasta
 * ahora un visitante solo llegaba a ellos leyéndose entero un artículo de
 * /recursos: no aparecían ni en Inicio, ni en Soluciones, ni en Casos, ni en el
 * pie. Esta página es la puerta que faltaba.
 *
 * ─── DE DÓNDE SALEN LOS DATOS ───
 *
 * De ningún sitio de este fichero. Nombre, sector y URL de producción salen de
 * `PRODUCTS` (src/data/products.ts); la descripción de cada producto es la
 * `desc` de su artículo en /recursos; y si un producto tiene página propia lo
 * dice `PRODUCT_PAGES` (src/data/productPages.ts). Aquí no hay ni un nombre de
 * producto escrito a mano — publicar la página de Presupuestador es añadir una
 * fila en productPages.ts y esta rejilla se entera sola.
 *
 * ─── LOS DOS ENLACES DE CADA TARJETA ───
 *
 * Cada producto tiene un destino INTERNO (su página si la tiene, su artículo de
 * /recursos si todavía no) y, cuando se puede enlazar, uno EXTERNO a la
 * aplicación o web real. No es adorno: es la regla la que resuelve el caso de
 * EnergyDeal sin ninguna excepción escrita con su nombre.
 *
 * EnergyDeal es el único de los cuatro que NO va a tener página propia nunca, y
 * está argumentado en la §3 de .seo/01-rutas-y-metadatos.md: energydeal.es ya
 * es una web de marketing completa (Funcionalidades, Precios, Blog) con su
 * propio SEO. Crear /productos/energydeal/ pondría dos páginas NUESTRAS a
 * competir por las mismas búsquedas desde dos dominios distintos — la peor
 * forma de canibalización, porque ni siquiera se arregla con un canonical entre
 * ellas sin renunciar a una. Lo correcto es enlazarle desde aquí: se le presta
 * autoridad, no se le compite. Y eso es justo lo que hace la columna externa,
 * sin ningún `if` con su nombre dentro.
 *
 * El interruptor de disponibilidad manda sobre esa columna igual que en el
 * resto de la web: `isLinkable` es el único punto donde se decide si un destino
 * externo se pinta (hoy apaga el de Fiscalidad, que sirve una pantalla en
 * blanco). La tarjeta lo EXPLICA en vez de callárselo — con tres productos
 * enseñando enlace y uno no, el silencio se leería como "esto aún no existe",
 * que es exactamente lo falso.
 */

const SEO = {
    // Copiados literalmente de la §2 de .seo/01-rutas-y-metadatos.md (title 53
    // caracteres, description 150). No se redactan aquí.
    title: 'Productos: software vertical para tu sector · OpsPilot',
    description:
        'Productos verticales en producción: ERP de hostelería, presupuestos de obra con BC3 y plataforma fiscal con VeriFactu. Con acceso a la aplicación real.',
    canonical: `${SITE_URL}/productos/`,
} as const;

/** Lo que esta página necesita saber de un producto, ya resuelto.
 *
 *  Se calcula UNA vez a nivel de módulo y no en cada render: se deriva
 *  exclusivamente de `PRODUCTS`, `PRODUCT_PAGES`, `SECTORS` y `RESOURCES`, que
 *  son datos estáticos e inmutables. Mismo criterio que `PANEL_PAGE_LABELS` y
 *  `SECTOR_FAQ_SCHEMA` en Soluciones.tsx. */
interface ProductCard {
    product: Product;
    /** Etiqueta del sector al que sirve. */
    sectorLabel: string;
    /** Qué hace, en una frase. Es la `desc` de su artículo de /recursos: el
     *  texto ya está escrito y revisado, y copiarlo aquí sería crear una
     *  segunda versión que se desactualizaría el primer día. */
    summary: string;
    /** Ruta interna: la página de producto si existe, su artículo si no. */
    href: string;
    /** Y qué se le promete al visitante en ese destino. Cambia con el destino
     *  porque no es lo mismo abrir una ficha de producto que un artículo. */
    hrefLabel: string;
    /** ¿El destino interno es ya una página de producto? Solo para ordenar. */
    hasPage: boolean;
}

const CARDS: readonly ProductCard[] = PRODUCTS.map((product): ProductCard => {
    const page = getProductPageByProductId(product.id);
    const resource = getResourceBySlug(product.resourceSlug);
    return {
        product,
        sectorLabel: getSector(product.sectorId)?.label ?? '',
        // El fallback nunca se usa hoy (los 4 productos tienen artículo) pero
        // no puede reventar la página entera si alguien retira un recurso: la
        // tarjeta se queda sin frase, no sin existir.
        summary: resource?.desc ?? '',
        href: page ? productPagePath(page) : `/recursos/${product.resourceSlug}/`,
        hrefLabel: page ? 'Ver el producto' : 'Leer qué hace',
        hasPage: page !== undefined,
    };
})
    // Los productos CON página propia primero. El hub existe para repartir
    // autoridad hacia ellas: dejarlas debajo de tres tarjetas que apuntan a
    // /recursos sería enterrar justo lo que este bloque vino a levantar. Dentro
    // de cada grupo se respeta el orden de `PRODUCTS` (`sort` es estable en
    // todos los motores desde ES2019).
    .slice()
    .sort((a, b) => Number(b.hasPage) - Number(a.hasPage));

export const Products: React.FC = () => {
    const heroRef = useHeroReveal<HTMLDivElement>();
    const gridRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    // ItemList de los 4 productos con su URL REAL en opspilot.es.
    //
    // OJO, y esto hay que dejarlo escrito: el `@graph` de index.html declara ya
    // un ItemList de 4 SoftwareApplication (`@id` .../#productos) cuyas `url`
    // apuntan a `/recursos/<slug>/`. Ese HTML es estático, vive fuera del
    // bundler y NO se toca desde aquí — pero el día que se activen las 301
    // (§4 de la especificación) esas 4 URLs pasarán a redirigir y habrá que
    // actualizarlas a mano. Este bloque usa un `@id` distinto justamente para
    // no colisionar con él mientras conviven.
    const listData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${SITE_URL}/productos/#lista`,
        name: 'Productos verticales OpsPilot',
        itemListElement: CARDS.map((card, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: card.product.name,
            item: `${SITE_URL}${card.href}`,
        })),
    };

    return (
        <div className={sys.page}>
            {/* ⛔ `noindex` TEMPORAL, y aquí va escrito a mano (el hub no tiene
                fila en PRODUCT_PAGES, que describe páginas de producto).
                MOTIVO: este hub solo tiene sentido con sus páginas hijas dentro
                del índice. Publicarlo hoy metería en Google una página cuyo
                único enlace de producto lleva a una URL que le hemos dicho a
                Google que no indexe — un hub que reparte autoridad hacia un
                sitio al que no puede llegar.
                CÓMO LEVANTARLO: quitar la prop `noindex` de aquí abajo A LA VEZ
                que la de /productos/erp-hosteleria/ (ver `ProductPage.noindex`
                en src/data/productPages.ts) y que las 301 de la §4 de
                .seo/01-rutas-y-metadatos.md. Las tres cosas, en el MISMO
                despliegue. Nunca por separado.
                De regalo, esto también lo saca del sitemap: el generador
                descarta cualquier HTML con `noindex` en su meta robots (ver
                `isNoindex` en scripts/generate-sitemap.mjs). */}
            <PageSEO {...SEO} noindex />
            <StructuredData
                data={buildBreadcrumb([
                    { name: 'Inicio', url: `${SITE_URL}/` },
                    { name: 'Productos', url: `${SITE_URL}/productos/` },
                ])}
            />
            <StructuredData data={listData} />

            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={sys.container}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        {/* H1 de la §2 de la especificación, literal. El `<em>`
                            solo colorea una palabra: no cambia el texto. */}
                        <h1 className={`${sys.pageHeroTitle} reveal`}>
                            Software que ya está <em className={sys.pageHeroAccent}>funcionando</em>
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            Cuatro aplicaciones nuestras en producción, cada una construida para un
                            sector concreto. No son demos: se puede entrar y verlas.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ REJILLA ═══ */}
            <section className={styles.gridSection}>
                <div className={sys.container} ref={gridRef}>
                    <div className={styles.grid}>
                        {CARDS.map(({ product, sectorLabel, summary, href, hrefLabel }) => (
                            <article key={product.id} className={`${styles.card} reveal`}>
                                {/* El sector va ARRIBA y no debajo del nombre:
                                    "¿esto es lo mío?" se contesta antes por el
                                    sector que por el nombre del producto, que
                                    nadie conoce todavía. */}
                                <p className={styles.cardSector}>{sectorLabel}</p>
                                <h2 className={styles.cardName}>{product.name}</h2>
                                <p className={styles.cardSummary}>{summary}</p>

                                <div className={styles.cardLinks}>
                                    {/* Destino interno: <Link> del router, sin
                                        icono de salida — se queda en la web. */}
                                    <TextLink to={href} tone="strong" size="sm">
                                        {hrefLabel}
                                    </TextLink>

                                    {/* Destino externo, solo si hoy se puede
                                        enlazar. La etiqueta sale de
                                        `site.label` y está escrita para que se
                                        lea A DÓNDE va antes de pulsarla: no es
                                        lo mismo mandar a alguien a una web de
                                        marketing que soltarlo dentro de una
                                        aplicación con pantalla de acceso. */}
                                    {isLinkable(product.site) ? (
                                        <a
                                            className={styles.cardExternal}
                                            href={product.site.url}
                                            target="_blank"
                                            rel="noopener"
                                        >
                                            {product.site.label}
                                            <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
                                        </a>
                                    ) : (
                                        <p className={styles.cardUnavailable}>
                                            No accesible desde fuera ahora mismo; por eso no hay enlace.
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PUENTE A SOLUCIONES ═══
                Los productos son una de las dos mitades de lo que hacemos; la
                otra es el software a medida, que vive en /soluciones. Sin este
                enlace el hub se lee como un catálogo cerrado: "si no eres de
                estos cuatro sectores, aquí no hay nada para ti". */}
            <section className={`${sys.sectionLoose} ${sys.sectionAlt}`}>
                <div className={sys.container}>
                    <header className={sys.sectionHeader}>
                        <h2 className={sys.sectionTitle}>¿Y si tu sector no está aquí?</h2>
                    </header>
                    <p className={styles.bridgeText}>
                        Estos cuatro productos nacieron de proyectos a medida que acabaron
                        sirviendo a todo un sector. Si lo tuyo todavía no tiene su aplicación,
                        empieza por ahí: en Soluciones está cómo trabajamos sector a sector.
                    </p>
                    <TextLink to={ROUTES.soluciones} tone="strong" size="md">
                        Ver Soluciones por sector
                    </TextLink>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
                        <h2 className={sys.endCtaTitle}>¿Cuál encaja en tu negocio?</h2>
                        <p className={sys.endCtaSub}>
                            Media hora, gratis, sin compromiso. Miramos tu operativa y te decimos
                            si alguno te sirve — o si no te sirve ninguno.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="secondary" size="lg">Reservar diagnóstico</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
