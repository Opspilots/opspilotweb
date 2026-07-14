import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '../../hooks/useLenis';

export const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        const lenis = getLenis();
        if (lenis) {
            // Salta al top de forma instantánea y actualiza el estado interno de
            // Lenis (si no, volvería a su posición previa en el siguiente frame).
            lenis.scrollTo(0, { immediate: true, force: true });
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [pathname]);
    return null;
};
