import React from "react";
import { Check, Globe, Monitor, Smartphone } from "lucide-react";
import styles from "./HeroDashboard.module.css";

/**
 * HeroDashboard — "sitio en construcción" para el hero del Home.
 *
 * DOM/CSS only (sin WebGL, sin imágenes). En vez de código, el panel muestra
 * una WEB montándose dentro de un navegador: barra de navegador con la URL del
 * cliente, una landing que se ensambla sola (nav → titular → botón → captura
 * con mini-gráfica) y una barra de estado "Publicado" con toggle
 * escritorio/móvil. Habla al usuario final ("creamos tu web"), no al técnico.
 *
 * Capa "viva" — todo transform/opacity, gated en prefers-reduced-motion,
 * loops perpetuos aislados a hojas CSS puras:
 *   · boot scan al montar (shimmer de carga)
 *   · los bloques de la web entran en cascada (ensamblado)
 *   · el botón CTA hace un pop; las barras de la gráfica crecen
 *   · el punto "en vivo" respira una vez publicada
 */

// Alturas de las barras de la mini-gráfica (crecen desde abajo). Una cálida
// para dar acento; el resto mint.
const BARS = [42, 58, 50, 72, 64, 88];

const HeroDashboardBase: React.FC = () => {
    return (
        <div className={styles.panel} aria-hidden="true">
            {/* Barra del navegador */}
            <div className={styles.browserBar}>
                <span className={styles.windowDots}>
                    <span />
                    <span />
                    <span />
                </span>
                <span className={styles.addressBar}>
                    <Globe size={11} strokeWidth={2} className={styles.addressIcon} />
                    tu-empresa.es
                    <span className={styles.addressLive} />
                </span>
            </div>

            {/* Viewport — la web ensamblándose */}
            <div className={styles.viewport}>
                <div className={styles.siteNav}>
                    <span className={styles.brandMark} />
                    <span className={styles.navLinks}>
                        <span />
                        <span />
                        <span />
                    </span>
                    <span className={styles.navCta} />
                </div>

                <div className={styles.siteHeadline}>
                    <span className={styles.hlBar} />
                    <span className={`${styles.hlBar} ${styles.hlBarShort}`} />
                </div>
                <span className={styles.siteSub} />

                <div className={styles.ctaRow}>
                    <span className={styles.ctaPrimary}>Empezar</span>
                    <span className={styles.ctaGhost} />
                </div>

                {/* Captura — la web ya trabajando (mini panel de visitas) */}
                <div className={styles.mediaTile}>
                    <div className={styles.mediaHead}>
                        <span className={styles.mediaTitle} />
                        <span className={styles.mediaBadge}>+38%</span>
                    </div>
                    <div className={styles.chart}>
                        {BARS.map((h, i) => (
                            <span
                                className={`${styles.bar} ${i === BARS.length - 1 ? styles.barWarm : ""}`}
                                key={i}
                                style={{ "--h": `${h}%`, "--b": i } as React.CSSProperties}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Barra de estado — publicado + responsive */}
            <div className={styles.statusBar}>
                <span className={styles.publishState}>
                    <span className={styles.shipCheck}>
                        <Check size={11} strokeWidth={3} />
                    </span>
                    Publicado
                </span>
                <span className={styles.devices}>
                    <span className={`${styles.device} ${styles.deviceActive}`}>
                        <Monitor size={13} strokeWidth={2} />
                    </span>
                    <span className={styles.device}>
                        <Smartphone size={13} strokeWidth={2} />
                    </span>
                </span>
            </div>
        </div>
    );
};

/**
 * Memoised: no recibe props y su capa viva es CSS puro, así que no necesita
 * re-renderizar tras montar.
 */
export const HeroDashboard = React.memo(HeroDashboardBase);
