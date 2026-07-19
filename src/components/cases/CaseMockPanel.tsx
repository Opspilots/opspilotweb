import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    CalendarCheck2,
    FileCheck2,
    FileText,
    MessageSquare,
    Minus,
    Receipt,
    Users,
} from 'lucide-react';
import { MockPreview, type MockBlock } from '../marketing/MockPreview';
import type { CaseShowcase, ShowcaseIconKey } from '../../data';
import styles from './CaseMockPanel.module.css';

// Guard SSR — mismo patrón que useScrollReveal.ts.
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ICONS: Record<ShowcaseIconKey, React.FC<{ size?: number; strokeWidth?: number }>> = {
    chatMessage: MessageSquare,
    calendarCheck: CalendarCheck2,
    fileText: FileText,
    receipt: Receipt,
    documentCheck: FileCheck2,
    users: Users,
};

// Convierte el `ShowcaseBlock` (dato puro, iconos por clave — ver
// src/data/types.ts) al `MockBlock` genérico que consume MockPreview, igual
// que hace HeroLeadWidget.tsx con su propio `toMockBlock`.
function toMockBlock(block: CaseShowcase['block']): MockBlock {
    if (block.type === 'sequence') {
        return {
            type: 'sequence',
            beforeIcon: ICONS[block.beforeIcon],
            afterIcon: ICONS[block.afterIcon],
            beforeLabel: block.beforeLabel,
            afterLabel: block.afterLabel,
        };
    }
    return {
        type: 'modules',
        items: block.items.map((item) => ({
            key: item.key,
            icon: ICONS[item.icon],
            label: item.label,
            active: item.active,
        })),
    };
}

/** Detecta cuándo el panel entra en viewport, una sola vez, sin animar bajo
 * prefers-reduced-motion — mismo patrón que usaba el antiguo
 * CaseTransitionPanel (ScrollTrigger, once). Autocontenido a propósito: Home
 * y Casos disparan el reveal de la sección de casos con mecanismos distintos
 * (ScrollTrigger manual vs. scroll-driven CSS `animation-timeline: view()`),
 * así que en lugar de engancharse a cualquiera de los dos, el panel vigila
 * su propia entrada en viewport. */
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

export interface CaseMockPanelProps {
    showcase: CaseShowcase;
    className?: string;
}

/**
 * Panel de caso — sustituye al antiguo CaseTransitionPanel (iconos "antes →
 * después" convergiendo). Reutiliza MockPreview (el mismo lenguaje visual
 * del Paso 4 del hero) para mostrar una mini-interfaz FIJA por caso: sin
 * quiz, sin toggle antes/después — es una plantilla estática elegida a mano
 * por caso, que representa la MEJORA de ese sector concreto. El "antes"
 * pasa a ser una etiqueta pequeña y apagada (nota al margen), no un cluster
 * de iconos con peso visual propio — el protagonismo es de la mini-interfaz.
 *
 * La entrada anima al entrar en viewport (fade + rise del conjunto, más la
 * cascada interna de MockPreview sincronizada vía su prop `revealed`), una
 * sola vez, gateada tras prefers-reduced-motion.
 */
export const CaseMockPanel: React.FC<CaseMockPanelProps> = ({ showcase, className }) => {
    const { ref, revealed } = useRevealOnce<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className={`${styles.wrap}${className ? ` ${className}` : ''}`}
            data-revealed={revealed || undefined}
        >
            <MockPreview
                accent={showcase.accent}
                kicker={showcase.kicker}
                title={showcase.title}
                sub={showcase.sub}
                block={toMockBlock(showcase.block)}
                revealed={revealed}
            />
            <p className={styles.beforeTag}>
                <Minus size={10} strokeWidth={2.5} className={styles.beforeTagIcon} aria-hidden="true" />
                {showcase.beforeTag}
            </p>
        </div>
    );
};
