import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { SpotlightCard } from '../components/fx/SpotlightCard';
import { CaseMockPanel } from '../components/cases/CaseMockPanel';
import { CasesDisclaimer } from '../components/cases/CasesDisclaimer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useHeroReveal } from '../hooks/useHeroReveal';
import { useCarousel } from '../hooks/useCarousel';
import { PageSEO } from '../hooks/usePageSEO';
import { buildBreadcrumb } from '../lib/seo';
import { StructuredData } from '../components/seo/StructuredData';
import { ROUTES } from '../lib/routes';
import {
    ChevronLeft,
    ChevronRight,
    Code2,
    Clock,
    BadgeCheck,
    Cpu,
    // Renombrado: en src/data hay un TIPO llamado `ExternalLink` (el enlace a
    // producción, ver types.ts) y compartir identificador con un componente
    // de lucide solo genera dudas al leer.
    ExternalLink as ExternalLinkIcon,
} from 'lucide-react';
import { TextLink } from '../components/common/TextLink';
import sys from '../styles/page-system.module.css';
import styles from './Cases.module.css';
import { CASES, SERVICE_LINE_LABEL, getProduct, isLinkable } from '../data';
import type { Case } from '../data';

interface DiffItem {
    Icon: React.FC<{ size?: number; strokeWidth?: number }>;
    title: string;
    text: string;
}

const DIFFERENTIATORS: DiffItem[] = [
    {
        Icon: Code2,
        title: 'Software hecho para ti, no plantillas',
        text: 'Cada sistema se diseña desde cero para tu operativa concreta. No adaptamos plantillas de terceros ni te vendemos suscripciones que no controlas. Lo que construimos es tuyo.',
    },
    {
        Icon: Clock,
        title: 'Entrega en semanas, no en meses',
        text: 'Sin proyectos eternos ni fases de consultoría facturadas por horas. Defines el problema, construimos la solución y la entregamos lista para usar en 4 a 8 semanas.',
    },
    {
        Icon: BadgeCheck,
        title: 'Pagas una vez, es tuyo para siempre',
        text: 'Sin cuotas mensuales por el software. Pagas el desarrollo una sola vez y el sistema es completamente tuyo. Solo vuelves si quieres añadir más funcionalidades.',
    },
    {
        Icon: Cpu,
        title: 'IA donde reduce trabajo real',
        text: 'No añadimos inteligencia artificial como reclamo de marketing. La integramos en tareas concretas donde ahorra horas reales: documentos, respuestas, clasificación, presupuestos.',
    },
];

