import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 60 }) => {
    // width/height HTML attrs match the rendered size (Navbar=50, Footer=45),
    // which prevents CLS while the image decodes.
    // logo.webp es un export 120x120 (2x del mayor tamano renderizado) generado
    // desde logo.png con sharp; el PNG original queda en public/ solo como
    // fuente para regenerarlo.
    return (
        <img
            src="/images/logo.webp"
            alt="OpsPilot"
            width={size}
            height={size}
            className={className}
            style={{ objectFit: 'contain', transition: 'transform var(--transition-expressive)' }}
            loading="eager"
            decoding="async"
        />
    );
};
