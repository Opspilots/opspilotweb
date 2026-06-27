import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Logo } from './Logo';
import { ROUTES } from '../../lib/routes';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = useLocation();

    const isHomePage = pathname === ROUTES.home;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const isOpaque = !isHomePage || scrolled;

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`;

    return (
        <>
            <nav className={`${styles.navbar} ${isOpaque ? styles.scrolled : ''}`}>
                <div className={styles.container}>
                    <Link to={ROUTES.home} className={styles.logo}>
                        <Logo size={50} />
                        OpsPilot
                    </Link>

                    <div className={styles.desktopMenu}>
                        <NavLink to={ROUTES.home} end className={navLinkClass}>Inicio</NavLink>
                        <NavLink to={ROUTES.productos} className={navLinkClass}>Productos</NavLink>
                        <NavLink to={ROUTES.soluciones} className={navLinkClass}>Soluciones</NavLink>
                        <NavLink to={ROUTES.casos} className={navLinkClass}>Casos de Éxito</NavLink>
                        <NavLink to={ROUTES.recursos} className={navLinkClass}>Recursos</NavLink>
                        <Link to={ROUTES.contacto}>
                            <Button variant="primary" size="sm">Diagnóstico gratuito</Button>
                        </Link>
                    </div>

                    <button
                        className={`${styles.mobileToggle} ${isMenuOpen ? styles.active : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={styles.hamburger}></span>
                    </button>
                </div>
            </nav>

            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <NavLink to={ROUTES.home} end className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Inicio</NavLink>
                <NavLink to={ROUTES.productos} className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Productos</NavLink>
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
