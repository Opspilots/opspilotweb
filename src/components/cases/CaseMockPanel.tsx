import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Banknote, Calculator, MessageSquare, ShieldCheck, ShoppingCart } from 'lucide-react';
import type { CaseShowcase, CaseSiteTheme, CaseStage } from '../../data';
import styles from './CaseMockPanel.module.css';

// Guard SSR — mismo patrón que useScrollReveal.ts.
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * CaseMockPanel — la maqueta que va justo encima del texto de cada caso, en
 * /casos y en la portada.
 *
 * ─── POR QUÉ ESTE COMPONENTE YA NO USA MockPreview ───
 *
 * Lo usaba, y de ahí venía el problema. MockPreview es la maqueta genérica de
 * OpsPilot: pinta "una web/panel que acabamos de generar" con NUESTROS acentos
 * (mint/ámbar de variables.css) y con UNA sola forma —nav gris, titular,
 * rejilla de fichas—. Perfecto para el embudo del hero, donde lo que se enseña
 * es una plantilla nuestra todavía sin dueño.
 *
 * Aquí lo que se enseña es AJENO y además COMPROBABLE: tres webs en producción
 * que el visitante puede abrir en otra pestaña. Pintarlas con la paleta de casa
 * y con la misma retícula daba exactamente lo que se describió al rechazarlo:
 * tres fichas indistinguibles entre sí. No era un fallo de MockPreview — era
 * pedirle algo para lo que no está.
 *
 * Es literalmente el mismo diagnóstico y la misma cura que ya se aplicaron en
 * la vista previa de producto de /soluciones (ver la cabecera de
 * ProductPreview.tsx). MockPreview queda INTACTO y su consumidor vivo
 * —HeroLeadWidget, el embudo del hero— no se entera de nada. Lo que se
 * abandona aquí es también `toMockBlock`, que solo servía para traducir a su
 * vocabulario.
 *
 * ─── LAS TRES FORMAS ───
 *
 * Una tienda, una web de captación y un CRM no se dibujan igual, y forzarlos
 * al mismo dibujo con distintos colores es exactamente lo que fallaba:
 *
 *   · `storefront` — rejilla de producto: ficha grande, categorías reales al
 *                    lado, destacados debajo y la calculadora de la casa.
 *   · `sitemap`    — mapa de páginas: la arquitectura ES el argumento (una
 *                    página por servicio y ciudad), así que se dibujan las
 *                    rutas y una de ellas abierta por dentro.
 *   · `console`    — tabla comparativa densa, cartera jerárquica y el ciclo de
 *                    estados de la comisión.
 *
 * En las tres hay UN protagonista y el resto apoya. Cuatro cosas del mismo
 * tamaño no son una interfaz, son un diagrama — que es lo que había.
 *
 * ─── DÓNDE ESTÁ LA LÍNEA ENTRE ILUSTRAR Y MENTIR ───
 *
 * La misma de siempre, apretada un punto más porque los tres destinos se
 * pueden comprobar entrando:
 *
 *   · NI UNA CIFRA. Ni un precio, ni un euro, ni un porcentaje, ni un
 *     contador, ni una gráfica. Donde iría un importe hay un HUECO vacío
 *     (`.priceSlot`), y en la tienda eso es lo más importante de todo el
 *     fichero: un precio inventado en la maqueta de una tienda abierta al
 *     público es la mentira exacta que este proyecto vino a eliminar.
 *   · LOS ÚNICOS TEXTOS DE DENTRO DEL MARCO son nombres que alguien vio
 *     entrando: secciones, categorías, rutas, campos y estados.
 *   · NO SE IMITA UNA CAPTURA. Ni cromo de navegador, ni barra de URL, ni
 *     bisel de portátil. Donde va una foto va el hueco de la foto.
 *   · Y SE DICE. La nota de debajo del marco lo afirma con todas las letras,
 *     con una redacción por variante — ver `schematicNote`.
 *   · Todo lo mudo va `aria-hidden`: barras, celdas y huecos no significan
 *     nada y no deben fingir que sí.
 */

