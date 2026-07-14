import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { Button } from '../components/ui/Button';
import styles from './NotFound.module.css';

const FINAL = '404';
const GLYPHS = '0123456789#%&/\\<>[]{}=+*';

/**
 * Scramble suave del "404" al montar: los glifos se agitan y van fijándose
 * de izquierda a derecha hasta formar el código. Solo cliente (corre en
 * useEffect, nunca en el prerender SSG) y desactivado con reduced-motion.
 */
function useScramble(active: boolean): string {
    const [text, setText] = useState(FINAL);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!active) return;

        const DURATION = 900;
        const start = performance.now();
        const chars = FINAL.split('');

        const tick = (now: number) => {
            const progress = Math.min((now - start) / DURATION, 1);
            // Cada posición se "bloquea" en orden a lo largo del progreso.
            const locked = Math.floor(progress * chars.length);
            const next = chars
                .map((c, i) => {
                    if (i < locked || progress === 1) return c;
                    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                })
                .join('');
            setText(next);
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            setText(FINAL);
        };
    }, [active]);

    return text;
}

export const NotFound: React.FC = () => {
    const [scrambleOn, setScrambleOn] = useState(false);

    useEffect(() => {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (!reduce) setScrambleOn(true);
    }, []);

    const code = useScramble(scrambleOn);

    return (
        <div className={styles.wrap}>
            <Head>
                <title>Página no encontrada (404) — OpsPilot</title>
                <meta name="description" content="Esta página no existe. Vuelve al inicio para seguir." />
                <meta name="robots" content="noindex, follow" />
            </Head>

            {/* Grano ambiente — capa fija, sin eventos de puntero. */}
            <div className={styles.grainLayer + ' grain'} aria-hidden="true" />
            {/* Glow mint muy sutil tras los numerales. */}
            <div className={styles.glow} aria-hidden="true" />

            <div className={styles.inner}>
                <p className={styles.label}>
                    <span className={styles.labelDot} aria-hidden="true" />
                    error 404
                </p>

                <h1 className={styles.code}>
                    <span aria-hidden="true">{code}</span>
                    <span className={styles.srOnly}>Error 404 — página no encontrada</span>
                </h1>

                <p className={styles.copy}>
                    Esta página no existe. Puede que el enlace esté roto o que la
                    hayamos movido. Volvemos al inicio y seguimos.
                </p>

                <div className={styles.actions}>
                    <Link to="/">
                        <Button variant="primary" magnetic>Volver al inicio</Button>
                    </Link>
                    <Link to="/contacto">
                        <Button variant="ghost">Hablar con nosotros</Button>
                    </Link>
                </div>

                {/* Enlaces de recuperación: reconducen al usuario perdido a las
                    secciones más probables en vez de dejarlo solo con "inicio". */}
                <nav className={styles.recovery} aria-label="¿Buscabas esto?">
                    <span className={styles.recoveryLabel}>¿Buscabas esto?</span>
                    <ul className={styles.recoveryLinks}>
                        <li>
                            <Link to="/soluciones" className={styles.recoveryLink}>
                                Soluciones
                            </Link>
                        </li>
                        <li>
                            <Link to="/recursos" className={styles.recoveryLink}>
                                Recursos
                            </Link>
                        </li>
                        <li>
                            <Link to="/casos" className={styles.recoveryLink}>
                                Casos
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};
