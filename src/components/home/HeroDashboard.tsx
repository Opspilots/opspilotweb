import React from "react";
import styles from "./HeroDashboard.module.css";

/**
 * HeroDashboard — instrument-window panel for the Home hero.
 *
 * Pure DOM/CSS (no WebGL, no images): a title bar with window dots and a
 * live status label, a 2×2 grid of metric tiles (label mono / big tabular
 * value / inline SVG sparkline) and a bottom status row. Data echoes the
 * real case-study numbers used across the site.
 *
 * Entry motion ("dashboard rise") lives in the CSS module and is gated
 * behind prefers-reduced-motion.
 */

type Tone = "mint" | "warm";

interface Metric {
    label: string;
    value: string;
    tone: Tone;
    points: string;
}

const METRICS: Metric[] = [
    {
        label: "Gestión manual",
        value: "−70%",
        tone: "mint",
        points: "0,7 17,11 34,9 51,16 68,14 85,22 102,27 120,33",
    },
    {
        label: "Capacidad",
        value: "×3",
        tone: "mint",
        points: "0,33 17,30 34,26 51,27 68,20 85,15 102,11 120,6",
    },
    {
        label: "Respuesta",
        value: "<24h",
        tone: "warm",
        points: "0,10 17,15 34,13 51,21 68,19 85,26 102,30 120,34",
    },
    {
        label: "Procesos automatizados",
        value: "80%",
        tone: "mint",
        points: "0,31 17,28 34,29 51,22 68,17 85,18 102,10 120,7",
    },
];

const STATUS = ["SII · OK", "BANCO · SYNC", "CRM · LIVE", "FACTURAS · AUTO"];

export const HeroDashboard: React.FC = () => {
    return (
        <div className={styles.panel} aria-hidden="true">
            <div className={styles.titleBar}>
                <span className={styles.windowDots}>
                    <span />
                    <span />
                    <span />
                </span>
                <span className={styles.titleText}>
                    <span className={styles.liveDot} />
                    OPS-PILOT / PANEL · LIVE
                </span>
            </div>

            <div className={styles.metricGrid}>
                {METRICS.map((m) => (
                    <div className={styles.tile} key={m.label}>
                        <span className={styles.tileLabel}>{m.label}</span>
                        <span className={styles.tileValue}>{m.value}</span>
                        <svg
                            className={styles.spark}
                            viewBox="0 0 120 40"
                            preserveAspectRatio="none"
                        >
                            <polyline
                                className={
                                    m.tone === "warm"
                                        ? styles.sparkWarm
                                        : styles.sparkMint
                                }
                                points={m.points}
                            />
                        </svg>
                    </div>
                ))}
            </div>

            <div className={styles.statusRow}>
                {STATUS.map((s) => (
                    <span className={styles.statusItem} key={s}>
                        <span className={styles.statusDot} />
                        {s}
                    </span>
                ))}
            </div>
        </div>
    );
};