/**
 * La paleta del sitio → custom properties del contenedor.
 *
 * Mismo mecanismo que `themeVars` en ProductPreview, con prefijo PROPIO
 * (`--cm-`, case mock) y no `--pv-`: que no se puedan pisar si un día alguien
 * anida los dos es justamente el punto. Los valores son literales leídos de
 * una web ajena, así que viven en src/data/cases.ts y no en el CSS — son un
 * hecho sobre un sitio en producción, igual que sus nombres de sección.
 */
function themeVars(t: CaseSiteTheme): React.CSSProperties {
    return {
        '--cm-bg': t.bg,
        '--cm-surface': t.surface,
        '--cm-raised': t.raised,
        '--cm-line': t.line,
        '--cm-text': t.text,
        '--cm-muted': t.muted,
        '--cm-accent': t.accent,
        '--cm-accent-soft': t.accentSoft,
        '--cm-action': t.action,
        '--cm-action-ink': t.actionInk,
        '--cm-chrome': t.chrome,
        '--cm-chrome-ink': t.chromeInk,
        '--cm-glow': t.glow,
    } as React.CSSProperties;
}

/** Detecta cuándo el panel entra en viewport, una sola vez, sin animar bajo
 * prefers-reduced-motion — mismo patrón que usaba el antiguo
 * CaseTransitionPanel (ScrollTrigger, once). Autocontenido a propósito: Home
 * y Casos disparan el reveal de la sección de casos con mecanismos distintos
 * (ScrollTrigger manual vs. scroll-driven CSS `animation-timeline: view()`),
 * así que en lugar de engancharse a cualquiera de los dos, el panel vigila
 * su propia entrada en viewport.
 *
 * SE CONSERVA TAL CUAL al desacoplar de MockPreview: lo que cambia es a quién
 * se le pasa `revealed` (antes a MockPreview vía prop, ahora al marco propio
 * vía `data-animate`), no cuándo se enciende. */
function useRevealOnce<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof window === 'undefined') return;

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            setRevealed(true);
            return;
        }

        const st = ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => setRevealed(true),
        });

        return () => st.kill();
    }, []);

    return { ref, revealed };
}

/**
 * Anchos de las barras sin contenido, en porcentaje.
 *
 * Tabla FIJA recorrida por índice, no `Math.random()`, por los dos motivos que
 * ya documenta BAR_WIDTHS en ProductPreview y que aquí valen igual:
 *
 *   1. Estas dos páginas se prerenderizan (SSG). Un ancho aleatorio saldría
 *      distinto en servidor y en cliente y React tiraría error de hidratación.
 *   2. Una barra cuya longitud cambie sola invita a leerla como un dato. No lo
 *      es. Estos números están elegidos para que la figura no parezca un peine
 *      y para NADA más.
 */
const BAR_WIDTHS = [72, 54, 66, 45, 78, 58, 62, 49] as const;

/** Una barra muda. Existe como función y no como clase suelta porque el ancho
 *  sale siempre de la misma tabla: dejar el `style` a mano en once sitios es
 *  cómo aparece el primer 100% que parece "completado". */
function Bar({ i, className }: { i: number; className?: string }) {
    return (
        <span
            className={`${styles.bar}${className ? ` ${className}` : ''}`}
            style={{ width: `${BAR_WIDTHS[i % BAR_WIDTHS.length]}%` }}
        />
    );
}

/** Hueco de imagen. NO es una imagen ni finge serlo: es el espacio que ocupa,
 *  con una trama diagonal finísima para que se lea como "aquí va una foto" y
 *  no como una tarjeta vacía. No hay ni una foto de estos tres proyectos en el
 *  repo y no se van a inventar — mismo criterio que el `tplCover` del embudo. */
function Well({ className }: { className?: string }) {
    return <span className={`${styles.well}${className ? ` ${className}` : ''}`} />;
}

/* ═══════════════════════════════════════════════════════════════════════
   LAS TRES ESCENAS
   ═══════════════════════════════════════════════════════════════════════
   Todas cumplen la misma regla: el contenedor va `aria-hidden` salvo los
   textos que son NOMBRES REALES del sitio, que sí se leen. Las figuras mudas
   (barras, celdas, huecos) no dicen nada. */

/** TIENDA. Lo que delata a una tienda no es un icono de carro: es que hay un
 *  PRODUCTO grande delante, el catálogo al lado y los destacados debajo. La
 *  ficha grande lleva nombre y especificación reales, el hueco de la foto, un
 *  HUECO DE PRECIO VACÍO y el botón de compra. */
