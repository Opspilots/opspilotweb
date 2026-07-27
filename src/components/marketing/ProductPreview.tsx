import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Monitor, Smartphone, X } from 'lucide-react';
import { MOCK_ICONS } from './mockIcons';
import type { ProductPreview as ProductPreviewData, ProductTheme, Screenshot, Sector } from '../../data';
import { getProduct, isLinkable } from '../../data';
import styles from './ProductPreview.module.css';

/**
 * ProductPreview — la CUARTA página del panel de sector de /soluciones: qué es
 * el producto de ese sector, visto por dentro.
 *
 * ─── LAS DOS RAMAS, Y POR QUÉ LA PRIMERA HOY NO SE VE ───
 *
 * 1. HAY CAPTURA (`Sector.screenshots`) → se pinta la imagen, con su `alt`
 *    obligatorio y un botón que la amplía a pantalla completa.
 * 2. NO HAY CAPTURA → se pinta una representación esquemática de la
 *    aplicación con sus módulos reales (`Product.preview`, ver
 *    src/data/products.ts).
 *
 * Hoy no existe NI UNA captura en el repo, así que la rama 1 no se ve en
 * ninguna de las siete pestañas. Está escrita igualmente y funcionando: meter
 * la primera captura mañana es dejar el fichero en /public y añadir un
 * `screenshots: [{ src, alt, frame }]` al sector. Ni una línea de este
 * componente.
 *
 * ─── POR QUÉ ESTE COMPONENTE YA NO USA MockPreview ───
 *
 * Lo usaba, y de ahí venía el problema. MockPreview es la maqueta genérica de
 * OpsPilot: pinta "una web/panel que acabamos de generar" con NUESTROS tres
 * acentos (mint/ámbar/azul de variables.css). Perfecto para el embudo del hero
 * y para las tarjetas de casos, donde lo que se enseña es trabajo nuestro.
 *
 * Aquí lo que se enseña es AJENO. Son cuatro aplicaciones en producción con su
 * propia identidad, y pintarlas con la paleta de casa daba exactamente el
 * resultado que se describió al rechazar la versión anterior: cuatro paneles
 * "básicos y similares entre ellos". No era un fallo de MockPreview — era
 * pedirle algo para lo que no está: MockPreview tiene UN tema, el nuestro.
 *
 * Así que esta página se pinta sola, con `ProductTheme` (src/data/types.ts)
 * publicado como custom properties en el contenedor del esquema. MockPreview
 * queda intacto y sus tres consumidores (HeroLeadWidget y CaseMockPanel desde
 * Home y Casos) no se enteran de nada. Lo que SÍ se sigue compartiendo es el
 * registro de iconos (`MOCK_ICONS`), que es vocabulario, no estilo.
 *
 * ─── DÓNDE ESTÁ LA LÍNEA ENTRE ILUSTRAR Y MENTIR ───
 *
 * Este proyecto entero va de quitar lo que finge contenido que no existe (se
 * fueron cinco estrellas siempre llenas y un testimonio de nadie). Una
 * representación esquemática no cae en eso, y merece la pena dejar escrito por
 * qué, porque la diferencia es fina:
 *
 *   · No finge ser una fotografía. El esquema no se parece a una captura ni de
 *     lejos, y además la página lo DICE, con todas las letras y debajo del
 *     propio esquema (ver `schematicNote`). No hay silueta de portátil, ni
 *     marco de navegador falso, ni barra de URL, ni "imagen próximamente".
 *   · No lleva ni una cifra. Ni un porcentaje, ni una gráfica con datos, ni un
 *     contador, ni un euro. Las figuras de dentro (filas, columnas, sangrías,
 *     casillas) son FORMA SIN VALORES y van `aria-hidden`: no dicen nada y no
 *     deben fingir que sí. Ninguna barra tiene una longitud que signifique
 *     algo — ver `BAR_WIDTHS`.
 *   · Los únicos textos son nombres de módulo que alguien vio en pantalla al
 *     entrar en la aplicación.
 *   · Y el COLOR también responde: cuando la paleta no se pudo leer de la
 *     aplicación (`theme.source === 'provisional'`, hoy solo Fiscalidad), la
 *     nota lo dice. Ver `schematicNote`.
 *
 * ─── QUÉ NO HAY AQUÍ ───
 *
 * No hay enlace al producto. Lo tiene la página 1 (Resumen) y ahí se queda, a
 * propósito: es la única página que el visitante ve al aterrizar, y duplicar
 * el enlace dos páginas adentro repetiría el problema que ese bloque vino a
 * arreglar (existir sin que nadie lo encuentre). Lo que esta página SÍ hace es
 * explicar su ausencia cuando el producto está caído — ver `unavailable`.
 */

