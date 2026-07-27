import React from 'react';

/**
 * La letra pequeña de los casos de éxito, escrita UNA sola vez.
 *
 * Antes vivía copiada en src/pages/Home.tsx y en src/pages/Cases.tsx, y las
 * dos copias habían divergido: la de /casos hablaba de "cifras
 * representativas" y de "métricas [que] ilustran resultados típicos", la de
 * la portada sólo de nombres y testimonios. Peor que la divergencia era el
 * fondo: NO HAY CIFRAS que advertir. Las stats numéricas de los casos se
 * eliminaron hace tiempo (ver la nota del reveal desaparecido en Home.tsx y
 * `CaseShowcase` en src/data/types.ts, que sustituyó a "las antiguas stats
 * numéricas"), y src/data/cases.ts documenta la regla con todas las letras:
 * ni un porcentaje, ni una gráfica, ni un contador. Un descargo que avisa de
 * un riesgo inexistente no protege a nadie; sólo tapa lo que sí sigue siendo
 * cierto, que es que cada caso es una composición y que los testimonios van
 * anonimizados.
 *
 * `className` en vez de un CSS Module propio porque las dos páginas lo
 * pintan con tipografía y color distintos (`--font-size-xs` /
 * `--color-text-subtle` en /casos, `--font-size-sm` / `--color-text-muted`
 * en la portada) y esto es un arreglo de contenido y accesibilidad, no un
 * rediseño: se unifica el TEXTO, no el aspecto.
 */
export const CasesDisclaimer: React.FC<{ className?: string }> = ({ className }) => (
    <p className={className}>
        Cada caso resume varios proyectos del mismo sector, no un cliente
        concreto. Omitimos nombres y datos identificativos por privacidad, y
        los testimonios se publican anonimizados.
    </p>
);
