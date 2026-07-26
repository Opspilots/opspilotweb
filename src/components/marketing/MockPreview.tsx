import React from 'react';
import styles from './MockPreview.module.css';

/**
 * MockPreview — mini-maqueta de "web/panel generado" (nav + titular + bloque
 * de contenido destacado), extraída del Paso 4 de HeroLeadWidget para
 * reutilizarse también en CaseMockPanel (tarjetas de casos, ver
 * src/components/cases/CaseMockPanel.tsx). Puramente presentacional: sin
 * estado ni lógica de quiz — quien la use decide accent/layout/nav/kicker/
 * title/sub/block y, opcionalmente, cuándo debe correr su cascada de entrada
 * (`revealed`).
 *
 * ─── QUÉ CAMBIÓ Y POR QUÉ ───
 *
 * 1. FUERA EL BLOQUE `testimonial`. Eran cinco estrellas siempre llenas, dos
 *    barras grises simulando una cita y un punto+barra simulando avatar y
 *    nombre de un cliente. Prueba social de gente que no existe, mostrada a un
 *    visitante al que se le está pidiendo el correo. No se ha sustituido por
 *    otra cosa inventada: el hueco lo ocupa `services`, con los nombres de
 *    servicio REALES del sector que la persona acaba de decir que es el suyo.
 *
 * 2. LA MAQUETA TIENE TEXTO. `navLinks` y `navCta` son opcionales, y ese
 *    detalle es la clave de compatibilidad: cuando NO se pasan, la nav pinta
 *    exactamente las mismas barras grises de siempre (ver la pareja de reglas
 *    `:empty` / `:not(:empty)` en el .module.css). CaseMockPanel no pasa
 *    ninguna de las dos, así que las tarjetas de Inicio y Casos quedan
 *    idénticas al píxel. El embudo sí las pasa, y con eso la maqueta pasa de
 *    "página rota" a algo que un profesional del sector reconoce sin leer el
 *    titular.
 *
 * 3. `layout` REORDENA. Antes la pregunta del objetivo (Paso 3 del embudo) no
 *    movía un solo píxel: las cuatro respuestas daban la misma imagen. Ahora
 *    reorganiza la jerarquía de la MISMA maqueta (ver `data-layout` en el
 *    .module.css). El orden del DOM no cambia nunca — el reordenado es
 *    `order` de flexbox, así que el orden de lectura de un lector de pantalla
 *    sigue siendo nav → titular → bloque pase lo que pase.
 *
 * Tres acentos (mint/warm/info, todos de variables.css). Custom properties
 * para el crossfade: en vez de un selector `[data-accent]` que cambia de
 * golpe, cada elemento que depende del acento anima SU PROPIO color desde un
 * tono neutro hasta esta variable (ver keyframes tplBrandIn/tplKickerIn en el
 * .module.css). El único valor "nuevo" por acento es el glow, calcado de
 * `--shadow-mint` (mismos offsets/alpha) con el RGB base del color
 * correspondiente, para que el brillo del punto de marca no quede asimétrico
 * entre acentos.
 */

export type MockAccent = 'mint' | 'warm' | 'info';
export type MockDevice = 'desktop' | 'mobile';

/**
 * Disposición de la maqueta. `estandar` es el comportamiento histórico
 * (nav → titular → bloque, sin adornos) y es el valor por defecto justo para
 * que CaseMockPanel no cambie sin pedirlo. Las otras cuatro las usa el embudo
 * del hero, una por objetivo (ver OBJETIVO_LAYOUT en src/data/leadFunnel.ts).
 */
export type MockLayout = 'estandar' | 'accion' | 'flujo' | 'portada' | 'panel';

type IconComponent = React.FC<{ size?: number; strokeWidth?: number }>;

export interface MockModuleItem {
    key: string;
    icon: IconComponent;
    label: string;
    active?: boolean;
}

/** Un servicio del bloque `services` — el nombre que ese oficio usa de
 *  verdad ("Baños y cocinas"), no una etiqueta genérica. */
export interface MockServiceItem {
    key: string;
    icon: IconComponent;
    label: string;
}

export type MockBlock =
    | { type: 'services'; items: readonly MockServiceItem[] }
    | { type: 'modules'; items: readonly MockModuleItem[] }
    | {
          type: 'sequence';
          beforeIcon: IconComponent;
          afterIcon: IconComponent;
          /** Etiqueta corta bajo cada icono — sin ella el tile queda "suelto",
           * sin decir qué representa (mismo criterio que MockModuleItem.label). */
          beforeLabel: string;
          afterLabel: string;
      };

