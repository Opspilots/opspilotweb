import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
    /**
     * Texto alternativo. Pasa `alt=""` allí donde el logo sea DECORATIVO
     * (p. ej. el del footer: la marca ya la anuncia el logo de la navbar y el
     * propio texto "OpsPilot" que acompaña al enlace), para no repetir el
     * mismo nombre dos veces en un lector de pantalla.
     */
    alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 60, alt = 'OpsPilot' }) => {
    // width/height HTML attrs match the rendered size (Navbar=50, Footer=45),
    // which prevents CLS while the image decodes.
    // logo.webp es un export 120x120 (2x del mayor tamano renderizado) generado
    // desde logo.png con sharp; el PNG original queda en public/ solo como
    // fuente para regenerarlo.
    return (
        <img
            src="/images/logo.webp"
            alt={alt}
            width={size}
            height={size}
            className={className}
            style={{ objectFit: 'contain', transition: 'transform var(--transition-expressive)' }}
            loading="eager"
            decoding="async"
        />
    );
};
