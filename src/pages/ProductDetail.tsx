import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TextLink } from '../components/common/TextLink';
import { PageSEO } from '../hooks/usePageSEO';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ROUTES } from '../lib/routes';
import { getResourceBySlug, type Resource, type ResourceBlock } from '../lib/resources';
import { buildBreadcrumb, buildFAQ, ORG_ID, ORG_LOGO, ORG_NAME, SITE_URL } from '../lib/seo';
import { StructuredData } from '../components/seo/StructuredData';
import { ProductPreview } from '../components/marketing/ProductPreview';
import { getProductPage, getPageProduct, isLinkable, getSector, productPagePath } from '../data';
import sys from '../styles/page-system.module.css';
import styles from './ProductDetail.module.css';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * /productos/<slug>/ — la página de un producto vertical
 * ═══════════════════════════════════════════════════════════════════════
 *
 * ─── EL PROBLEMA QUE ESTA PÁGINA TIENE QUE RESOLVER BIEN ───
 *
 * Esta página cuenta lo mismo que dos artículos de /recursos que HOY están
 * publicados e indexables. Si el texto se copiara aquí habría dos versiones del
 * mismo contenido: dos URLs nuestras compitiendo entre sí en el índice (que es
 * justo lo que este bloque venía a evitar) y, peor a largo plazo, dos ficheros
 * que divergen en cuanto alguien corrija una frase en uno solo.
 *
 * Así que NO SE COPIA NI UN PÁRRAFO. El cuerpo entero de esta página se lee de
 * `src/lib/resources.ts` en tiempo de render:
 *
 *   · el artículo de producto  → `Product.resourceSlug` (products.ts)
 *   · el caso práctico         → `ProductPage.caseSlug`  (productPages.ts)
 *
 * El día que se activen las 301 y esos dos artículos dejen de servirse por su
 * URL, sus objetos siguen en resources.ts alimentando esta página: no hay nada
 * que migrar ni dos versiones que reconciliar. Y mientras tanto, corregir una
 * errata en el artículo la corrige en los dos sitios a la vez.
 *
 * La otra mitad del plan es el `noindex` (ver `ProductPage.noindex` en
 * productPages.ts, donde está escrito cómo y cuándo se levanta): mientras los
 * originales sigan publicados, esta página no entra en el índice ni en el
 * sitemap.
 *
 * ─── QUÉ SE OMITE DEL ARTÍCULO Y POR QUÉ ───
 *
 * Los bloques `type: 'link'`. Los dos artículos terminan con el mismo par de
 * enlaces (el cross-link a /soluciones y el enlace a la aplicación), así que
 * componerlos tal cual daría CUATRO enlaces repetidos en mitad de la prosa,
 * dos de ellos idénticos. Esta página los pinta UNA vez y donde tienen sentido
 * aquí: el de producción arriba, junto al H1, y el de sector abajo, en el
 * bloque de navegación. Ver `stripLinks`.
 *
 * Es el único bloque que se filtra. Todo lo demás —párrafos, listas, notas,
 * encabezados— se pinta íntegro y en su orden original.
 */

/* ─── El renderizador de bloques ────────────────────────────────────────
   Estructuralmente igual al de ResourceDetail.tsx y a propósito NO importado
   de allí: aquel resuelve enlaces contra el registro de productos (los
   artículos llevan la URL a pelo y tienen que pasar por el interruptor de
   disponibilidad) y aquí los enlaces ni siquiera llegan — se filtran antes.
   Compartirlo habría significado exportar un componente con una prop para
   apagar la mitad de su trabajo. */

/** ¿A qué nivel se pinta un `h2` del recurso?
 *
 *  El artículo de producto se compone directamente bajo el `<h1>` de la
 *  página, así que sus `h2` son `h2` de verdad. El caso práctico, en cambio,
 *  entra DENTRO de una sección que ya tiene su propio `<h2>` (su título), así
 *  que sus encabezados internos bajan a `h3`. Sin esto, el caso práctico
 *  metería cuatro `h2` hermanos del titular de su propia sección y el esquema
 *  de encabezados diría que son cuatro temas nuevos de la página, no cuatro
 *  partes de un caso. */
