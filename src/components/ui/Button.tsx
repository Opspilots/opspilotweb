import React from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
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
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