export interface MockPreviewProps {
    accent: MockAccent;
    device?: MockDevice;
    layout?: MockLayout;
    /** Tres etiquetas de sección. Omitido (CaseMockPanel) → barras grises,
     *  igual que siempre. Presente (embudo) → texto real, y en disposición
     *  `panel` se repintan como pestañas con la primera activa. */
    navLinks?: readonly string[];
    /** Etiqueta del botón de la nav. Omitido → la píldora vacía de siempre. */
    navCta?: string;
    /** Etiqueta mono sobre el titular. Ya NO tiene valor por defecto: antes
     *  caía en "Con esto en mente" para las 48 combinaciones del embudo, un
     *  adorno constante que fingía decir algo. Sin kicker, no se pinta. */
    kicker?: string;
    title: string;
    sub?: string;
    block: MockBlock;
    /** Gatea la cascada de entrada (nav → titular → bloque). `true` por
     * defecto: HeroLeadWidget siempre la quiere al montar/remontar (vía
     * `key={comboKey}`), mientras que un consumidor scroll-revealed (p. ej.
     * CaseMockPanel) la deja en `false` hasta que el propio panel entra en
     * viewport, para no gastar la animación fuera de pantalla. */
    revealed?: boolean;
    className?: string;
}

/**
 * Variables de acento. Exportado (antes era privado) porque el Paso 4 del
 * embudo teñe TODA la pantalla de resultado con el acento de la rama, no solo
 * la maqueta: la lista de "qué construiríamos" y el botón de envío usan
 * `var(--tpl-accent)` desde HeroLeadWidget.module.css. Aplicando este mismo
 * objeto en el contenedor del paso, la maqueta hereda lo que ya tiene y el
 * resto del panel se pone a juego — sin duplicar la tabla de colores.
 */
export const MOCK_ACCENT_VARS: Record<MockAccent, React.CSSProperties> = {
    mint: {
        '--tpl-accent': 'var(--color-mint)',
        '--tpl-accent-fill': 'var(--gradient-mint)',
        '--tpl-accent-soft': 'var(--color-mint-soft)',
        '--tpl-accent-border': 'var(--color-border-mint)',
        '--tpl-accent-shadow': 'var(--shadow-mint)',
    } as React.CSSProperties,
    warm: {
        '--tpl-accent': 'var(--color-warm)',
        '--tpl-accent-fill': 'var(--color-warm)',
        '--tpl-accent-soft': 'var(--color-warm-soft)',
        '--tpl-accent-border': 'rgba(232, 165, 99, 0.32)',
        '--tpl-accent-shadow': '0 12px 40px -12px rgba(232, 165, 99, 0.28)',
    } as React.CSSProperties,
    // Azul de señal (#6189c4 == --color-info). Mismos offsets/alpha que
    // --shadow-mint, con el RGB base 97,137,196.
    info: {
        '--tpl-accent': 'var(--color-info)',
        '--tpl-accent-fill': 'var(--color-info)',
        '--tpl-accent-soft': 'var(--color-info-soft)',
        '--tpl-accent-border': 'rgba(97, 137, 196, 0.32)',
        '--tpl-accent-shadow': '0 12px 40px -12px rgba(97, 137, 196, 0.28)',
    } as React.CSSProperties,
};

/** Tres cadenas vacías: el modo "barras grises". Se renderizan igual que las
 *  etiquetas con texto y es el selector `:empty` del CSS el que decide la
 *  forma — así no hay dos ramas de JSX que mantener sincronizadas. */
const BLANK_NAV_LINKS: readonly string[] = ['', '', ''];

function ServicesBlock({ items }: { items: readonly MockServiceItem[] }) {
    return (
        <div className={styles.services}>
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <span key={item.key} className={styles.serviceChip}>
                        <Icon size={13} strokeWidth={1.8} />
                        <span className={styles.serviceLabel}>{item.label}</span>
                    </span>
                );
            })}
        </div>
    );
}

function ModulesBlock({ items }: { items: readonly MockModuleItem[] }) {
    return (
        <div className={styles.modules}>
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <span
                        key={item.key}
                        className={`${styles.moduleTile} ${item.active ? styles.moduleTileActive : ''}`}
                    >
                        <Icon size={16} strokeWidth={1.8} />
                        <span className={styles.moduleLabel}>{item.label}</span>
                    </span>
                );
            })}
        </div>
    );
}

