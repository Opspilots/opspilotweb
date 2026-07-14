import React from "react";
import { useCountUp } from "../../hooks/useCountUp";
import styles from "./HeroDashboard.module.css";

/**
 * HeroDashboard — instrument-window panel for the Home hero.
 *
 * DOM/CSS only (no WebGL, no images): a title bar with window dots and a
 * live status label, a 2×2 grid of metric tiles (label mono / big tabular
 * value that counts up / inline SVG sparkline) and a bottom status row of
 * breathing service dots. Data echoes the real case-study numbers used
 * across the site.
 *
 * "Living" layer — all transform/opacity only, all gated on
 * prefers-reduced-motion, perpetual loops isolated to pure-CSS leaves:
 *   · boot scan sweep across the panel on mount (shimmer de carga)
 *   · tiles cascade in, values count up from zero
 *   · live/status dots breathe on a staggered cadence
 *   · sparklines flicker very subtly like a live feed (desktop only)
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

/**
 * Metric value that counts up from zero. Splits the raw label into
 * prefix (−, ×, <), the numeric core, and suffix (%, h) so only the number
 * animates — the tabular-nums font keeps the width rock-steady while it
 * ticks. useCountUp is always called (hooks rule); non-numeric values just
 * render verbatim.
 */
const MetricValue: React.FC<{ value: string }> = ({ value }) => {
    const match = value.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
    const end = match ? parseFloat(match[2].replace(",", ".")) : 0;
    const ref = useCountUp<HTMLSpanElement>({ end, duration: 1.6 });

    if (!match) return <>{value}</>;
    const [, prefix, , suffix] = match;
    return (
        <>
            {prefix}
            <span ref={ref}>{Math.round(end)}</span>
            {suffix}
        </>
    );
};

const HeroDashboardBase: React.FC = () => {
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
                        <span className={styles.tileValue}>
                            <MetricValue value={m.value} />
                        </span>
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

/**
 * Memoised: the panel takes no props and its living layer is pure CSS, so
 * it never needs to re-render once mounted — isolating it keeps the hero's
 * count-up/scroll work from touching this subtree.
 */
export const HeroDashboard = React.memo(HeroDashboardBase);