// Pure card — no hooks
const CaseCard: React.FC<{ c: Case; index: number }> = ({ c, index }) => {
    // Producto propio sobre el que se construyó el caso. Requiere que
    // `Case.productId` esté DECLARADO: no se deduce de `c.sectorId`. Pintar
    // "este cliente usa Presupuestador" porque su sector es reformas sería
    // afirmar delante de un visitante algo que nadie ha confirmado. Hoy los 3
    // casos van sin `productId`, así que este bloque no renderiza nada; el día
    // que se rellene el dato aparece solo. Ojo con EnergyDeal, que es el que
    // más tienta a rellenarlo: ahí la omisión está razonada en su propia ficha
    // (src/data/cases.ts) y pintarlo produciría dos enlaces gemelos a
    // energydeal.es en esta misma tarjeta.
    const product = c.productId ? getProduct(c.productId) : undefined;

    // Los dos destinos externos del caso, ya resueltos a "pintable o nada".
    // Se filtran AQUÍ y no en el JSX para que el contenedor `.cardLinks` no
    // llegue a existir cuando el caso declara un producto que hoy está caído
    // (`down`): un div vacío con su margen es un hueco visible sin motivo.
    const productLink = product && isLinkable(product.site) ? product.site : undefined;
    const ownLink = isLinkable(c.productionLink) ? c.productionLink : undefined;

    // `quote`/`author` son opcionales en `Case` y ObraFácil es el primer caso
    // que los ejerce: es un cliente real al que nadie ha pedido una cita, y
    // escribirle una en la boca sería fabricar el testimonio que este trabajo
    // vino a eliminar. Sin la condición, el <blockquote> se renderizaba igual
    // con dos huecos dentro Y con su `border-top` mint (ver `.cardQuote` en
    // Cases.module.css): un filete de color colgando de la nada, que se lee
    // como un fallo de maquetación y no como una ausencia deliberada.
    const hasQuote = Boolean(c.quote || c.author);

    return (
        <article className={styles.caseCard}>
            <div className={styles.cardHead}>
                <span className={styles.cardSector}>
                    <span className={styles.sectorDot} aria-hidden="true" />
                    {c.label}
                </span>
                {/* Línea de servicio (TIENDA / WEB / APP A MEDIDA). Es un eje
                    distinto del sector que ya se pinta a la izquierda: aquel
                    dice de qué ramo es el cliente, esta qué le construimos.
                    Etiqueta y nada más — no enlaza, no filtra, no es una
                    taxonomía navegable (ver `ServiceLine` en data/types.ts).
                    Sin dato, sin etiqueta; hoy la llevan los tres casos, uno
                    por línea (TIENDA / WEB / APP A MEDIDA), que es lo que
                    convierte esta página en muestrario además de en prueba. */}
                {c.serviceLine && (
                    <span className={styles.cardServiceLine}>
                        {SERVICE_LINE_LABEL[c.serviceLine]}
                    </span>
                )}
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
            </div>

            <CaseMockPanel showcase={c.showcase} className={styles.cardTransition} />

            {/* La rejilla es 1.3fr (narrativa) + 0.7fr (cita) a partir de
                640px. Sin cita, esa segunda columna quedaría reservada y
                vacía: medio ancho de tarjeta en blanco al lado de un párrafo
                estrecho, que parece contenido que no ha cargado. Con
                `.cardContentSolo` la narrativa ocupa la fila entera y se
                limita por medida de línea, no por rejilla. */}
            <div
                className={`${styles.cardContent} ${hasQuote ? '' : styles.cardContentSolo}`}
            >
                <div className={styles.cardNarrative}>
                    {/* h2 AQUÍ y h3 en el mismo dato en la portada
                        (Home.tsx, `.caseCardTitle`) no es una incoherencia:
                        el nivel lo fija el documento, no el dato. En /casos
                        los casos SON el contenido de la página y cuelgan
                        directos del h1; en la portada son una sección más y
                        cuelgan del h2 "Lo que construimos ya está
                        trabajando.". Igualarlos rompería una de las dos.

                        Que los 3 h2 existan a la vez aunque sólo uno esté en
                        pantalla es correcto y además deseable: las 3 tarjetas
                        están en el DOM y son alcanzables scrolleando el
                        track, así que quien navegue por encabezados llega a
                        cualquier caso sin depender del carrusel. */}
                    <h2 className={styles.cardTitle}>{c.title}</h2>
                    {/* Nombre del cliente, SOLO si está declarado como
                        nombrable (`{ kind: 'named' }`). Con `anonymous` o sin
                        campo no se pinta nada: el aviso de CasesDisclaimer
                        de más abajo ya explica que se omiten los nombres, y
                        un "Cliente anónimo" impreso en la tarjeta no aporta
                        información, solo ruido. Ver `ClientDisclosure` en
                        src/data/types.ts. */}
                    {c.client?.kind === 'named' && (
                        <p className={styles.cardClient}>{c.client.name}</p>
                    )}
                    <p className={styles.cardText}>{c.text}</p>

                    {/* Salidas a producción del caso. Dos destinos posibles y
                        no excluyentes: el producto propio sobre el que se
                        montó (`productId` → registro de products.ts) y lo
                        entregado a ESE cliente (`productionLink`, su tienda o
                        su web). Ambos pasan por `isLinkable`, el único sitio
                        donde se decide si un destino externo se pinta — un
                        producto marcado `down` desaparece de aquí sin tocar
                        este fichero.

                        <a href> reales con la URL absoluta en el atributo:
                        el HTML de /casos lo genera vite-react-ssg y estos
                        enlaces tienen que ser rastreables ahí, no aparecer
                        tras hidratar. El `rel="noopener noreferrer"` lo pone
                        TextLink al ver `target="_blank"`. */}
                    {(productLink || ownLink) && (
                        <div className={styles.cardLinks}>
                            {[productLink, ownLink].map((link) =>
                                link ? (
                                    <TextLink
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        tone="strong"
                                        size="sm"
                                        icon={<ExternalLinkIcon size={14} strokeWidth={2} />}
                                    >
                                        {link.label}
                                    </TextLink>
                                ) : null,
                            )}
                        </div>
                    )}
                </div>
                {hasQuote && (
                    <blockquote className={styles.cardQuote}>
                        {c.quote && <p>{c.quote}</p>}
                        {c.author && <cite>{c.author}</cite>}
                    </blockquote>
                )}
            </div>
        </article>
    );
};

