import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, ButtonLink } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { PageSEO } from '../hooks/usePageSEO';
import { ROUTES } from '../lib/routes';
import { RESOURCES, RESOURCE_CATEGORIES, type ResourceCategory } from '../lib/resources';
import { buildBreadcrumb } from '../lib/seo';
import { StructuredData } from '../components/seo/StructuredData';
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

/* Variante de patrón para el slot de portada sin ilustración real. Derivada
   del slug con un hash estable (NO aleatoria: debe dar el mismo valor en el
   prerender SSG y en el cliente, o sería un mismatch de hidratación). Tres
   variantes bastan para que una rejilla de 3 columnas no se lea como tres
   rectángulos idénticos. */
function patternVariant(seed: string): '0' | '1' | '2' {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    return String(Math.abs(h) % 3) as '0' | '1' | '2';
}

/**
 * Slot de portada — UNA sola anatomía para todas las tarjetas de /recursos.
 *
 * Antes había dos tarjetas distintas conviviendo en la misma rejilla: las que
 * tenían ilustración mostraban [portada] → [meta: tipo + tiempo] → [título] →
 * [sumario] → [enlace], y las que no tenían dejaban un panel vacío de ~200px
 * con la etiqueta de categoría flotando suelta en el centro — y además perdían
 * la categoría de su fila meta (se pintaba condicionada a `cover`), así que ni
 * la estructura ni la información eran las mismas. Dos plantillas para el mismo
 * objeto es lo que hacía que la rejilla se viera rota.
 *
 * Ahora el slot SIEMPRE existe y siempre mide lo mismo; lo único que cambia es
 * qué lo rellena: la ilustración real si la hay, o un patrón del sistema de
 * diseño (rejilla de blueprint + halo mint/ámbar, los mismos ingredientes de
 * `sys.pageHero::before`) si todavía no. La fila meta es idéntica en ambos
 * casos. Cuando lleguen las ilustraciones que faltan, basta con rellenar
 * `cover` en src/lib/resources.ts: no hay que tocar nada más.
 */
const CoverSlot: React.FC<{ cover: string | undefined; seed: string; className?: string }> = ({
    cover,
    seed,
    className,
}) => (
    <div className={`${styles.cover}${className ? ` ${className}` : ''}`} aria-hidden="true">
        {cover ? (
            <img className={styles.coverImg} src={cover} alt="" loading="lazy" />
        ) : (
            <span className={styles.coverPattern} data-variant={patternVariant(seed)} />
        )}
    </div>
);

