import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 60 }) => {
    // width/height HTML attrs match the rendered size (Navbar=50, Footer=45),
    // which prevents CLS while the image decodes.
    // TODO: generate srcset with 1x/2x WebP for HiDPI to shave more KB off the
    // 95 KB PNG. Vite doesn't do this out of the box; needs vite-imagetools or
    // a manual export step.
    return (
        <img
            src="/images/logo.png"
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