const CarouselSection: React.FC = () => {
    // Mecánica compartida con el carrusel de casos de la portada (medida de
    // la unidad de scroll, índice activo, arrastre con ratón, foco y flechas)
    // — ver src/hooks/useCarousel.ts. Lo específico de ESTA página (el
    // contador 01/03) se queda aquí abajo, que para eso es una decisión de
    // interfaz de /casos y no de todos los carruseles.
    const { index: currentIndex, scrollTo, trackProps } = useCarousel<HTMLDivElement>(
        CASES.length,
    );

    return (
        <section className={styles.carouselSection}>
            <div className={`${sys.container} ${styles.carouselContentLayer}`}>
                <div className={styles.carouselWrapper}>
                    <div
                        {...trackProps}
                        className={styles.carouselTrack}
                        aria-label="Casos de éxito"
                    >
                        {CASES.map((c, i) => (
                            <CaseCard key={c.id} c={c} index={i} />
                        ))}
                    </div>

                    <div className={styles.carouselFooter}>
                        {/* Botones simples: el carrusel es una región con scroll,
                            no un tablist con tabpanels — usamos aria-current como el ledger */}
                        <div className={styles.dots} role="group" aria-label="Navegar entre casos">
                            {CASES.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-current={i === currentIndex}
                                    className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                                    onClick={() => scrollTo(i)}
                                    aria-label={`Ir al caso ${i + 1}`}
                                />
                            ))}
                        </div>
                        <div className={styles.navButtons}>
                            <span className={styles.counter} aria-hidden="true">
                                <span className={styles.counterNow}>
                                    {String(currentIndex + 1).padStart(2, '0')}
                                </span>
                                /{String(CASES.length).padStart(2, '0')}
                            </span>
                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => scrollTo(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                aria-label="Caso anterior"
                            >
                                <ChevronLeft size={18} strokeWidth={2} />
                            </button>
                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => scrollTo(currentIndex + 1)}
                                disabled={currentIndex === CASES.length - 1}
                                aria-label="Caso siguiente"
                            >
                                <ChevronRight size={18} strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    {/* Texto compartido con la portada — ver CasesDisclaimer.
                        El `className` es lo único que cambia entre las dos
                        páginas: aquí va en xs/subtle para no competir con la
                        navegación del carrusel que tiene justo encima. */}
                    <CasesDisclaimer className={styles.caseDisclaimer} />
                </div>
            </div>
        </section>
    );
};

const WhySection: React.FC = () => {
    const whyRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <section className={styles.whySection}>
            <div className={sys.container} ref={whyRef}>
                <div className={`${styles.whyHeader} reveal`}>
                    <h2 className={styles.whyTitle}>Resultados que se ven. No promesas de folleto</h2>
                    <p className={styles.whySub}>
                        No somos una agencia digital ni una consultora. Somos un equipo pequeño
                        que construye software a medida para PYMEs que quieren trabajar mejor,
                        sin depender de herramientas genéricas ni de procesos que no se adaptan a ellas.
                    </p>
                </div>

                <div className={styles.whyGrid}>
                    {DIFFERENTIATORS.map((d, i) => (
                        <SpotlightCard
                            as="article"
                            key={i}
                            className={`${styles.whyItem} ${i === DIFFERENTIATORS.length - 1 ? styles.whyItemClosing : ''} reveal`}
                        >
                            <span className={styles.whyItemBar} aria-hidden="true" />
                            <div className={styles.whyIconWrap} aria-hidden="true">
                                <d.Icon size={20} strokeWidth={1.75} />
                            </div>
                            <h3 className={styles.whyItemTitle}>{d.title}</h3>
                            <p className={styles.whyItemText}>{d.text}</p>
                        </SpotlightCard>
                    ))}
                </div>
                {/* Indicador de scroll horizontal (solo móvil): avisa de que
                   la fila continúa fuera de pantalla. */}
                {DIFFERENTIATORS.length > 1 && (
                    <p className={styles.scrollHint} aria-hidden="true">
                        Desliza para ver más →
                    </p>
                )}
            </div>
        </section>
    );
};