/** El conmutador es dato de UI, no del producto: `desktop` es el estado
 *  inicial en cliente y en el prerender SSG, así que el HTML estático es
 *  determinista. */
const DEFAULT_DEVICE: MockDevice = 'desktop';

/** Se conserva el nombre del tipo que exportaba MockPreview porque es el
 *  vocabulario del conmutador, no de la maqueta, y esta página lo usaba ya.
 *  Declararlo aquí es lo que corta la última dependencia con MockPreview. */
export type MockDevice = 'desktop' | 'mobile';

/**
 * Anchos de las barras sin contenido, en porcentaje.
 *
 * Es una tabla FIJA y recorrida por índice, no `Math.random()`, y las dos
 * razones importan:
 *
 *   1. El deck de /soluciones se prerenderiza (SSG). Un ancho aleatorio se
 *      calcularía distinto en el servidor y en el cliente, y React tiraría un
 *      error de hidratación en cada carga.
 *   2. Una barra cuya longitud cambie sola invita a leerla como un dato. No lo
 *      es. Estos siete números están elegidos para que la figura no parezca un
 *      peine y para NADA más: no representan importes, ni progreso, ni
 *      proporción de nada.
 */
const BAR_WIDTHS = [74, 52, 65, 43, 70, 58, 48] as const;

/** Sangría de cada fila del árbol de `Partidas`, en niveles.
 *
 *  Es la única figura cuya forma sí afirma algo, y lo afirma con razón: un
 *  presupuesto de obra es capítulo → partida → recurso, y esa jerarquía existe
 *  en la aplicación (es lo que separa un presupuesto de un Word con un total
 *  al final). Lo que NO afirma es cuántos hay de cada: se recorta o se repite
 *  según `stage.rows`. */
const TREE_DEPTHS = [0, 1, 1, 2, 1, 2] as const;

/**
 * La paleta de la aplicación → custom properties del contenedor.
 *
 * Mismo mecanismo que `MOCK_ACCENT_VARS` en MockPreview, con una diferencia de
 * fondo: aquellas apuntan a tokens de variables.css (son NUESTROS colores con
 * otro nombre), y estas traen valores literales leídos del `:root` de una
 * aplicación ajena. Por eso viven en src/data y no en el CSS: son un hecho
 * sobre un producto en producción, igual que sus nombres de módulo.
 *
 * Prefijo `--pv-` (product view) y no `--tpl-`: que no se puedan confundir con
 * las de MockPreview es justamente el punto — si un día alguien anida los dos,
 * que no se pisen.
 */
function themeVars(t: ProductTheme): React.CSSProperties {
    return {
        '--pv-bg': t.bg,
        '--pv-surface': t.surface,
        '--pv-raised': t.raised,
        '--pv-line': t.line,
        '--pv-text': t.text,
        '--pv-muted': t.muted,
        '--pv-accent': t.accent,
        '--pv-accent-ink': t.accentInk,
        '--pv-accent-soft': t.accentSoft,
        '--pv-glow': t.glow,
    } as React.CSSProperties;
}

/**
 * ¿Este sector tiene cuarta página?
 *
 * Vive AQUÍ y no en Soluciones.tsx a propósito: es exactamente la misma
 * pregunta que responde el render de abajo (¿hay captura? ¿hay esquema?), y
 * tenerla escrita dos veces —una para contar las páginas y otra para
 * pintarlas— garantiza que un día se contesten distinto y salga una pestaña
 * que lleva a una página en blanco, o una página que existe y no tiene dot.
 *
 * Y es una FUNCIÓN sobre el sector, no una constante: de los 7 sectores solo
 * 4 tienen producto, y de esos 4 podrían no tener `preview` (es opcional a
 * propósito, ver products.ts). El número de páginas del panel depende del
 * sector activo, y esto es lo que lo decide.
 */
