import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { TextLink } from '../components/common/TextLink';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import { RESOURCES, getResourceBySlug, type ResourceBlock } from '../lib/resources';
import { StructuredData } from '../components/seo/StructuredData';
import { buildArticle, buildBreadcrumb, buildFAQ, SITE_URL } from '../lib/seo';
import sys from '../styles/page-system.module.css';
import styles from './ResourceDetail.module.css';
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react';

function Block({ block }: { block: ResourceBlock }) {
    switch (block.type) {
        case 'h2':
            return <h2 className={styles.blockH2}>{block.text}</h2>;
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
        case 'link': {
            // Rutas internas (p.ej. cross-link de vuelta a /soluciones) navegan
            // con el router y sin el icono de salida; los enlaces a producto
            // (dominio externo) mantienen el comportamiento previo: nueva
            // pestaña + icono de enlace externo.
            const isInternal = block.href.startsWith('/');
            if (isInternal) {
                return (
                    <p className={styles.blockLinkWrap}>
                        <TextLink to={block.href} tone="strong" size="sm">
                            {block.text}
                        </TextLink>
                    </p>
                );
            }
            return (
                <p className={styles.blockLinkWrap}>
                    <a
                        href={block.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.blockLink}
                    >
                        {block.text}
                        <ExternalLink size={15} strokeWidth={2} />
                    </a>
                </p>
            );
        }
        default:
            return null;
    }
}

export const ResourceDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const resource = slug ? getResourceBySlug(slug) : undefined;

    const bodyRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    if (!resource) {
        return <Navigate to={ROUTES.recursos} replace />;
    }

    const { cover } = resource;

    const related = RESOURCES.filter((r) => r.slug !== resource.slug && r.cat === resource.cat).slice(0, 2);
    const fallbackRelated = related.length > 0
        ? related
        : RESOURCES.filter((r) => r.slug !== resource.slug).slice(0, 2);

    // ── Structured data (JSON-LD) por artículo ──
    const articleUrl = `${SITE_URL}/recursos/${resource.slug}/`;
    const publishedISO = resource.date;
    const modifiedISO = resource.updated ?? resource.date;
    // Article enriquecido: partimos del builder compartido y le añadimos
    // datePublished/dateModified/author desde el Resource sin tocar seo.ts.
    const articleData = {
        ...buildArticle(resource, articleUrl),
        ...(publishedISO ? { datePublished: publishedISO } : {}),
        ...(modifiedISO ? { dateModified: modifiedISO } : {}),
        author: { '@type': 'Person', name: resource.author ?? 'Equipo OpsPilot' },
    };
    const breadcrumbData = buildBreadcrumb([
        { name: 'Inicio', url: `${SITE_URL}/` },
        { name: 'Recursos', url: `${SITE_URL}/recursos/` },
        { name: resource.title, url: articleUrl },
    ]);

    // <title> con control de longitud: con el sufijo de marca, Google trunca a
    // partir de ~60 caracteres. Si el título del recurso ya es largo, lo usamos
    // solo (el H1 y el breadcrumb ya dejan claro que es contenido de OpsPilot).
    const TITLE_SUFFIX = ' — Recursos OpsPilot';
    const pageTitle = resource.title.length + TITLE_SUFFIX.length <= 60
        ? `${resource.title}${TITLE_SUFFIX}`
        : resource.title;

    // Fecha visible (discreta), formateada en español.
    const formattedDate = resource.date
        ? new Date(resource.date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : null;

    return (
        <div className={sys.page}>
            <PageSEO
                title={pageTitle}
                description={resource.desc}
                canonical={`https://opspilot.es/recursos/${resource.slug}/`}
            />
            <StructuredData data={articleData} />
            <StructuredData data={breadcrumbData} />
            {resource.faq && resource.faq.length > 0 && (
                <StructuredData data={buildFAQ(resource.faq)} />
            )}
            {/* ═══ HEADER — reutiliza el hero interno compartido (sys.pageHero)
                 para igualar ritmo/medida/hairline con el resto de páginas ═══ */}
            <section className={sys.pageHero}>
                <div className={sys.container}>
                    <div className={sys.pageHeroContent}>
                        <Link to={ROUTES.recursos} className={styles.backLink}>
                            <ArrowLeft size={15} strokeWidth={2} />
                            Todos los recursos
                        </Link>
                        <div className={styles.headerMeta}>
                            <span className={styles.cat}>{resource.cat}</span>
                            <span className={styles.time}>
                                <Clock size={12} strokeWidth={2} />
                                {resource.time} lectura
                            </span>
                            {formattedDate && (
                                <span className={styles.time}>
                                    <Calendar size={12} strokeWidth={2} />
                                    {formattedDate}
                                </span>
                            )}
                        </div>
                        <h1 className={styles.title}>{resource.title}</h1>
                        <p className={styles.lead}>{resource.desc}</p>
                    </div>
                </div>
            </section>

            {/* ═══ COVER (16:9, solo si el recurso tiene `cover`) ═══ */}
            {cover && (
                <section className={styles.coverSection}>
                    <div className={sys.container}>
                        <div className={styles.coverFrame}>
                            <img className={styles.coverImg} src={cover} alt={resource.title} loading="lazy" />
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ ARTÍCULO ═══ */}
            <section className={styles.bodySection}>
                <div className={`${sys.container} ${styles.bodyContainer}`} ref={bodyRef}>
                    <article className={`${styles.article} reveal`}>
                        {resource.blocks.map((block, i) => (
                            <Block key={i} block={block} />
                        ))}
                        {resource.faq && resource.faq.length > 0 && (
                            <>
                                <h2 className={styles.blockH2}>Preguntas frecuentes</h2>
                                {resource.faq.map((item, i) => (
                                    <React.Fragment key={i}>
                                        <h3 className={styles.blockFaqQ}>{item.q}</h3>
                                        <p className={styles.blockP}>{item.a}</p>
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                    </article>
                </div>
            </section>

            {/* ═══ RELACIONADOS ═══ */}
            {fallbackRelated.length > 0 && (
                <section className={`${sys.sectionLoose} ${sys.sectionAlt}`}>
                    <div className={sys.container}>
                        <header className={sys.sectionHeader}>
                            <h2 className={sys.sectionTitle}>Sigue leyendo.</h2>
                        </header>
                        <div className={styles.relatedGrid}>
                            {fallbackRelated.map((r) => (
                                <Link key={r.slug} to={`/recursos/${r.slug}`} className={styles.relatedCard}>
                                    <div className={styles.relatedMeta}>
                                        <span className={styles.cat}>{r.cat}</span>
                                        <span className={styles.time}>
                                            <Clock size={11} strokeWidth={2} />
                                            {r.time} lectura
                                        </span>
                                    </div>
                                    <h3 className={styles.relatedTitle}>{r.title}</h3>
                                    <p className={styles.relatedDesc}>{r.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
                        <h2 className={sys.endCtaTitle}>¿Quieres ayuda personalizada?</h2>
                        <p className={sys.endCtaSub}>
                            30 minutos gratis para ver si esto encaja en tu negocio. Sin compromiso.
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