export const Cases: React.FC = () => {
    const seoProps = {
        title: 'Casos de éxito de software a medida · OpsPilot',
        // Antes prometía "Casos con cifras, no promesas". Era falso, y encima a
        // propósito: esta página no publica ni una sola cifra porque las
        // estadísticas numéricas se retiraron hace tiempo — ni `Case` ni
        // `CaseShowcase` admiten un número (ver src/data/types.ts). Prometer en
        // el resultado de búsqueda algo que la página no entrega es la peor
        // clase de descripción: se gana el clic y se pierde la visita, y Google
        // aprende que el sitio no cumple lo que anuncia. Ahora promete lo que sí
        // hay, que además es mejor argumento que una cifra: proyectos
        // publicados que cualquiera puede abrir y comprobar.
        // "una web" en singular y no "webs": la página enseña exactamente un
        // proyecto por línea de servicio y el plural prometía un muestrario
        // más grande del que hay. Misma regla que tumbó el "Casos con cifras"
        // de antes — lo que anuncia el resultado de búsqueda tiene que ser lo
        // que el visitante encuentra al llegar.
        description:
            'Proyectos reales de pymes que dejaron el Excel: una tienda online, una web de captación y software a medida. Con enlace al resultado para comprobarlo.',
        canonical: 'https://opspilot.es/casos/',
    };

    const breadcrumb = buildBreadcrumb([
        { name: 'Inicio', url: 'https://opspilot.es/' },
        { name: 'Casos', url: 'https://opspilot.es/casos/' },
    ]);

    const heroRef = useHeroReveal<HTMLDivElement>();

    const ctaRef = useScrollReveal<HTMLDivElement>();

    return (
        <div className={sys.page}>
            <PageSEO {...seoProps} />
            <StructuredData data={breadcrumb} />
            {/* ═══ HERO ═══ */}
            <section className={sys.pageHero}>
                <div className={`${sys.container} ${styles.heroContentLayer}`}>
                    <div className={sys.pageHeroContent} ref={heroRef}>
                        <h1 className={`${sys.pageHeroTitle} reveal`}>
                            Empresas reales,<br />
                            problemas <em className={sys.pageHeroAccent}>resueltos</em>.
                        </h1>
                        <p className={`${sys.pageHeroSubtitle} reveal`}>
                            No hace falta ser una gran empresa para tener buenos procesos.
                            Esto es software a medida que hemos construido para PYMEs como la tuya.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ CAROUSEL ═══ */}
            <CarouselSection />

            {/* ═══ DIFERENCIADORES ═══ */}
            <WhySection />

            {/* ═══ CTA ═══ */}
            <section className={sys.endCta}>
                <div className={sys.container}>
                    <div className={sys.endCtaBlock} ref={ctaRef}>
                        <h2 className={sys.endCtaTitle}>¿Tu empresa podría ser la siguiente?</h2>
                        <p className={sys.endCtaSub}>
                            Miramos tu operativa media hora y te decimos qué encajaría contigo.
                            Sin compromiso, sin letra pequeña.
                        </p>
                        <div className={sys.endCtaButtons}>
                            <Link to={ROUTES.contacto}>
                                <Button variant="secondary" size="lg">Reservar diagnóstico</Button>
                            </Link>
                            <Link to={ROUTES.soluciones}>
                                <Button variant="outline" size="lg">Ver soluciones</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
