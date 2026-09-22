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
    // TODO: generate srcset with 1x/2x WebP for HiDPI to shave more KB off the
    // 95 KB PNG. Vite doesn't do this out of the box; needs vite-imagetools or
    // a manual export step.
    return (
        <img
            src="/images/logo.png"
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