function StorefrontScene({ stage }: { stage: Extract<CaseStage, { kind: 'storefront' }> }) {
    return (
        <>
            {/* Catálogo. Los cuatro nombres son suyos; las filas mudas de
                debajo son las tres categorías que no caben — la forma honesta
                de decir "hay más" sin recortar un nombre a mitad ni
                inventarse ninguno. */}
            <div className={styles.rail}>
                {stage.categories.map((label, i) => (
                    <span
                        key={label}
                        className={`${styles.railItem} ${i === 0 ? styles.railItemActive : ''}`}
                    >
                        {label}
                    </span>
                ))}
                <span className={styles.railRest} aria-hidden="true">
                    {Array.from({ length: stage.moreCategories }, (_, i) => (
                        <Bar key={i} i={i + 2} />
                    ))}
                </span>
            </div>

            {/* El protagonista y su rejilla. */}
            <div className={styles.grid}>
                <div className={styles.pCard}>
                    <Well className={styles.pWell} />
                    <span className={styles.pName}>{stage.product.name}</span>
                    <span className={styles.pSpec}>{stage.product.spec}</span>
                    <span className={styles.pBuy} aria-hidden="true">
                        {/* EL HUECO DEL PRECIO. Vacío, y esta es la línea
                            entera del proyecto aplicada al píxel: se dibuja
                            que ahí va un importe, no el importe. La tienda
                            está abierta; quien quiera el número que entre. */}
                        <span className={styles.priceSlot} />
                        <span className={styles.buyBtn}>
                            <ShoppingCart size={12} strokeWidth={2} />
                        </span>
                    </span>
                </div>

                <div className={styles.siblings} aria-hidden="true">
                    {Array.from({ length: stage.siblings }, (_, i) => (
                        <span key={i} className={styles.sCard}>
                            <Well />
                            <Bar i={i + 1} />
                        </span>
                    ))}
                </div>
            </div>

            {/* La calculadora de placas: la pieza que esta tienda tiene y una
                tienda cualquiera no. Dos huecos de entrada VACÍOS — los metros
                de la pared son del cliente. */}
            <div className={styles.tool}>
                <span className={styles.toolHead}>
                    <Calculator size={12} strokeWidth={2} aria-hidden="true" />
                    <span className={styles.toolLabel}>{stage.tool.label}</span>
                </span>
                <span className={styles.toolFields} aria-hidden="true">
                    {Array.from({ length: stage.tool.fields }, (_, i) => (
                        <span key={i} className={styles.fieldSlot} />
                    ))}
                    <span className={styles.toolGo} />
                </span>
            </div>

            {/* Su sección destacada de portada, con su nombre. */}
            <div className={styles.strip}>
                <span className={styles.stripLabel}>{stage.featured}</span>
                <span className={styles.stripTiles} aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                        <Well key={i} className={styles.stripTile} />
                    ))}
                </span>
            </div>
        </>
    );
}

/** WEB DE CAPTACIÓN. Un mapa de páginas, porque la arquitectura ES el
 *  argumento: una página por servicio y ciudad. La primera ruta va abierta y
 *  se ve por dentro (hueco del hero, texto, la pareja antes/después); las
 *  otras tres quedan colgando del mismo tronco. */
