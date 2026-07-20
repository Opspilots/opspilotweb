import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { Logo } from './Logo';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ROUTES } from '../../lib/routes';
import styles from './Navbar.module.css';

/**
 * Link de navegación desktop: indicador de "activo" compartido (motion layoutId)
 * que se desliza entre enlaces. Sin tirón magnético — en una barra de navegación
 * mover los enlaces hacia el cursor entorpece el clic más de lo que aporta.
 */
function NavItem({ to, end, children }: { to: string; end?: boolean; children: React.ReactNode }) {
    const reduce = usePrefersReducedMotion();

    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
        >
            {({ isActive }) => (
                <>
                    <span className={styles.navLinkLabel}>{children}</span>
                    {isActive && (
                        <motion.span
                            layoutId="nav-active-indicator"
                            className={styles.navIndicator}
                            transition={
                                reduce
                                    ? { duration: 0 }
                                    : { type: 'spring', stiffness: 420, damping: 34 }
                            }
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`;

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.container}>
                    <Link to={ROUTES.home} className={styles.logo}>
                        <Logo size={50} />
                        OpsPilot
                    </Link>

                    <div className={styles.desktopMenu}>
                        <NavItem to={ROUTES.home} end>Inicio</NavItem>
                        <NavItem to={ROUTES.soluciones}>Soluciones</NavItem>
                        <NavItem to={ROUTES.casos}>Casos de Éxito</NavItem>
                        <NavItem to={ROUTES.recursos}>Recursos</NavItem>
                        <Link to={ROUTES.contacto}>
                            <Button variant="primary" size="sm">Diagnóstico gratuito</Button>
                        </Link>
                    </div>

                    <button
                        className={`${styles.mobileToggle} ${isMenuOpen ? styles.active : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-nav-menu"
                    >
                        <span className={styles.hamburger}></span>
                    </button>
                </div>
            </nav>

            <div
                id="mobile-nav-menu"
                className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}
                inert={!isMenuOpen}
                aria-hidden={!isMenuOpen}
            >
                <NavLink to={ROUTES.home} end className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Inicio</NavLink>
                <NavLink to={ROUTES.soluciones} className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Soluciones</NavLink>
                <NavLink to={ROUTES.casos} className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Casos de Éxito</NavLink>
                <NavLink to={ROUTES.recursos} className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Recursos</NavLink>
                <NavLink to={ROUTES.contacto} className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Contacto</NavLink>
                <div className={styles.mobileCta}>
                    <Link to={ROUTES.contacto} onClick={() => setIsMenuOpen(false)} style={{ width: '100%' }}>

                        <Button variant="primary" fullWidth>Diagnóstico gratuito</Button>
                    </Link>
                </div>
            </div>
        </>
    );
};
