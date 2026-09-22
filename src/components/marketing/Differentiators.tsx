import React from 'react';
import { Code2, Clock, BadgeCheck, Cpu } from 'lucide-react';
import { SpotlightCard } from '../fx/SpotlightCard';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import sys from '../../styles/page-system.module.css';
import styles from './Differentiators.module.css';

// Bloque de 4 diferenciadores. Vivía dentro de src/pages/Cases.tsx (`WhySection`
// + `DIFFERENTIATORS`), es decir en la página que menos tráfico recibe. Se
// extrajo a un componente compartido para reubicarlo en Home, justo debajo del
// carrusel de casos y ENCIMA de la tabla comparativa "Por qué no el software de
// catálogo" — el mismo sitio relativo que ocupaba en /casos (después del
// carrusel), así que el titular de la sección sigue leyéndose como puente entre
// los casos y el argumento. /casos queda centrada solo en los casos.
//
// El markup y las clases son los mismos de antes; el CSS se movió íntegro y sin
// cambios de valor a Differentiators.module.css (ver su cabecera), no se copió
// a Home.module.css — que además YA tiene sus propias `.whySection`/`.whyGrid`
// para la tabla comparativa, y duplicar esos nombres en el mismo módulo habría
// colisionado.

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
        text: 'Sin proyectos eternos ni fases de consultoría facturadas por horas. Defines el problema, construimos la solución y la entregamos lista para usar en 6 a 8 semanas.',
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

export const Differentiators: React.FC = () => {
    const whyRef = useScrollReveal<HTMLDivElement>({ stagger: true });

    return (
        <section className={styles.whySection}>
            <div className={sys.container} ref={whyRef}>
                <div className={`${styles.whyHeader} reveal`}>
                    <h2 className={styles.whyTitle}>Resultados que se ven. No promesas de folleto</h2>
                    {/* Antes: "Somos un equipo pequeño que construye software a
                        medida…". Ese plural contradecía de frente el argumento que
                        la tabla comparativa hace dos secciones más abajo ("Escribes
                        a quien lo construyó. Te responde esa misma persona") y lo
                        que OpsPilot es realmente: una agencia unipersonal. El
                        párrafo se reescribe sin implicar equipo, y de paso el
                        "trato directo" REFUERZA ese argumento en vez de romperlo.
                        El resto del sitio mantiene el "nosotros" editorial, así que
                        no se pasa a primera persona del singular: eso sí chirriaría
                        contra las otras veinte frases en plural de la página. */}
                    <p className={styles.whySub}>
                        No es una agencia digital ni una consultora: es trato directo con
                        quien construye tu sistema. Software a medida para PYMEs que quieren
                        trabajar mejor, sin depender de herramientas genéricas ni de procesos
                        que no se adaptan a ellas.
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
