import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useMagnetic } from '../../hooks/useMagnetic';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonLookProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
}

/** Clase visual del botón — compartida por <Button> (button real) y por
 *  <ButtonLink>/<ButtonAnchor> (enlaces con aspecto de botón). Una sola fuente
 *  de verdad para que un enlace-botón nunca se desvíe del botón. */
function buttonClass({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
}: ButtonLookProps): string {
    return [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonLookProps {
    /** Activa el tirón magnético hacia el cursor (solo pointer:fine, off por
     *  defecto para no cambiar el comportamiento de los botones existentes). */
    magnetic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    magnetic = false,
    className = '',
    ...props
}) => {
    // Se llama siempre (regla de hooks). Si magnetic=false la ref no se asigna,
    // así que el efecto del hook se auto-desactiva (ref.current === null).
    const magneticRef = useMagnetic<HTMLButtonElement>({ strength: 0.28, radius: 40 });

    return (
        <button
            ref={magnetic ? magneticRef : undefined}
            className={buttonClass({ variant, size, fullWidth, className })}
            {...props}
        >
            {children}
        </button>
    );
};

/* ─────────────────────────────────────────────────────────────────────────
   ButtonLink / ButtonAnchor — navegación con aspecto de botón.

   Existen para matar un patrón que estaba repartido por TODA la web:

       <Link to="/contacto"><Button>Reservar</Button></Link>
       <a href="https://wa.me/..."><Button>WhatsApp</Button></a>

   Eso anida contenido interactivo dentro de un <a>, lo que el HTML prohíbe
   explícitamente (`<a>` no admite contenido interactivo entre sus
   descendientes). Consecuencias reales, además de la invalidez formal:

     · Accesibilidad: el lector de pantalla encuentra DOS controles anidados
       (un link y un button) donde el usuario percibe uno solo, y el orden de
       tabulación también pasa por los dos.
     · Semántica de activación: Enter/Espacio y el menú contextual se
       comportan distinto sobre el botón interior que sobre el enlace.
     · Estilo: `.button` fijaba `height`, así que el <a> exterior (inline)
       quedaba con una caja distinta a la del botón interior.

   La regla ahora es: UN solo elemento interactivo por CTA. Si navega, es un
   enlace con clase de botón; si ejecuta una acción, es un <button>.
   ───────────────────────────────────────────────────────────────────────── */

interface ButtonLinkProps extends Omit<LinkProps, 'className'>, ButtonLookProps {
    magnetic?: boolean;
    ref?: React.Ref<HTMLAnchorElement>;
}

/** Navegación interna (react-router) con aspecto de botón. */
export const ButtonLink: React.FC<ButtonLinkProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    magnetic = false,
    className = '',
    ref,
    ...props
}) => {
    const magneticRef = useMagnetic<HTMLAnchorElement>({ strength: 0.28, radius: 40 });

    return (
        <Link
            ref={ref ?? (magnetic ? magneticRef : undefined)}
            className={buttonClass({ variant, size, fullWidth, className })}
            {...props}
        >
            {children}
        </Link>
    );
};

interface ButtonAnchorProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'>,
        ButtonLookProps {}

/** Enlace EXTERNO (mailto:, tel:, https://…) con aspecto de botón. */
export const ButtonAnchor: React.FC<ButtonAnchorProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}) => (
    <a className={buttonClass({ variant, size, fullWidth, className })} {...props}>
        {children}
    </a>
);