function SitemapScene({ stage }: { stage: Extract<CaseStage, { kind: 'sitemap' }> }) {
    const [open] = stage.routes;

    return (
        <>
            {/* La página abierta, por dentro. Solo figuras: el hueco del hero,
                el texto y la pareja antes/después. Quién es se lee en la lista
                de al lado, donde su ruta va marcada — así el nombre se escribe
                UNA vez y no dos.

                En contenedor estrecho este bloque desaparece entero (ver el
                @container del .module.css) y no se pierde ni un nombre: lo que
                se cae es la ilustración, nunca el dato. */}
            <div className={styles.page}>
                <span className={styles.routeTag}>{open.path}</span>
                <Well className={styles.pageHero} />
                <span className={styles.pageLines} aria-hidden="true">
                    <Bar i={0} />
                    <Bar i={1} />
                </span>
                {/* «Antes y después» sobre obra real: dos huecos enfrentados
                    partidos por el filo del acento. Es una sección suya y se
                    dibuja; lo que no se hace es fingir las dos fotos. */}
                <span className={styles.pagePair} aria-hidden="true">
                    <Well />
                    <span className={styles.pairSplit} />
                    <Well />
                </span>
            </div>

            {/* LAS CUATRO RUTAS, siempre las cuatro. Es el argumento entero del
                caso —una página por servicio y ciudad— y por eso ninguna se
                pliega nunca. La primera va marcada porque es la que se está
                viendo abierta al lado; en estrecho, donde no hay "al lado", la
                marca sigue significando lo mismo y la lista se queda sola. */}
            <div className={styles.routes}>
                {stage.routes.map((r, i) => (
                    <span
                        key={r.path}
                        className={`${styles.route} ${i === 0 ? styles.routeOpen : ''}`}
                    >
                        <span className={styles.routeLabel}>{r.label}</span>
                        <span className={styles.routePath}>{r.path}</span>
                        <span className={styles.routeBar} aria-hidden="true">
                            <Bar i={i + 3} />
                        </span>
                    </span>
                ))}
            </div>

            {/* La captación. Los cuatro campos son los que su formulario pide
                de verdad, con su nombre y con el hueco VACÍO al lado. */}
            <div className={styles.form}>
                {stage.form.map((label, i) => (
                    <span key={label} className={styles.field}>
                        <span className={styles.fieldLabel}>{label}</span>
                        <span
                            className={`${styles.fieldSlot} ${i === stage.form.length - 1 ? styles.fieldSlotTall : ''}`}
                            aria-hidden="true"
                        />
                    </span>
                ))}
                <span className={styles.formGo}>
                    <MessageSquare size={12} strokeWidth={2} aria-hidden="true" />
                    {stage.direct}
                </span>
            </div>

            <div className={styles.strip}>
                {stage.sections.map((s) => (
                    <span key={s} className={styles.stripChip}>
                        {s}
                    </span>
                ))}
            </div>
        </>
    );
}

/** APP A MEDIDA. La consola: tabla comparativa delante, cartera jerárquica al
 *  lado y el ciclo de estados al pie. Su forma es la DENSIDAD — mucha
 *  información en poco sitio— y eso ya dice "herramienta de trabajo" antes de
 *  leer una palabra. */