export function hasProductPreview(sector: Sector): boolean {
    if (sector.screenshots && sector.screenshots.length > 0) return true;
    const product = sector.productId ? getProduct(sector.productId) : undefined;
    return product?.preview !== undefined;
}

/** Elige qué captura toca según el conmutador. `frame` deja de ser una pista
 *  decorativa y pasa a tener un trabajo: con una captura de escritorio y otra
 *  de móvil del mismo producto, el conmutador cambia de verdad lo que se ve en
 *  vez de reescalar la misma imagen. Si solo hay una, se muestra esa en ambas
 *  posiciones — el conmutador sigue siendo honesto porque el marco (ver
 *  `data-frame` en el CSS) refleja lo que la imagen ES, no lo que se ha
 *  pulsado. */
function pickScreenshot(
    shots: readonly Screenshot[],
    device: MockDevice,
): Screenshot | undefined {
    if (shots.length === 0) return undefined;
    const wanted = device === 'mobile' ? 'phone' : 'browser';
    return shots.find((s) => (s.frame ?? 'browser') === wanted) ?? shots[0];
}

/* ═══════════════════════════════════════════════════════════════════════
   LAS CUATRO FIGURAS — el módulo abierto, por dentro
   ═══════════════════════════════════════════════════════════════════════
   Cada una responde a un `PreviewStage.kind` (ver src/data/types.ts) y todas
   cumplen la misma regla: cero texto, cero cifras, `aria-hidden` en el
   contenedor. Lo único que se nombra es el módulo, y eso se pinta fuera, en la
   cabecera del escenario.

   Por qué cuatro y no una parametrizada: una lista de comandas, un desglose de
   obra, un comparador de tarifas y un modelo de la AEAT no tienen la misma
   forma, y forzarlos al mismo dibujo con distintos colores es EXACTAMENTE lo
   que hacía la versión anterior. La forma es la mitad del reconocimiento. */

/** `Caja` del ERP: líneas de una cuenta abierta. Cada fila lleva su marca a la
 *  izquierda, la línea en medio y el hueco del importe a la derecha —hueco, no
 *  número—, y la última es el total: marcada con el acento y también vacía. */
function LedgerFigure({ rows }: { rows: number }) {
    return (
        <div className={styles.ledger}>
            {Array.from({ length: rows }, (_, i) => (
                <span key={i} className={styles.ledgerRow}>
                    <span className={styles.ledgerMark} />
                    <span className={styles.bar} style={{ width: `${BAR_WIDTHS[i % BAR_WIDTHS.length]}%` }} />
                    <span className={styles.slot} />
                </span>
            ))}
            <span className={`${styles.ledgerRow} ${styles.ledgerTotal}`}>
                <span className={styles.bar} style={{ width: '30%' }} />
                <span className={`${styles.slot} ${styles.slotStrong}`} />
            </span>
        </div>
    );
}

/** `Partidas` de Presupuestador: el desglose con sangría. */
function TreeFigure({ rows }: { rows: number }) {
    return (
        <div className={styles.tree}>
            {Array.from({ length: rows }, (_, i) => {
                const depth = TREE_DEPTHS[i % TREE_DEPTHS.length];
                return (
                    <span
                        key={i}
                        className={styles.treeRow}
                        data-depth={depth}
                        style={{ paddingLeft: `${depth * 14}px` }}
                    >
                        {depth === 0 && <span className={styles.treeCaret} />}
                        <span className={styles.bar} style={{ width: `${BAR_WIDTHS[i % BAR_WIDTHS.length]}%` }} />
                        <span className={styles.slot} />
                    </span>
                );
            })}
        </div>
    );
}

/** `Comparativas` de EnergyDeal: columnas enfrentadas, una destacada. La
 *  destacada NO es "la mejor oferta" —eso sería un dato— sino la columna en la
 *  que estarías con el cursor: lleva el acento del producto y nada más. */
