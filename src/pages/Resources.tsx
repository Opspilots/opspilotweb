import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import { RESOURCES, RESOURCE_CATEGORIES, type ResourceCategory } from '../lib/resources';
import sys from '../styles/page-system.module.css';
import styles from './Resources.module.css';
import { TextLink } from '../components/common/TextLink';
import { ArrowRight, Clock, Search, X } from 'lucide-react';

const FORM_NEWSLETTER_URL = 'https://formsubmit.co/ajax/opspilot.contact@gmail.com';

type NLStatus = 'idle' | 'submitting' | 'success' | 'error';
type CategoryFilter = 'Todos' | ResourceCategory;

const CTA_BY_CAT: Record<ResourceCategory, string> = {
    Guía: 'Leer guía',
    Artículo: 'Leer artículo',
    'Caso práctico': 'Leer caso',
    Checklist: 'Ver checklist',
    Producto: 'Conocer producto',
};

function normalize(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();
}

const featured = RESOURCES.find((r) => r.featured)!;
const rest = RESOURCES.filter((r) => !r.featured);

const CoverSlot: React.FC<{ cover: string | undefined; label: string; className?: string }> = ({
    cover,
    label,
    className,
}) => (
    <div className={`${styles.cover}${className ? ` ${className}` : ''}`} aria-hidden="true">
        {cover ? (
            <img className={styles.coverImg} src={cover} alt="" loading="lazy" />
        ) : (
            <span className={styles.coverPh}>
                <span className={styles.coverDot} />
                {label}
            </span>
        )}
    </div>
);

