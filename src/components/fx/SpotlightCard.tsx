import React from 'react';
import { useSpotlight } from '../../hooks/useSpotlight';

type SpotlightCardProps<E extends React.ElementType> = {
    /** Elemento a renderizar (div por defecto; p. ej. "article"). */
    as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as'>;

/**
 * Wrapper de card con spotlight que sigue al puntero (useSpotlight escribe
 * --mx/--my y el atributo data-spotlight-active). El halo/borde iluminado lo
 * pinta el CSS de cada card vía esas custom properties, así cada superficie
 * decide su propia intensidad. Táctil y reduced-motion: sin efecto.
 *
 * Para el tratamiento "de serie" (glass + halo + elevación + sombra tintada)
 * compón las utilidades globales de index.css en className:
 *   <SpotlightCard className="glass spotlight hover-lift">…</SpotlightCard>
 * Las páginas que ya definen su propio CSS de card (con --mx/--my y
 * data-spotlight-active) siguen funcionando sin cambios.
 */
export function SpotlightCard<E extends React.ElementType = 'div'>({
    as,
    children,
    ...rest
}: SpotlightCardProps<E>) {
    const ref = useSpotlight<HTMLElement>();
    const Tag = (as ?? 'div') as React.ElementType;
    return (
        <Tag ref={ref} {...rest}>
            {children}
        </Tag>
    );
}
