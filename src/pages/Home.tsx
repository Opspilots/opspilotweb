import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './Home.module.css';

export const Home: React.FC = () => {
    const problemRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const solutionsRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const methodRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const caseRef = useScrollReveal<HTMLDivElement>({ stagger: true });
    const ctaRef = useScrollReveal<HTMLDivElement>();

    return (
        <div className={styles.page}>
            {/* ═══ SECTION 1: HERO ═══ */}
            <section className={styles.hero}>
                <div className={`${styles.heroGlow} anim-pulse-glow`}></div>
                <div className={styles.heroGrid}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            Gestiona tu negocio como las grandes empresas.<br />
                            <span className="text-gradient">Sin su presupuesto ni su complejidad.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Software propio para gestionar tu empresa, presupuestar en minutos,
                            analizar tarifas y automatizar lo que te roba tiempo.
                            O lo construimos a medida si tu caso lo necesita.
                        </p>
                        <div className={styles.ctaGroup}>
                            <Link to="/contact">
                                <Button variant="primary" size="lg">Cuéntanos qué te frena</Button>
                            </Link>
                            <Link to="/soluciones">
                                <Button variant="outline" size="lg">¿Cuál es tu problema?</Button>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.heroVisual}>
                        <div className={styles.dashboardMock}>
                            <div className={styles.mockHeader}>
                                <div className={styles.mockDots}>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                            <div className={styles.mockBody}>
                                <div className={styles.mockSidebar}>
                                    <div className={styles.mockNav}></div>
                                    <div className={styles.mockNav}></div>
                                    <div className={styles.mockNav}></div>
                                    <div className={styles.mockNav}></div>
                                </div>
                                <div className={styles.mockContent}>
                                    <div className={styles.mockChart}></div>
                                    <div className={styles.mockCards}>
                                        <div className={styles.mockCard}></div>
                                        <div className={styles.mockCard}></div>
                                        <div className={styles.mockCard}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.floatingBadge} ${styles.badge1} anim-float`}>
                            <span className={styles.badgeIcon}>📊</span>
                            <span>Sin más Excels</span>
                        </div>
                        <div className={`${styles.floatingBadge} ${styles.badge2} anim-float-slow`}>
                            <span className={styles.badgeIcon}>⚡</span>
                            <span>Presupuesto en 2 minutos</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 2: EL PROBLEMA ═══ */}
            <section className={styles.problemSection}>
                <div className={styles.container} ref={problemRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <span className={styles.sectionTag}>El problema</span>
                        <h2 className={styles.sectionTitle}>¿Alguna de estas te suena?</h2>
                    </div>
                    <div className={styles.problemGrid}>
                        <div className={`${styles.problemCard} reveal`}>
                            <div className={styles.problemIcon}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#39ce86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <h3 className={styles.problemTitle}>Horas perdidas en lo de siempre</h3>
                            <p className={styles.problemText}>
                                Presupuestos a mano, seguimientos por WhatsApp, facturas en Excel.
                                El día se va en cosas que podrían hacerse solas.
                            </p>
                        </div>
                        <div className={`${styles.problemCard} reveal`}>
                            <div className={styles.problemIcon}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#39ce86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                    <line x1="4" y1="22" x2="4" y2="15" />
                                </svg>
                            </div>
                            <h3 className={styles.problemTitle}>Herramientas que no se hablan entre sí</h3>
                            <p className={styles.problemText}>
                                Un programa aquí, una hoja allá, el email por otro lado.
                                Datos por todas partes que no te dicen nada útil.
                            </p>
                        </div>
                        <div className={`${styles.problemCard} reveal`}>
                            <div className={styles.problemIcon}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#39ce86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h3 className={styles.problemTitle}>Sin nadie que te oriente de verdad</h3>
                            <p className={styles.problemText}>
                                Sabes que hay mejores formas de hacer las cosas, pero no tienes
                                a nadie de confianza que te diga cuál y cómo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 3: ENCUENTRA TU SOLUCIÓN ═══ */}
            <section className={styles.solutionsSection}>
                <div className={styles.container} ref={solutionsRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <span className={styles.sectionTag}>¿Para quién es OpsPilot?</span>
                        <h2 className={styles.sectionTitle}>Encuentra tu solución en segundos</h2>
                        <p style={{ color: 'var(--color-dark-text-muted)', marginTop: 'var(--spacing-4)', maxWidth: '520px', margin: 'var(--spacing-4) auto 0' }}>
                            Cada negocio tiene su problema. Elige el tuyo y te mostramos exactamente qué tenemos para ti.
                        </p>
                    </div>
                    <div className={styles.solutionsGrid}>
                        <div className={`${styles.solutionCard} reveal`}>
                            <div className={styles.solutionIcon}>📋</div>
                            <h3 className={styles.solutionTitle}>Presupuestar y cotizar me roba el día</h3>
                            <p className={styles.solutionText}>
                                Para reformistas, fontaneros, instaladores y cualquier oficio
                                que necesite generar presupuestos profesionales en minutos.
                            </p>
                            <span className={styles.solutionLabel}>Presupuestador Pro · Desde 25€/mes</span>
                            <Link to="/product#presupuestador">
                                <Button variant="outline" size="md">Ver solución →</Button>
                            </Link>
                        </div>
                        <div className={`${styles.solutionCard} reveal`}>
                            <div className={styles.solutionIcon}>⚡</div>
                            <h3 className={styles.solutionTitle}>Analizo tarifas eléctricas a mano</h3>
                            <p className={styles.solutionText}>
                                Para comerciales de energía que necesitan proponer la mejor tarifa
                                a cada cliente sin perder horas en análisis manuales.
                            </p>
                            <span className={styles.solutionLabel}>TarifaOCR · Consultar precio</span>
                            <Link to="/product#tarifaocr">
                                <Button variant="outline" size="md">Ver solución →</Button>
                            </Link>
                        </div>
                        <div className={`${styles.solutionCard} ${styles.solutionCardHighlight} reveal`}>
                            <div className={styles.solutionIcon}>🏢</div>
                            <h3 className={styles.solutionTitle}>Mi empresa se gestiona con Excel y se me escapa todo</h3>
                            <p className={styles.solutionText}>
                                Para PYMEs y autónomos que necesitan control real:
                                empleados, inventario, ventas, proveedores y analítica en un solo lugar.
                            </p>
                            <span className={styles.solutionLabel}>ERP OpsPilot · Desde 29€/mes</span>
                            <Link to="/product#erp">
                                <Button variant="primary" size="md">Ver solución →</Button>
                            </Link>
                        </div>
                    </div>
                    <div className={`${styles.solutionsFooter} reveal`} style={{ textAlign: 'center', marginTop: 'var(--spacing-10)' }}>
                        <p style={{ color: 'var(--color-dark-text-muted)', marginBottom: 'var(--spacing-4)' }}>¿No encuentras tu caso aquí?</p>
                        <Link to="/soluciones">
                            <Button variant="outline" size="md">Ver todas las soluciones</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 4: EL MÉTODO OPSPILOT ═══ */}
            <section className={styles.methodSection}>
                <div className={styles.container} ref={methodRef}>
                    <div className={`${styles.sectionHeader} reveal`}>
                        <span className={styles.sectionTag}>Nuestro método</span>
                        <h2 className={styles.sectionTitle}>
                            Así trabajamos contigo.<br />Sin reuniones eternas, sin documentos de 40 páginas.
                        </h2>
                    </div>
                    <div className={styles.processGrid}>
                        <div className={`${styles.processStep} reveal`}>
                            <div className={styles.stepNumber}>01</div>
                            <div className={styles.stepConnector}></div>
                            <h3 className={styles.stepTitle}>Te escuchamos</h3>
                            <p className={styles.stepText}>
                                Una llamada de 30 minutos para entender tu negocio,
                                tu equipo y qué te está frenando ahora mismo.
                            </p>
                        </div>
                        <div className={`${styles.processStep} reveal`}>
                            <div className={styles.stepNumber}>02</div>
                            <div className={styles.stepConnector}></div>
                            <h3 className={styles.stepTitle}>Localizamos el problema real</h3>
                            <p className={styles.stepText}>
                                Identificamos qué procesos te roban tiempo, qué herramientas
                                no funcionan y qué está faltando en tu flujo.
                            </p>
                        </div>
                        <div className={`${styles.processStep} reveal`}>
                            <div className={styles.stepNumber}>03</div>
                            <div className={styles.stepConnector}></div>
                            <h3 className={styles.stepTitle}>Te proponemos algo concreto</h3>
                            <p className={styles.stepText}>
                                Un plan claro con opciones reales, precio cerrado y plazos.
                                Tú decides si seguimos adelante.
                            </p>
                        </div>
                        <div className={`${styles.processStep} reveal`}>
                            <div className={styles.stepNumber}>04</div>
                            <h3 className={styles.stepTitle}>Lo hacemos y nos quedamos</h3>
                            <p className={styles.stepText}>
                                Construimos, implementamos y no desaparecemos.
                                Seguimos contigo mientras nos necesites.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 5: CASO DE ÉXITO ═══ */}
            <section className={styles.caseSection}>
                <div className={styles.container} ref={caseRef}>
                    <div className={styles.caseGrid}>
                        <div className={`${styles.caseContent} reveal`}>
                            <span className={styles.sectionTag}>Caso de éxito</span>
                            <h2 className={styles.caseTitle}>
                                J.R. Rodríguez: De la libreta al sistema que trabaja solo.
                            </h2>
                            <ul className={styles.caseChecklist}>
                                <li>
                                    <span className={styles.checkIcon}>✓</span>
                                    Marca e identidad visual creadas desde cero. Ahora tienen una presencia que transmite profesionalidad.
                                </li>
                                <li>
                                    <span className={styles.checkIcon}>✓</span>
                                    Presupuestador con IA: genera imágenes realistas de la reforma antes de empezar. Los clientes dicen que sí más fácil.
                                </li>
                                <li>
                                    <span className={styles.checkIcon}>✓</span>
                                    WhatsApp automatizado: citas y visitas gestionadas sin intervención manual. Cero llamadas para confirmar.
                                </li>
                                <li>
                                    <span className={styles.checkIcon}>✓</span>
                                    CRM a medida: control total de clientes, estados de obra y facturación en un solo lugar. Nada se pierde.
                                </li>
                            </ul>
                            <div className={styles.caseResult}>
                                <p>Una empresa familiar de reformas que triplicó su capacidad de atención en 3 meses sin contratar a nadie más.</p>
                            </div>
                        </div>
                        <div className={`${styles.caseVisual} reveal`}>
                            <div className={`${styles.phoneMockup} anim-float-slow`}>
                                <div className={styles.phoneScreen}>
                                    <div className={styles.phoneHeader}>
                                        <div className={styles.phoneNotch}></div>
                                    </div>
                                    <div className={styles.phoneContent}>
                                        <div className={styles.reformCard}>
                                            <div className={styles.reformImage}></div>
                                            <div className={styles.reformInfo}>
                                                <div className={styles.reformTitle}>Reforma Cocina</div>
                                                <div className={styles.reformPrice}>€4.200</div>
                                            </div>
                                        </div>
                                        <div className={styles.reformCard}>
                                            <div className={`${styles.reformImage} ${styles.reform2}`}></div>
                                            <div className={styles.reformInfo}>
                                                <div className={styles.reformTitle}>Reforma Baño</div>
                                                <div className={styles.reformPrice}>€2.800</div>
                                            </div>
                                        </div>
                                        <div className={`${styles.whatsappBadge} anim-border-glow`}>
                                            <span>💬</span> 3 citas hoy
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 6: CIERRE / CTA ═══ */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={`${styles.ctaBlock} reveal`} ref={ctaRef}>
                        <div className={`${styles.ctaGlow} anim-pulse-glow`}></div>
                        <h2 className={styles.ctaTitle}>
                            ¿Por dónde empieza tu negocio?
                        </h2>
                        <p className={styles.ctaSub} style={{ textAlign: 'center', color: 'var(--color-dark-text-muted)', marginBottom: 'var(--spacing-8)' }}>
                            30 minutos de llamada gratuita. Te decimos qué podemos hacer por ti y cuánto costaría.<br />
                            Sin compromiso, sin presión.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link to="/contact">
                                <Button variant="primary" size="lg">Reservar diagnóstico gratuito</Button>
                            </Link>
                            <Link to="/product">
                                <Button variant="outline" size="lg">Ver nuestros productos</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