export const Resources: React.FC = () => {
    usePageSEO({
        title: 'Recursos · Guías y artículos prácticos — OpsPilot',
        description:
            'Guías, artículos y herramientas gratuitas sobre automatización, software a medida y digitalización para PYMEs. Escritas para personas de negocio.',
        canonical: 'https://opspilot.es/recursos',
    });

    const heroRef = useHeroReveal<HTMLDivElement>();

    const featuredRef = useScrollReveal<HTMLElement>();
    const gridRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const nlRef = useScrollReveal<HTMLDivElement>();
    const [nlStatus, setNlStatus] = useState<NLStatus>('idle');
    const [nlEmail, setNlEmail] = useState('');

    const [query, setQuery] = useState('');
    const [activeCat, setActiveCat] = useState<CategoryFilter>('Todos');

    const isFiltering = query.trim() !== '' || activeCat !== 'Todos';

    const filtered = useMemo(() => {
        const q = normalize(query.trim());
        return RESOURCES.filter((r) => {
            const matchesCat = activeCat === 'Todos' || r.cat === activeCat;
            const matchesQuery = q === '' || normalize(`${r.title} ${r.desc}`).includes(q);
            return matchesCat && matchesQuery;
        });
    }, [query, activeCat]);

    const visible = isFiltering ? filtered : rest;
    const showFeatured = !isFiltering;

    const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNlStatus('submitting');
        try {
            const res = await fetch(FORM_NEWSLETTER_URL, {
                method: 'POST',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: nlEmail, _subject: 'Nueva suscripción newsletter OpsPilot', tipo: 'newsletter' }),
            });
            if (res.ok) {
                setNlStatus('success');
                setNlEmail('');
            } else {
                setNlStatus('error');
            }
        } catch {
            setNlStatus('error');
        }
    };

    return (
        <div className={sys.page}>
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        <h1 className={`${sys.pageHeroTitle} reveal`}>
                            Aprende a hacer más con <em className={sys.pageHeroAccent}>menos</em>.
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            Guías prácticas, artículos y herramientas gratuitas sobre automatización
                            y digitalización. Escritas para personas de negocio, no para técnicos.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ BUSCADOR + FILTROS ═══ */}
            <section className={styles.toolbarSection}>
                <div className={sys.container}>
                    <div className={styles.toolbar}>
                        <div className={styles.searchBox}>
                            <Search size={17} strokeWidth={2} className={styles.searchIcon} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Busca por tema: web, IA, presupuesto, sistema..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                aria-label="Buscar recursos"
                            />
                            {query !== '' && (
                                <button
                                    type="button"
                                    className={styles.searchClear}
                                    onClick={() => setQuery('')}
                                    aria-label="Borrar búsqueda"
                                >
                                    <X size={15} strokeWidth={2} />
                                </button>
                            )}
                        </div>
                        <div className={styles.catPills} role="tablist" aria-label="Filtrar por categoría">
                            {(['Todos', ...RESOURCE_CATEGORIES] as CategoryFilter[]).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeCat === cat}
                                    className={`${styles.catPill} ${activeCat === cat ? styles.catPillActive : ''}`}
                                    onClick={() => setActiveCat(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FEATURED ═══ */}
            {showFeatured && (
                <section className={styles.featuredSection}>
                    <div className={sys.container}>
                        <Link to={`/recursos/${featured.slug}`} className={styles.featuredLink}>
                            <article className={styles.featuredCard} ref={featuredRef}>
                                <div className={styles.featuredBody}>
                                    <div className={styles.featuredMeta}>
                                        <span className={styles.cardCat}>{featured.cat}</span>
                                        <span className={styles.cardTime}>
                                            <Clock size={12} strokeWidth={2} />
                                            {featured.time} lectura
                                        </span>
                                    </div>
                                    <h2 className={styles.featuredTitle}>{featured.title}</h2>
                                    <p className={styles.featuredDesc}>{featured.desc}</p>
                                    <TextLink
                                        interactive={false}
                                        tone="subtle"
                                        size="sm"
                                        className={styles.featuredCta}
                                        icon={<ArrowRight size={15} strokeWidth={2} />}
                                    >
                                        {CTA_BY_CAT[featured.cat]}
                                    </TextLink>
                                </div>
                                <CoverSlot
                                    cover={featured.cover}
                                    label={featured.cat}
                                    className={styles.coverFeatured}
                                />
                            </article>
                        </Link>
                    </div>
                </section>
            )}

            {/* ═══ GRID ═══ */}
            <section className={styles.gridSection}>
                <div className={sys.container} ref={gridRef}>
                    {visible.length > 0 ? (
                        <div className={styles.grid}>
                            {visible.map((r) => (
                                <Link key={r.slug} to={`/recursos/${r.slug}`} className={`${styles.cardLink} reveal`}>
                                    <article className={styles.card}>
                                        <CoverSlot cover={r.cover} label={r.cat} />
                                        <div className={styles.cardBody}>
                                            <div className={styles.cardMeta}>
                                                <span className={styles.cardCat}>{r.cat}</span>
                                                <span className={styles.cardTime}>
                                                    <Clock size={11} strokeWidth={2} />
                                                    {r.time}
                                                </span>
                                            </div>
                                            <h2 className={styles.cardTitle}>{r.title}</h2>
                                            <p className={styles.cardDesc}>{r.desc}</p>
                                            <span className={styles.cardFooter}>{CTA_BY_CAT[r.cat]}</span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>No hay recursos que coincidan con tu búsqueda.</p>
                            <p className={styles.emptyText}>
                                Prueba con otro término o quita el filtro de categoría.
                            </p>
                            <button
                                type="button"
                                className={styles.emptyReset}
                                onClick={() => {
                                    setQuery('');
                                    setActiveCat('Todos');
                                }}
                            >
                                Ver todos los recursos
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══ NEWSLETTER ═══ */}
            <section className={`${sys.sectionLoose} ${sys.sectionAlt}`}>
                <div className={sys.container}>
                    <div className={`${styles.newsletter} reveal`} ref={nlRef}>
                        <div className={styles.nlLeft}>
                            <p className={styles.nlLabel}>Newsletter semanal</p>
                            <h2 className={styles.nlTitle}>Una idea útil cada semana.</h2>
                            <p className={styles.nlText}>
                                Automatizaciones prácticas, herramientas y casos reales.
                                Sin relleno, sin spam. Solo cosas que puedes aplicar.
                            </p>
                        </div>
                        <div className={styles.nlRight}>
                            {nlStatus === 'success' ? (
                                <p className={styles.nlSuccess}>
                                    ¡Suscrito! Te llegará el próximo email esta semana.
                                </p>
                            ) : (
                                <form className={styles.nlForm} onSubmit={handleNewsletter}>
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        className={styles.nlInput}
                                        required
                                        value={nlEmail}
                                        onChange={(e) => setNlEmail(e.target.value)}
                                    />
                                    <Button variant="primary" type="submit" disabled={nlStatus === 'submitting'}>
                                        {nlStatus === 'submitting' ? 'Enviando...' : 'Suscribirme gratis'}
                                    </Button>
                                    {nlStatus === 'error' && (
                                        <p className={styles.nlError}>
                                            Error al suscribirse. Inténtalo de nuevo.
                                        </p>
                                    )}
                                </form>
                            )}
                            <p className={styles.nlNote}>Sin spam. Baja cuando quieras.</p>
                        </div>
                    </div>
                </div>
            </section>

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
