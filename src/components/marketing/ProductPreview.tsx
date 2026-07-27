import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Monitor, Smartphone, X } from 'lucide-react';
import { MockPreview, type MockDevice } from './MockPreview';
import { toMockBlock } from './toMockBlock';
import type { Screenshot, Sector } from '../../data';
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
 * ─── DÓNDE ESTÁ LA LÍNEA ENTRE ILUSTRAR Y MENTIR ───
 *
 * Este proyecto entero va de quitar lo que finge contenido que no existe (se
 * fueron cinco estrellas siempre llenas y un testimonio de nadie). Una
 * representación esquemática no cae en eso, y merece la pena dejar escrito por
 * qué, porque la diferencia es fina:
 *
 *   · No finge ser una fotografía. La maqueta no se parece a una captura ni
 *     de lejos, y además la página lo DICE, con todas las letras y debajo de
 *     la propia maqueta (ver `SCHEMATIC_NOTE`). No hay silueta de portátil, ni
 *     marco de navegador falso, ni "imagen próximamente".
 *   · No lleva ni una cifra. Ni un porcentaje, ni una gráfica, ni un contador,
 *     ni un "ahorra X horas". Los únicos textos son nombres de módulos que
 *     alguien vio en pantalla al entrar en la aplicación.
 *
 * ─── QUÉ NO HAY AQUÍ ───
 *
 * No hay enlace al producto. Lo tiene la página 1 (Resumen) y ahí se queda, a
 * propósito: es la única página que el visitante ve al aterrizar, y duplicar
 * el enlace dos páginas adentro repetiría el problema que ese bloque vino a
 * arreglar (existir sin que nadie lo encuentre). Lo que esta página SÍ hace es
 * explicar su ausencia cuando el producto está caído — ver `unavailableNote`.
 */

/** El conmutador es dato de UI, no del producto: `desktop` es el estado
 *  inicial en cliente y en el prerender SSG, así que el HTML estático es
 *  determinista. */
const DEFAULT_DEVICE: MockDevice = 'desktop';

/** La frase que separa ilustrar de mentir. Va SIEMPRE que se pinte el esquema,
 *  pegada a la maqueta y no en un pie de página lejano: quien mire el dibujo
 *  tiene que leer esto sin buscarlo. */
const SCHEMATIC_NOTE = 'Esquema de módulos reales. No es una captura.';

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
     *  quedan superpuestas con `aria-hidden` + `inert`. O sea que la maqueta se
     *  monta con la página escondida, y su cascada de ensamblado (nav → título
     *  → módulos, ver MockPreview.module.css) se gastaba entera a puerta
     *  cerrada: al llegar a la cuarta página ya había terminado hacía rato y lo
     *  que veías era el resultado, quieto.
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
                    <MockPreview
                        // Disposición propia de la vista previa de producto —
                        // pestañas con las secciones reales de la aplicación y
                        // UN módulo activo (ver `MockLayout` en MockPreview.tsx
                        // para por qué no se reutiliza `panel`).
                        layout="producto"
                        device={device}
                        accent={preview.accent}
                        navLinks={preview.tabs}
                        // DENTRO DEL MARCO SOLO ENTRA LO QUE LA APLICACIÓN
                        // TIENE. Por eso el titular de la maqueta es el nombre
                        // del producto —lo que una aplicación pone en su propia
                        // cabecera— y no `preview.title`, que es una frase
                        // NUESTRA describiendo lo que hace. Esa frase se pinta
                        // debajo, fuera del marco (ver `.copy` más abajo).
                        //
                        // La distinción parece un detalle de maquetación y no
                        // lo es: meter nuestra frase dentro del marco la
                        // presentaría como texto de la interfaz, o sea
                        // afirmando que la aplicación dice algo que no dice. Es
                        // el mismo error de siempre —enseñar como capturado lo
                        // que está escrito— a menor escala. Fuera del marco es
                        // lo que es: nosotros describiendo un producto.
                        title={productName}
                        block={toMockBlock(preview.block)}
                        revealed={revealed}
                        // La cascada de entrada se re-dispara al cambiar de
                        // dispositivo, y solo por eso: `key` remonta el
                        // componente, que es lo que reinicia sus `animation`
                        // de CSS. Sin esto, pulsar "móvil" cambiaría el ancho
                        // sin que la maqueta se "vuelva a montar", que es la
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
                        {shot ? `Captura de ${productName}.` : SCHEMATIC_NOTE}
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
