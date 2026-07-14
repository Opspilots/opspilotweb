import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import { RESOURCES, getResourceBySlug, type ResourceBlock } from '../lib/resources';
import sys from '../styles/page-system.module.css';
import styles from './ResourceDetail.module.css';
import { ArrowLeft, Clock, ExternalLink } from 'lucide-react';

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
        case 'link':
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
        default:
            return null;
    }
}

export const ResourceDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const resource = slug ? getResourceBySlug(slug) : undefined;

    const bodyRef = useScrollReveal<HTMLDivElement>();

    usePageSEO({
        title: resource ? `${resource.title} — Recursos OpsPilot` : 'Recurso no encontrado — OpsPilot',
        description: resource?.desc ?? 'Este recurso no existe o se ha movido.',
        canonical: resource ? `https://opspilot.es/recursos/${resource.slug}` : undefined,
    });

    if (!resource) {
        return <Navigate to={ROUTES.recursos} replace />;
    }

    const { cover } = resource;

    const related = RESOURCES.filter((r) => r.slug !== resource.slug && r.cat === resource.cat).slice(0, 2);
    const fallbackRelated = related.length > 0
        ? related
        : RESOURCES.filter((r) => r.slug !== resource.slug).slice(0, 2);

    return (
        <div className={sys.page}>
            {/* ═══ HEADER ═══ */}
            <section className={styles.header}>
                <div className={sys.container}>
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
                    </div>
                    <h1 className={styles.title}>{resource.title}</h1>
                    <p className={styles.lead}>{resource.desc}</p>
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
                                    <span className={styles.cat}>{r.cat}</span>
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
                            Diagnóstico gratuito de 30 minutos. Sin compromiso.
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