function SequenceBlock({
    beforeIcon: BeforeIcon,
    afterIcon: AfterIcon,
    beforeLabel,
    afterLabel,
}: {
    beforeIcon: IconComponent;
    afterIcon: IconComponent;
    beforeLabel: string;
    afterLabel: string;
}) {
    return (
        <div className={styles.sequence}>
            <span className={`${styles.seqTile} ${styles.seqTileBefore}`}>
                <BeforeIcon size={17} strokeWidth={1.8} />
                <span className={styles.seqLabel}>{beforeLabel}</span>
            </span>
            <span className={styles.seqArrow} aria-hidden="true" />
            <span className={`${styles.seqTile} ${styles.seqTileAfter}`}>
                <AfterIcon size={17} strokeWidth={1.8} />
                <span className={styles.seqLabel}>{afterLabel}</span>
            </span>
        </div>
    );
}

export const MockPreview: React.FC<MockPreviewProps> = ({
    accent,
    device = 'desktop',
    layout = 'estandar',
    navLinks,
    navCta,
    kicker,
    title,
    sub,
    block,
    revealed = true,
    className,
}) => {
    const hasNavText = !!navLinks && navLinks.length > 0;
    const links = hasNavText ? navLinks : BLANK_NAV_LINKS;
    // Las pestañas solo tienen sentido si hay etiquetas que poner en ellas:
    // una fila de tres rectángulos grises no comunica "esto es un panel".
    const showTabs = layout === 'panel' && hasNavText;
    // La barra de acción reutiliza la MISMA etiqueta que el botón de la nav a
    // propósito: en una interfaz real la acción principal es una, repetida
    // arriba y a pie de página, no dos acciones distintas compitiendo.
    const showAction = layout === 'accion' && !!navCta;

    return (
        <div
            className={`${styles.templatePreview}${className ? ` ${className}` : ''}`}
            data-accent={accent}
            data-device={device}
            data-layout={layout}
            data-animate={revealed ? 'true' : undefined}
            style={MOCK_ACCENT_VARS[accent]}
        >
            {/* La nav es chrome de la maqueta, no contenido: se mantiene fuera
                del árbol de accesibilidad incluso cuando lleva texto real. Lo
                que un lector de pantalla necesita saber del resultado son el
                titular, el bloque y —sobre todo— la lista "qué construiríamos"
                que vive fuera de este componente, en HeroLeadWidget. */}
            <div className={styles.tplNav} aria-hidden="true">
                <span className={styles.tplBrand} />
                <span className={styles.tplNavLinks}>
                    {links.map((label, i) => (
                        <span key={i}>{label}</span>
                    ))}
                </span>
                <span className={styles.tplNavCta}>{navCta}</span>
                {/* Menú "hamburguesa" — solo visible en data-device="mobile" (ver
                    .module.css), sustituye a los links + CTA de escritorio. */}
                <span className={styles.tplNavMenu}>
                    <span />
                    <span />
                    <span />
                </span>
            </div>

            {showTabs && (
                <div className={styles.tplTabs} aria-hidden="true">
                    {links.map((label, i) => (
                        <span
                            key={i}
                            className={`${styles.tplTab} ${i === 0 ? styles.tplTabActive : ''}`}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}

            {/* Banda de portada (solo `portada`). Es un HUECO de imagen, no una
                imagen: superficie con el degradado del acento y una trama fina,
                sin texto ni figuras. No hay fotos de sector en el repo y no se
                van a inventar, así que se representa el espacio que ocuparían
                en vez de fingir que ya existen. */}
            {layout === 'portada' && <div className={styles.tplCover} aria-hidden="true" />}

            <div className={styles.tplHeadline}>
                {kicker && <span className={styles.tplKicker}>{kicker}</span>}
                <p className={styles.tplTitle}>{title}</p>
                {sub && <p className={styles.tplSub}>{sub}</p>}
            </div>

            <div className={styles.tplBlock}>
                {block.type === 'services' && <ServicesBlock items={block.items} />}
                {block.type === 'modules' && <ModulesBlock items={block.items} />}
                {block.type === 'sequence' && (
                    <SequenceBlock
                        beforeIcon={block.beforeIcon}
                        afterIcon={block.afterIcon}
                        beforeLabel={block.beforeLabel}
                        afterLabel={block.afterLabel}
                    />
                )}
            </div>

            {showAction && (
                <span className={styles.tplAction} aria-hidden="true">
                    {navCta}
                    <span className={styles.tplActionArrow} />
                </span>
            )}
        </div>
    );
};