type HeadingLevel = 'h2' | 'h3';

function Block({ block, headingLevel }: { block: ResourceBlock; headingLevel: HeadingLevel }) {
    switch (block.type) {
        // Ternario explícito y no una etiqueta dinámica (`const H = headingLevel;
        // <H>`): esa forma es más corta pero depende de que TypeScript resuelva
        // una unión de etiquetas intrínsecas como tipo de elemento JSX, que es
        // justo el punto donde su comportamiento ha ido cambiando entre
        // versiones. Dos ramas de una línea no merecen esa apuesta.
        case 'h2':
            return headingLevel === 'h3' ? (
                <h3 className={styles.blockH2}>{block.text}</h3>
            ) : (
                <h2 className={styles.blockH2}>{block.text}</h2>
            );
        case 'p':
            return <p className={styles.blockP}>{block.text}</p>;
        case 'ul':
            return (
                <ul className={styles.blockList}>
                    {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            );
        case 'ol':
            return (
                <ol className={styles.blockList}>
                    {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ol>
            );
        case 'note':
            return <p className={styles.blockNote}>{block.text}</p>;
        // `link` no se pinta aquí: los filtra `stripLinks` antes de llegar (ver
        // la cabecera del fichero). El caso está escrito igualmente para que el
        // `switch` siga siendo exhaustivo si mañana alguien deja de filtrarlos.
        case 'link':
        default:
            return null;
    }
}

/** Quita los bloques de enlace del cuerpo de un recurso. Ver la cabecera. */
function stripLinks(blocks: readonly ResourceBlock[]): ResourceBlock[] {
    return blocks.filter((b) => b.type !== 'link');
}

const ResourceBody: React.FC<{ resource: Resource; headingLevel: HeadingLevel }> = ({
    resource,
    headingLevel,
}) => (
    <>
        {stripLinks(resource.blocks).map((block, i) => (
            <Block key={i} block={block} headingLevel={headingLevel} />
        ))}
    </>
);

export const ProductDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const page = slug ? getProductPage(slug) : undefined;

    // La vista previa sí lleva reveal (es una figura, y aparecer al entrar en
    // pantalla es la mitad de su gracia). La PROSA no: es el contenido por el
    // que existe esta página, y `.reveal` la deja en `opacity: 0` hasta que el
    // hook de scroll añade `.revealed`. Está en el HTML prerenderizado en
    // ambos casos, pero un texto que depende de JS para verse no es un texto
    // que quieras poner justo debajo del H1 de tu página de aterrizaje.
    const previewRef = useScrollReveal<HTMLDivElement>();

    if (!page) {
        return <Navigate to={ROUTES.productos} replace />;
    }

    const product = getPageProduct(page);
    const sector = product ? getSector(product.sectorId) : undefined;
    const article = product ? getResourceBySlug(product.resourceSlug) : undefined;
    const study = page.caseSlug ? getResourceBySlug(page.caseSlug) : undefined;

    // Guardia real, no defensiva. `PRODUCT_PAGES` referencia el producto por FK
    // tipada (`ProductId`), así que el producto no puede faltar; el artículo sí
    // podría si alguien borra un recurso sin mirar quién lo consume. Sin
    // artículo esta página se quedaría en un H1 y un esquema, o sea justo la
    // "página flaca" que la especificación dice que no hay que publicar.
    if (!product || !article) {
        return <Navigate to={ROUTES.productos} replace />;
    }

    const canonical = `${SITE_URL}${productPagePath(page)}`;

    // ── FAQ: la del artículo + la del caso, en ese orden ──
    // Google exige que el marcado FAQPage se corresponda con contenido VISIBLE.
    // Por eso esta misma lista alimenta el JSON-LD y el bloque de preguntas de
    // abajo — una sola variable, imposible que se separen.
    const faq = [...(article.faq ?? []), ...(study?.faq ?? [])];

    // ── SoftwareApplication ──
    // Se construye aquí y no en src/lib/seo.ts (que sí tiene los builders
    // compartidos de Article, FAQPage y BreadcrumbList) porque hoy tiene UN
    // consumidor y porque necesitaría importar el registro de productos dentro
    // de la capa de SEO. Mismo criterio que ResourceDetail, que enriquece su
    // Article en el sitio en vez de ensanchar el builder.
    //
    // `url` apunta a ESTA página y no a la aplicación: schema.org pide la URL
    // canónica del ítem descrito, y quien describe el producto es esta página.
    // La aplicación real va en `sameAs`, y solo si `isLinkable` lo permite —
    // declarar en los datos estructurados un destino que hemos decidido no
    // enlazar en la interfaz sería contradecirnos por escrito.
    const softwareData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: product.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: 'es-ES',
        url: canonical,
        description: page.description,
        ...(isLinkable(product.site) ? { sameAs: [product.site.url] } : {}),
        publisher: {
            '@type': 'Organization',
            '@id': ORG_ID,
            name: ORG_NAME,
            logo: { '@type': 'ImageObject', url: ORG_LOGO },
        },
    };

    const breadcrumbData = buildBreadcrumb([
        { name: 'Inicio', url: `${SITE_URL}/` },
        { name: 'Productos', url: `${SITE_URL}/productos/` },
        { name: product.name, url: canonical },
    ]);

    return (
        <div className={sys.page}>
            {/* ⛔ `noindex` TEMPORAL. No se decide aquí: sale de
                `ProductPage.noindex` (src/data/productPages.ts), que es donde
                está escrito por qué está puesto y qué hay que hacer para
                quitarlo — resumen: quitar la bandera Y activar las 301 de la §4
                de .seo/01-rutas-y-metadatos.md EN EL MISMO DESPLIEGUE, nunca por
                separado. Mientras tanto esta ruta queda fuera del índice y, de
                paso, fuera del sitemap (scripts/generate-sitemap.mjs descarta
                todo HTML con noindex en su meta robots). */}
            <PageSEO
                title={page.title}
                description={page.description}
                canonical={canonical}
                noindex={page.noindex}
            />
            <StructuredData data={softwareData} />
            <StructuredData data={breadcrumbData} />
            {faq.length > 0 && <StructuredData data={buildFAQ(faq)} />}

            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={sys.container}>
                    <div className={sys.pageHeroContent}>
                        <Link to={ROUTES.productos} className={styles.backLink}>
                            <ArrowLeft size={15} strokeWidth={2} />
                            Todos los productos
                        </Link>
                        {sector && <p className={styles.eyebrow}>{sector.label}</p>}
                        {/* El H1 sale de `ProductPage.h1` y NO del title ni del
                            nombre del producto: son tres textos con tres
                            trabajos distintos (competir en la SERP, hablarle a
                            quien ya entró, y nombrar el producto). Ver la §2 de
                            la especificación. */}
                        <h1 className={sys.pageHeroTitle}>{page.h1}</h1>
                        {/* El subtítulo es la `desc` del artículo, no una frase
                            nueva: misma regla que el cuerpo — una sola copia del
                            texto, y vive en resources.ts. */}
                        <p className={sys.pageHeroSubtitle}>{article.desc}</p>
                        <div className={sys.pageHeroCta}>
                            {/* El enlace a producción pasa por `isLinkable`: es
                                el ÚNICO sitio del repo donde se decide si un
                                destino externo se puede enlazar hoy. Si el
                                producto se marca `down` en products.ts, este
                                botón desaparece sin tocar esta página. */}
                            {isLinkable(product.site) && (
                                <a
                                    className={styles.siteLink}
                                    href={product.site.url}
                                    target="_blank"
                                    rel="noopener"
                                >
                                    {product.site.label}
                                    <ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
                                </a>
                            )}
                            <Link to={ROUTES.contacto}>
                                <Button variant="secondary" size="lg">Cuéntanos tu caso</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ VISTA PREVIA ═══
                Reutiliza tal cual el componente de la cuarta página del panel
                de /soluciones. NO se ha tocado ni una línea de él, y por eso
                sigue recibiendo un `Sector` y no un `Product`: cambiarle la
                firma para que aceptara las dos formas habría metido una rama
                nueva en un componente que hoy tiene un consumidor probado, a
                cambio de nada — el sector se resuelve aquí en una línea desde
                `product.sectorId`. Lo único que cambia respecto a /soluciones es
                el contenedor: aquí no hay un panel de 288px, así que la maqueta
                respira hasta 880px (ver `.previewFrame`). */}
            {sector && (
                <section className={styles.previewSection}>
                    <div className={sys.container}>
                        <header className={styles.previewHeader}>
                            <h2 className={styles.sectionH2}>Así es por dentro</h2>
                        </header>
                        <div className={`${styles.previewFrame} reveal`} ref={previewRef}>
                            <ProductPreview sector={sector} />
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ CUERPO — compuesto desde /recursos, cero copia ═══ */}
            <section className={styles.bodySection}>
                <div className={`${sys.container} ${styles.bodyContainer}`}>
                    <article className={styles.article}>
                        <ResourceBody resource={article} headingLevel="h2" />

                        {/* El caso práctico, como sección propia dentro de la
                            misma página. Sus `h2` bajan a `h3` para que cuelguen
                            de este titular y no compitan con él. */}
                        {study && (
                            <section className={styles.caseSection}>
                                <p className={styles.eyebrow}>Caso práctico</p>
                                <h2 className={styles.caseTitle}>{study.title}</h2>
                                <ResourceBody resource={study} headingLevel="h3" />
                            </section>
                        )}

                        {/* Las preguntas: mismas que el JSON-LD de arriba,
                            misma variable. Visibles, que es lo que Google exige
                            para aceptar el marcado FAQPage. */}
                        {faq.length > 0 && (
                            <section className={styles.faqSection}>
                                <h2 className={styles.blockH2}>Preguntas frecuentes</h2>
                                {faq.map((item, i) => (
                                    <React.Fragment key={i}>
                                        <h3 className={styles.faqQ}>{item.q}</h3>
                                        <p className={styles.blockP}>{item.a}</p>
                                    </React.Fragment>
                                ))}
                            </section>
                        )}
                    </article>
                </div>
            </section>

            {/* ═══ NAVEGACIÓN DE SALIDA ═══
                Los dos enlaces que los artículos originales llevaban al final
                (ver `stripLinks`), pintados una sola vez y donde se leen como
                navegación y no como interrupción de la prosa. El ancla del
                sector sale de `product.sectorId`, así que no hay ni un `#` a
                mano. */}
            <section className={`${sys.sectionLoose} ${sys.sectionAlt}`}>
                <div className={sys.container}>
                    <div className={styles.exitLinks}>
                        <TextLink to={`${ROUTES.soluciones}#${product.sectorId}`} tone="strong" size="md">
                            El servicio a medida para {sector?.label.toLowerCase() ?? 'tu sector'} en Soluciones
                        </TextLink>
                        <TextLink to={ROUTES.productos} tone="muted" size="md">
                            Ver todos los productos
                        </TextLink>
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
                        <h2 className={sys.endCtaTitle}>¿Lo montamos en tu negocio?</h2>
                        <p className={sys.endCtaSub}>
                            30 minutos gratis para ver si esto encaja en tu operativa. Sin compromiso.
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