function CompareFigure({ rows }: { rows: number }) {
    return (
        <div className={styles.compare}>
            {[0, 1, 2].map((col) => (
                <span
                    key={col}
                    className={`${styles.compareCol} ${col === 0 ? styles.compareColPick : ''}`}
                >
                    <span className={styles.compareHead} />
                    {Array.from({ length: rows }, (_, i) => (
                        <span
                            key={i}
                            className={styles.bar}
                            style={{ width: `${BAR_WIDTHS[(col * 2 + i) % BAR_WIDTHS.length]}%` }}
                        />
                    ))}
                </span>
            ))}
        </div>
    );
}

/** `Modelo 303` de Fiscalidad: una HOJA con casillas, clara sobre el fondo
 *  oscuro de la aplicación. Es la única composición invertida de los cuatro
 *  productos y se reconoce sin leer nada — un modelo oficial es papel, no una
 *  tarjeta de dashboard. Las casillas van vacías, obviamente: rellenarlas
 *  sería inventar la declaración de alguien. */
function SheetFigure({ rows }: { rows: number }) {
    return (
        <div className={styles.sheet}>
            <span className={styles.sheetSpine} />
            <span className={styles.sheetHead} />
            <span className={styles.sheetGrid}>
                {Array.from({ length: rows }, (_, i) => (
                    <span key={i} className={styles.sheetField}>
                        <span className={styles.sheetLabel} style={{ width: `${BAR_WIDTHS[i % BAR_WIDTHS.length]}%` }} />
                        <span className={styles.sheetBox} />
                    </span>
                ))}
            </span>
        </div>
    );
}

/**
 * El esquema de la aplicación: barra superior + navegación + módulo abierto +
 * el resto de módulos.
 *
 * La jerarquía es lo que cambió respecto a la versión rechazada. Antes eran
 * cuatro fichas del mismo tamaño con un icono cada una: sin protagonista, sin
 * profundidad y, por tanto, sin parecido con ninguna aplicación real. Ahora
 * hay UNA cosa grande delante (el módulo abierto, con su figura) y tres al
 * lado. Mismos cuatro nombres reales de siempre, repartidos en dos niveles.
 */