export const Resources: React.FC = () => {
    const seoProps = {
        title: 'Recursos para automatizar y digitalizar tu PYME — OpsPilot',
        description:
            'Guías, artículos y herramientas gratis para automatizar y digitalizar tu PYME. Aprende cómo automatizar tu negocio, sin tecnicismos ni relleno.',
        canonical: 'https://opspilot.es/recursos',
    };

    const heroRef = useHeroReveal<HTMLDivElement>();

    const featuredRef = useScrollReveal<HTMLElement>();
    const nlRef = useScrollReveal<HTMLDivElement>();
    const [nlStatus, setNlStatus] = useState<NLStatus>('idle');
    const [nlEmail, setNlEmail] = useState('');

    // Siembra la búsqueda desde ?q= (usado por el SearchAction del JSON-LD /
    // sitelinks search box de Google) para que el input arranque con el término.
    //
    // Hydration-safe por construcción: `/recursos` se prerrenderiza como UNA
    // página estática sin variantes de query-string, así que el HTML del
    // servidor siempre trae `query=''`. Si el initializer de useState leyera
    // `searchParams.get('q')` de forma síncrona, en tráfico real que llega
    // con `?q=...` (sitelinks search box de Google) el primer render cliente
    // calcularía un valor distinto al del servidor → mismatch de hidratación
    // (React #418), React descarta el subárbol y lo remonta, lo que se ve
    // como el toolbar apareciendo y desapareciendo. Mismo patrón que
    // usePrefersReducedMotion: arrancamos con el valor SSR-safe y el valor
    // real se aplica en un useEffect, ya después del montaje.
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState('');
    const [activeCat, setActiveCat] = useState<CategoryFilter>('Todos');

    useEffect(() => {
        const q = searchParams.get('q');
        if (q) setQuery(q);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // deps = [query, activeCat]: al cambiar el filtro, el hook recablea los
    // ScrollTrigger sobre las tarjetas nuevas y revela las ya visibles (fix R1).
    const gridRef = useScrollReveal<HTMLDivElement>({ stagger: true, deps: [query, activeCat] });

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
            <PageSEO {...seoProps} />
            <StructuredData
                data={buildBreadcrumb([
                    { name: 'Inicio', url: 'https://opspilot.es/' },
                    { name: 'Recursos', url: 'https://opspilot.es/recursos' },
                ])}
            />
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        <h1 className={`${sys.pageHeroTitle} reveal`}>
                            Aprende a hacer más con <em className={sys.pageHeroAccent}>menos</em>.
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            Guías, artículos y herramientas gratis para automatizar y digitalizar
                            tu PYME. Escritas para dueños de negocio, no para técnicos.
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
                                placeholder="Busca por tema: automatización, web, IA, presupuestos..."
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
                        {/* `role="group"` + `aria-pressed`, NO tablist/tab: estos botones
                            no controlan paneles (no hay `aria-controls` ni tabpanel) ni
                            implementan navegación por flechas, así que anunciarlos como
                            pestañas prometía a un lector de pantalla un patrón que el
                            componente no cumple. Son filtros de alternancia. */}
                        <div className={styles.catPills} role="group" aria-label="Filtrar por categoría">
                            {(['Todos', ...RESOURCE_CATEGORIES] as CategoryFilter[]).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    aria-pressed={activeCat === cat}
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
                                    seed={featured.slug}
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
                    <header className={`${sys.sectionHeader} ${styles.gridHeader}`}>
                        <p className={sys.sectionEyebrow}>Recursos</p>
                        <h2 className={sys.sectionTitle}>Todos los recursos.</h2>
                    </header>
                    {/* Contador de resultados: feedback y confianza al filtrar. */}
                    {isFiltering && visible.length > 0 && (
                        <p className={styles.resultCount} aria-live="polite">
                            {visible.length} {visible.length === 1 ? 'recurso' : 'recursos'}
                        </p>
                    )}
                    {visible.length > 0 && (
                        <div className={styles.grid}>
                            {visible.map((r) => (
                                <Link key={r.slug} to={`/recursos/${r.slug}`} className={`${styles.cardLink} reveal`}>
                                    <article className={styles.card}>
                                        <CoverSlot cover={r.cover} seed={r.slug} />
                                        <div className={styles.cardBody}>
                                            {/* Fila meta IDÉNTICA en todas las tarjetas: tipo + tiempo de
                                               lectura. Antes la categoría iba condicionada a `r.cover`
                                               (sin portada se pintaba flotando dentro del panel vacío),
                                               así que media rejilla tenía una fila meta con dos datos y la
                                               otra media con uno solo. */}
                                            <div className={styles.cardMeta}>
                                                <span className={styles.cardCat}>{r.cat}</span>
                                                <span className={styles.cardTime}>
                                                    <Clock size={11} strokeWidth={2} />
                                                    {r.time}
                                                </span>
                                            </div>
                                            <h3 className={styles.cardTitle}>{r.title}</h3>
                                            <p className={styles.cardDesc}>{r.desc}</p>
                                            <span className={styles.cardFooter}>{CTA_BY_CAT[r.cat]}</span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                    {/* Indicador de scroll horizontal (solo móvil): avisa de que
                       la fila continúa fuera de pantalla. */}
                    {visible.length > 1 && (
                        <p className={styles.scrollHint} aria-hidden="true">
                            Desliza para ver más →
                        </p>
                    )}
                    {visible.length === 0 && (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>Nada coincide con tu búsqueda.</p>
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
                                Cada semana te mando una automatización que puedes montar tú mismo.
                                Con la herramienta o el caso real que hay detrás. Nada de relleno.
                            </p>
                        </div>
                        <div className={styles.nlRight}>
                            {/* Mismo patrón de "intercambio sin cambio de tamaño" que el
                                formulario de /contacto: form y acuse comparten una celda de
                                grid, así que el bloque no se encoge al suscribirse. La región
                                viva (`role="status"`) va en la capa, siempre montada, para que
                                el lector de pantalla anuncie el cambio. */}
                            <div className={styles.nlSwap}>
                                <div className={styles.nlStatusLayer} role="status">
                                    {nlStatus === 'success' && (
                                        <p className={styles.nlSuccess}>
                                            Hecho. El primer email te llega esta semana.
                                        </p>
                                    )}
                                </div>
                                <form
                                    className={styles.nlForm}
                                    onSubmit={handleNewsletter}
                                    aria-hidden={nlStatus === 'success' || undefined}
                                    inert={nlStatus === 'success'}
                                >
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        className={styles.nlInput}
                                        required
                                        value={nlEmail}
                                        onChange={(e) => setNlEmail(e.target.value)}
                                        aria-label="Tu email"
                                    />
                                    <Button variant="primary" type="submit" disabled={nlStatus === 'submitting'}>
                                        {nlStatus === 'submitting' ? 'Enviando...' : 'Suscribirme gratis'}
                                    </Button>
                                    {/* Slot de error de alto reservado: el mensaje aparece sin
                                        empujar nada — antes su aparición movía `.nlNote` y el
                                        borde del bloque hacia abajo. */}
                                    <p className={styles.nlError} role="alert">
                                        {nlStatus === 'error' && 'Error al suscribirse. Inténtalo de nuevo.'}
                                    </p>
                                </form>
                            </div>
                            <p className={styles.nlNote}>Sin spam. Baja cuando quieras.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock}>
                        <h2 className={sys.endCtaTitle}>¿Quieres automatizar tu negocio con ayuda?</h2>
                        <p className={sys.endCtaSub}>
                            Media hora, gratis, sin compromiso. Hablamos de tu caso concreto.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <ButtonLink to={ROUTES.contacto} variant="primary" size="lg">
                                Reservar diagnóstico
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