function ConsoleScene({ stage }: { stage: Extract<CaseStage, { kind: 'console' }> }) {
    return (
        <>
            {/* Cartera: un CIF con sus CUPS colgando. Dos palabras que ningún
                CRM genérico usa, y por eso se escriben en vez de dibujarse. */}
            <div className={styles.rail}>
                <span className={`${styles.railItem} ${styles.railItemActive}`}>
                    {stage.rail.root}
                </span>
                {Array.from({ length: stage.rail.children }, (_, i) => (
                    <span key={i} className={styles.railChild}>
                        {stage.rail.child}
                    </span>
                ))}
                <span className={styles.railRest} aria-hidden="true">
                    <Bar i={5} />
                    <Bar i={6} />
                </span>
            </div>

            <div className={styles.compare}>
                {/* Lo que hace única a esta comparativa, con su nombre. Va
                    ARRIBA y con el acento: es el argumento del producto, no un
                    adorno. */}
                <span className={styles.badge}>
                    <ShieldCheck size={12} strokeWidth={2} aria-hidden="true" />
                    {stage.badge}
                </span>

                {/* La tabla. Celdas VACÍAS: las condiciones son de tarifas de
                    terceros que cambian en días — inventarlas sería inventar
                    la oferta de una comercializadora con nombre. */}
                <span
                    className={styles.table}
                    aria-hidden="true"
                    style={
                        {
                            '--cm-cols': stage.compare.columns,
                        } as React.CSSProperties
                    }
                >
                    <span className={styles.tRow}>
                        <span className={styles.tHeadCell} />
                        {Array.from({ length: stage.compare.columns }, (_, c) => (
                            <span
                                key={c}
                                className={`${styles.tHeadCell} ${c === 0 ? styles.tPick : ''}`}
                            />
                        ))}
                    </span>
                    {Array.from({ length: stage.compare.rows }, (_, r) => (
                        <span key={r} className={styles.tRow}>
                            <span className={styles.tLabel}>
                                <Bar i={r} />
                            </span>
                            {Array.from({ length: stage.compare.columns }, (_, c) => (
                                <span
                                    key={c}
                                    className={`${styles.tCell} ${c === 0 ? styles.tPick : ''}`}
                                />
                            ))}
                        </span>
                    ))}
                </span>
            </div>

            {/* El ciclo de la comisión, con SUS cuatro palabras. La primera va
                marcada y no significa "hay una pendiente" —eso sería un
                recuento— sino el estado en el que estarías mirando. */}
            <div className={styles.strip}>
                <Banknote className={styles.stripIcon} size={13} strokeWidth={2} aria-hidden="true" />
                {stage.states.map((s, i) => (
                    <React.Fragment key={s}>
                        {i > 0 && <span className={styles.stateLink} aria-hidden="true" />}
                        <span className={`${styles.state} ${i === 0 ? styles.stateOn : ''}`}>{s}</span>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
}

/**
 * La frase que separa ilustrar de mentir. Se calcula aquí y no vive en el dato
 * por el mismo motivo que en ProductPreview: depende de lo que el render
 * DIBUJA, no de lo que el sitio es. Una redacción por variante porque cada una
 * tiene una tentación distinta que desactivar — en la tienda, el precio.
 *
 * La coletilla del color se enciende sola si algún día entra un caso cuya
 * paleta no se haya podido leer (`source: 'provisional'`). Hoy los tres son
 * `site`, así que no se ve; y no hace falta ningún `if` con un nombre de
 * cliente dentro para conseguirlo.
 */
function schematicNote(showcase: CaseShowcase): string {
    const base =
        showcase.stage.kind === 'storefront'
            ? 'Esquema de la tienda con sus categorías reales. No es una captura y no lleva precios.'
            : showcase.stage.kind === 'sitemap'
              ? 'Esquema con las rutas reales del sitio. No es una captura.'
              : 'Esquema con los módulos y estados reales. No es una captura.';

    return showcase.theme.source === 'provisional'
        ? `${base} El color aún no es el suyo.`
        : base;
}

export interface CaseMockPanelProps {
    showcase: CaseShowcase;
    className?: string;
}

export const CaseMockPanel: React.FC<CaseMockPanelProps> = ({ showcase, className }) => {
    const { ref, revealed } = useRevealOnce<HTMLDivElement>();
    const { theme, siteName, nav, cta, stage, title, sub } = showcase;

    return (
        <div
            ref={ref}
            className={`${styles.wrap}${className ? ` ${className}` : ''}`}
            data-revealed={revealed || undefined}
        >
            <div
                className={styles.frame}
                data-kind={stage.kind}
                data-scheme={theme.scheme}
                data-animate={revealed ? 'true' : undefined}
                style={themeVars(theme)}
            >
                {/* La cabecera del sitio. Todo lo que entra aquí es SUYO: su
                    nombre, sus secciones y su botón. Nunca una frase nuestra —
                    cualquier texto dentro de este marco se lee como texto DE
                    su interfaz, y para lo nuestro está el pie de abajo. */}
                <div className={styles.chrome}>
                    <span className={styles.brand} aria-hidden="true" />
                    <span className={styles.siteName}>{siteName}</span>
                    <span className={styles.nav}>
                        {nav.map((label, i) => (
                            <span
                                key={label}
                                className={`${styles.navItem} ${i === 0 ? styles.navItemActive : ''}`}
                            >
                                {label}
                            </span>
                        ))}
                    </span>
                    <span className={styles.cta}>{cta}</span>
                </div>

                <div className={styles.body}>
                    {stage.kind === 'storefront' && <StorefrontScene stage={stage} />}
                    {stage.kind === 'sitemap' && <SitemapScene stage={stage} />}
                    {stage.kind === 'console' && <ConsoleScene stage={stage} />}
                </div>
            </div>

            {/* Pie: voz NUESTRA, tipografía NUESTRA, colores NUESTROS. Separar
                por completo "lo que el sitio tiene" de "lo que nosotros decimos
                de él" es lo que sostiene toda esta pieza. Va debajo porque es
                un pie de foto: se refiere a lo que se acaba de ver. */}
            <div className={styles.caption}>
                <p className={styles.claim}>{title}</p>
                {sub && <p className={styles.claimSub}>{sub}</p>}
                <p className={styles.note}>{schematicNote(showcase)}</p>
            </div>
        </div>
    );
};