const AppSchematic: React.FC<{
    preview: ProductPreviewData;
    productName: string;
    device: MockDevice;
    revealed: boolean;
}> = ({ preview, productName, device, revealed }) => {
    const { theme, nav, tabs, stage, modules } = preview;
    const StageIcon = MOCK_ICONS[stage.icon];

    return (
        <div
            className={styles.app}
            data-scheme={theme.scheme}
            data-nav={nav}
            data-stage={stage.kind}
            data-device={device}
            data-animate={revealed ? 'true' : undefined}
            style={themeVars(theme)}
        >
            {/* Barra de la aplicación. El punto de marca y el nombre son lo
                que una aplicación pone en su propia cabecera; el nombre sale
                SIEMPRE de `Product.name` (ver products.ts, incluido el TODO
                abierto de Presupuestador/PresupuesYa). Nunca entra aquí una
                frase nuestra: cualquier texto dentro de este marco se lee como
                texto DE la interfaz. */}
            <div className={styles.appBar}>
                <span className={styles.appDot} aria-hidden="true" />
                <span className={styles.appName}>{productName}</span>
                {nav !== 'rail' && (
                    <span className={styles.tabs} data-chain={nav === 'cadena' ? 'true' : undefined}>
                        {tabs.map((label, i) => (
                            <React.Fragment key={label}>
                                {/* El conector solo existe en `cadena`: ahí las
                                    pestañas son un recorrido en orden, no tres
                                    sitios sueltos. Es decorativo, va oculto. */}
                                {i > 0 && nav === 'cadena' && (
                                    <span className={styles.tabLink} aria-hidden="true" />
                                )}
                                <span className={`${styles.tab} ${i === 0 ? styles.tabActive : ''}`}>
                                    {label}
                                </span>
                            </React.Fragment>
                        ))}
                    </span>
                )}
                {/* Menú "hamburguesa": se pinta siempre y solo se ve en la
                    vista móvil (ver `.appMenu` en el .module.css), donde
                    sustituye a las pestañas y a la barra lateral. Es lo que
                    hace una aplicación real al estrecharse, y por eso el
                    conmutador de dispositivo cambia algo más que el ancho. */}
                <span className={styles.appMenu} aria-hidden="true" />
            </div>

            <div className={styles.appBody}>
                {/* Barra lateral — solo el ERP. Las tres secciones reales
                    arriba y, debajo, tres filas SIN NOMBRE: el ERP tiene
                    dieciséis módulos y esas filas mudas son la forma honesta
                    de decir "hay más" sin escribir dieciséis nombres que nadie
                    va a leer ni inventarse ninguno. */}
                {nav === 'rail' && (
                    <div className={styles.rail}>
                        {tabs.map((label, i) => (
                            <span
                                key={label}
                                className={`${styles.railItem} ${i === 0 ? styles.railItemActive : ''}`}
                            >
                                {label}
                            </span>
                        ))}
                        <span className={styles.railRest} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </span>
                    </div>
                )}

                <div className={styles.stage}>
                    <div className={styles.stageHead}>
                        <StageIcon size={13} strokeWidth={2} />
                        <span className={styles.stageName}>{stage.module}</span>
                    </div>
                    {/* La figura entera fuera del árbol de accesibilidad: son
                        barras y casillas vacías. Un lector de pantalla debe
                        oír los nombres de módulo, no un recuento de rectángulos
                        que no significan nada. */}
                    <div className={styles.figure} aria-hidden="true">
                        {stage.kind === 'ledger' && <LedgerFigure rows={stage.rows} />}
                        {stage.kind === 'tree' && <TreeFigure rows={stage.rows} />}
                        {stage.kind === 'compare' && <CompareFigure rows={stage.rows} />}
                        {stage.kind === 'sheet' && <SheetFigure rows={stage.rows} />}
                    </div>
                </div>
            </div>

            {/* El resto de módulos. Van abajo y en pequeño porque eso es lo que
                son: lo que hay al lado de lo que estás mirando. */}
            <div className={styles.tray}>
                {modules.map((item) => {
                    const Icon = MOCK_ICONS[item.icon];
                    return (
                        <span key={item.key} className={styles.chip}>
                            <Icon size={13} strokeWidth={1.8} />
                            <span className={styles.chipLabel}>{item.label}</span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * Ampliador de captura. `<dialog>` NATIVO y cero librerías: el navegador ya
 * regala con `showModal()` las cuatro cosas que un modal accesible tiene que
 * hacer y que a mano se hacen mal — capa superior por encima de cualquier
 * z-index, cierre con Escape, atrapado de foco (el resto del documento queda
 * inerte de verdad, no "con tabindex -1") y fondo no interactivo. Meter aquí
 * una dependencia de modales sería pagar peso por lo que el navegador hace
 * gratis y mejor.
 *
 * Lo único que NO se delega es la DEVOLUCIÓN del foco al botón que abrió: la
 * mayoría de navegadores lo hacen, pero el comportamiento no es uniforme y es
 * justo lo que rompe la navegación por teclado (te cierra el modal y te deja
 * el foco en el `<body>`, o sea al principio de la página). Se hace a mano en
 * `onClose`, que es el evento que dispara TODOS los caminos de cierre: Escape,
 * el botón de cerrar y el clic en el fondo.
 */
const ScreenshotZoom: React.FC<{ shot: Screenshot; productName: string }> = ({
    shot,
    productName,
}) => {
    const [open, setOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // El estado manda sobre el elemento, no al revés: `showModal()`/`close()`
    // son imperativos y no se pueden expresar como atributo (el atributo
    // `open` abre el diálogo en modo NO modal, sin capa superior ni Escape ni
    // atrapado de foco — es una trampa clásica). Este efecto es el único punto
    // donde se sincronizan, y comprueba `d.open` antes de llamar porque
    // `showModal()` sobre un diálogo ya abierto lanza `InvalidStateError`.
    useEffect(() => {
        const d = dialogRef.current;
        if (!d) return;
        if (open && !d.open) d.showModal();
        else if (!open && d.open) d.close();
    }, [open]);

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                className={styles.zoomBtn}
                onClick={() => setOpen(true)}
            >
                <Maximize2 size={15} strokeWidth={2} aria-hidden="true" />
                Ampliar
            </button>

            <dialog
                ref={dialogRef}
                className={styles.zoomDialog}
                aria-label={`Captura ampliada de ${productName}`}
                onClose={() => {
                    setOpen(false);
                    triggerRef.current?.focus();
                }}
                // Clic en el fondo. El `::backdrop` no es un elemento del DOM y
                // no recibe eventos propios: lo que llega es un clic cuyo
                // `target` es el PROPIO `<dialog>`, porque la imagen y el botón
                // están dentro de `.zoomInner` y cualquier clic sobre ellos
                // tiene a esos como target. Comparar contra `e.currentTarget`
                // es lo que distingue "he pulsado fuera" de "he pulsado la
                // foto", sin necesidad de un overlay falso.
                onClick={(e) => {
                    if (e.target === e.currentTarget) setOpen(false);
                }}
            >
                <div className={styles.zoomInner}>
                    <button
                        type="button"
                        className={styles.zoomClose}
                        onClick={() => setOpen(false)}
                    >
                        <X size={18} strokeWidth={2} aria-hidden="true" />
                        <span className={styles.srOnly}>Cerrar la captura ampliada</span>
                    </button>
                    {/* El mismo `alt` que la miniatura: describe QUÉ SE VE en la
                        pantalla (obligatorio por tipo, ver `Screenshot` en
                        src/data/types.ts). Ampliar no cambia el contenido de la
                        imagen, así que tampoco su descripción. */}
                    <img className={styles.zoomImg} src={shot.src} alt={shot.alt} />
                </div>
            </dialog>
        </>
    );
};

export interface ProductPreviewProps {
    sector: Sector;
    /** ¿Es esta la página que el usuario está viendo AHORA?
     *
     *  Existe por una consecuencia directa de cómo funciona el deck de
     *  /soluciones: las 4 páginas de los 7 paneles se montan TODAS al cargar
     *  —su copy tiene que estar en el HTML prerenderizado— y las inactivas se
     *  quedan superpuestas con `aria-hidden` + `inert`. O sea que el esquema se
     *  monta con la página escondida, y su cascada de ensamblado (barra →
     *  escenario → módulos) se gastaba entera a puerta cerrada: al llegar a la
     *  cuarta página ya había terminado hacía rato y lo que veías era el
     *  resultado, quieto.
     *
     *  Con esto la cascada corre cuando el usuario ABRE la página, que es su
     *  único momento útil — y es exactamente el mismo mecanismo que usa
     *  CaseMockPanel para diferirla hasta que el panel entra en viewport.
     *
     *  `true` por defecto para que quien monte este componente en otro sitio
     *  (donde no haya un deck que gatee nada) no tenga que saber que esto
     *  existe. */
    revealed?: boolean;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ sector, revealed = true }) => {
    // Estado local y no izado a Soluciones.tsx: `page` sí es compartido por los
    // 7 paneles porque la paginación es una sola conversación con el usuario,
    // pero "cómo quiero ver ESTE producto" es una pregunta por producto. Izarlo
    // habría significado atravesar tres niveles de props para sincronizar algo
    // que nadie ha pedido que se sincronice.
    const [device, setDevice] = useState<MockDevice>(DEFAULT_DEVICE);

    const product = sector.productId ? getProduct(sector.productId) : undefined;
    const shots = sector.screenshots ?? [];
    const shot = pickScreenshot(shots, device);
    const preview = product?.preview;

    // Guardia real, no defensiva: `hasProductPreview` decide si esta página
    // existe, así que en producción nunca se llega aquí sin nada que pintar. Si
    // alguien la monta a mano sin comprobarlo, mejor no pintar nada que pintar
    // un marco vacío que parezca "contenido que no ha cargado".
    if (!shot && !preview) return null;

    // El nombre público sale SIEMPRE de `Product.name` y nunca se escribe en la
    // vista previa: es el único sitio donde vive (ver products.ts, incluido el
    // TODO abierto de Presupuestador/PresupuesYa). Cuando negocio decida ese
    // nombre, esta pantalla se entera sola.
    const productName = product?.name ?? sector.label;

    // El interruptor de disponibilidad también manda aquí, y sin ningún `if`
    // con el nombre de un producto dentro: `isLinkable` es el único sitio donde
    // se decide si un destino externo es alcanzable hoy (src/data/products.ts).
    // Lo que cambia respecto al resto de superficies es la RESPUESTA: donde
    // ellas esconden el enlace, esta lo explica. Con los otros tres sectores
    // enseñando enlace y este no, el silencio se leería como "esto aún no
    // existe" — que es exactamente lo falso. El esquema se pinta igual: no
    // lleva a ninguna parte, así que no puede quemar a nadie.
    const unavailable = product !== undefined && !isLinkable(product.site);

    // La frase que separa ilustrar de mentir, y ahora responde también por el
    // COLOR. Va SIEMPRE que se pinte el esquema, pegada a él y no en un pie de
    // página lejano: quien mire el dibujo tiene que leer esto sin buscarlo.
    //
    // La segunda variante no es una excusa, es el precio de haberle dado a
    // Fiscalidad una identidad propia sin poder leer la suya (la aplicación no
    // monta; ver THEME_FISCALIDAD en products.ts). Se apaga sola el día que
    // ese tema pase a `source: 'app'` — ni un `if` con un nombre de producto
    // dentro.
    const schematicNote =
        preview?.theme.source === 'provisional'
            ? 'Esquema de módulos reales. No es una captura, y el color aún no es el suyo.'
            : 'Esquema de módulos reales. No es una captura.';

    return (
        <div className={styles.wrap}>
            {shot ? (
                <figure className={styles.shotFigure} data-frame={shot.frame ?? 'browser'}>
                    {/* `loading="lazy"` porque las 4 páginas del panel se montan
                        siempre (el copy tiene que estar en el HTML
                        prerenderizado) y 3 de ellas están fuera de vista: sin
                        esto, entrar en /soluciones descargaría las capturas de
                        los 7 sectores para enseñar cero. */}
                    <img
                        className={styles.shotImg}
                        src={shot.src}
                        alt={shot.alt}
                        loading="lazy"
                        decoding="async"
                    />
                </figure>
            ) : (
                preview && (
                    <AppSchematic
                        preview={preview}
                        productName={productName}
                        device={device}
                        revealed={revealed}
                        // La cascada de entrada se re-dispara al cambiar de
                        // dispositivo, y solo por eso: `key` remonta el
                        // componente, que es lo que reinicia sus `animation`
                        // de CSS. Sin esto, pulsar "móvil" cambiaría el ancho
                        // sin que el esquema se "vuelva a montar", que es la
                        // idea que vende el conmutador. Mismo truco que el
                        // `key={comboKey}` de HeroLeadWidget.
                        key={device}
                    />
                )
            )}

            {/* Fila de contexto: a la izquierda lo que hay que leer, a la
                derecha lo que se puede tocar. Va DEBAJO del marco y no encima
                por dos motivos que apuntan al mismo sitio: la nota se refiere a
                lo que se acaba de ver (es un pie de foto, no un encabezado), y
                todo lo que hay aquí es voz NUESTRA — describiendo el producto
                y avisando de qué es exactamente lo de arriba. Separar por
                completo "lo que la aplicación tiene" de "lo que nosotros
                decimos de ella" es lo que sostiene esta página entera. */}
            <div className={styles.meta}>
                <div className={styles.copy}>
                    {preview && <p className={styles.claim}>{preview.title}</p>}
                    <p className={styles.note}>
                        {shot ? `Captura de ${productName}.` : schematicNote}
                    </p>
                    {unavailable && (
                        <p className={styles.noteWarn}>
                            No accesible desde fuera; por eso no hay enlace.
                        </p>
                    )}
                </div>

                <div className={styles.actions}>
                    {shot && <ScreenshotZoom shot={shot} productName={productName} />}
                    <div
                        className={styles.deviceToggle}
                        role="group"
                        aria-label={`Ver ${productName} como escritorio o como móvil`}
                    >
                        <button
                            type="button"
                            className={styles.deviceBtn}
                            aria-pressed={device === 'desktop'}
                            onClick={() => setDevice('desktop')}
                        >
                            <Monitor size={15} strokeWidth={2} aria-hidden="true" />
                            <span className={styles.srOnly}>Escritorio</span>
                        </button>
                        <button
                            type="button"
                            className={styles.deviceBtn}
                            aria-pressed={device === 'mobile'}
                            onClick={() => setDevice('mobile')}
                        >
                            <Smartphone size={15} strokeWidth={2} aria-hidden="true" />
                            <span className={styles.srOnly}>Móvil</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
