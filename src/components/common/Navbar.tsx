import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ButtonLink } from '../ui/Button';
import { Logo } from './Logo';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { getLenis } from '../../hooks/useLenis';
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
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();

    // Fondo de la navbar al hacer scroll — versión simple (ver e260cc7):
    // solo alterna la clase .scrolled, que en CSS únicamente cambia
    // background/border-color. Ningún cambio de posición ni tamaño aquí.
    //
    // `menuOpenRef` congela este estado mientras el menú móvil está abierto: el
    // bloqueo de scroll pone el body en `position: fixed`, lo que lleva el
    // scroll del documento a 0 y dispara un evento de scroll. Sin el guard, la
    // navbar perdería su fondo justo al abrir el menú y lo recuperaría al
    // cerrar — un parpadeo por un scroll que el usuario no ha hecho.
    const menuOpenRef = useRef(false);
    menuOpenRef.current = isMenuOpen;

    useEffect(() => {
        const handleScroll = () => {
            if (menuOpenRef.current) return;
            setScrolled(window.scrollY > 12);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const toggleRef = useRef<HTMLButtonElement>(null);
    const firstLinkRef = useRef<HTMLAnchorElement>(null);

    // Al cruzar a DESKTOP el overlay pasa a `display: none` por CSS, pero el
    // estado seguiría abierto: <main> quedaría `inert` y el body bloqueado sin
    // nada visible que cerrar. Cerramos en cuanto el breakpoint deja de aplicar.
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(min-width: 1024px)');   // DESKTOP
        const sync = () => {
            if (mq.matches) setIsMenuOpen(false);
        };
        sync();
        mq.addEventListener?.('change', sync);
        return () => mq.removeEventListener?.('change', sync);
    }, []);

    /** Cierre por navegación: el foco lo gestionará la página de destino. */
    const closeMenu = () => setIsMenuOpen(false);

    /** Cierre por descarte (hamburguesa o Escape): el foco vuelve al control
     *  que lo abrió, que es donde el usuario lo dejó. */
    const dismissMenu = () => {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
    };

    /* ─────────────────────────────────────────────────────────────────────
       El menú móvil se comporta como un MODAL, no como un panel opaco.

       Antes era solo un `position: fixed` con fondo sólido encima de la
       página. Visualmente tapaba, pero no aislaba: el contenido de detrás
       seguía siendo tabulable con teclado (Tab se iba "dentro" de una página
       que el usuario no veía) y el body seguía haciendo scroll — arrastrar
       sobre el overlay movía la página 385px por detrás sin que nada se
       viera mover, así que al cerrar aparecías en otro sitio.

       Las cuatro piezas que faltaban, todas aquí:
         1. `inert` sobre <main> y <footer> mientras está abierto. Se buscan
            en el documento porque el Layout los monta como hermanos de la
            navbar, no como hijos suyos. El propio overlay NO recibe inert
            (ya lo gestiona su prop, invertida).
         2. Bloqueo de scroll del body con el patrón `position: fixed;
            top: -scrollY` (Safari iOS ignora `overflow: hidden` en body) +
            Lenis parado, que es quien realmente conduce el scroll aquí.
            Al cerrar se restaura la posición exacta.
         3. Escape cierra.
         4. Foco al primer enlace al abrir; vuelve al hamburguesa al cerrar
            (ver `dismissMenu`).

       El `aria-label/expanded/controls` del botón ya era correcto y no se
       toca. ───────────────────────────────────────────────────────────── */
    useEffect(() => {
        if (!isMenuOpen) return;
        if (typeof document === 'undefined') return;

        const { body } = document;
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');

        main?.setAttribute('inert', '');
        footer?.setAttribute('inert', '');

        const lenis = getLenis();
        lenis?.stop();

        const scrollY = window.scrollY;
        const previous = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
            overflow: body.style.overflow,
        };
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            dismissMenu();
        };
        document.addEventListener('keydown', onKeyDown);

        // El overlay entra con una transición de transform; el foco puede ir
        // ya, el elemento es alcanzable desde el primer frame (no está
        // display:none ni inert).
        firstLinkRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            main?.removeAttribute('inert');
            footer?.removeAttribute('inert');

            body.style.position = previous.position;
            body.style.top = previous.top;
            body.style.left = previous.left;
            body.style.right = previous.right;
            body.style.width = previous.width;
            body.style.overflow = previous.overflow;

            // Restaurar la posición de scroll REAL. `window.scrollTo` por sí
            // solo no basta cuando Lenis está activo: mantiene su propia
            // posición interpolada y volvería a ella en el siguiente frame.
            window.scrollTo(0, scrollY);
            lenis?.start();
            lenis?.scrollTo(scrollY, { immediate: true, force: true });
        };
        // `dismissMenu` se recrea en cada render pero solo llama a setState y a
        // .focus() sobre una ref: añadirlo como dependencia remontaría todo el
        // bloqueo de scroll en cada render sin cambiar el comportamiento.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMenuOpen]);

    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`;

    return (
        <>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
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
                        <ButtonLink to={ROUTES.contacto} variant="primary" size="sm">
                            Empieza ahora
                        </ButtonLink>
                    </div>

                    <button
                        ref={toggleRef}
                        type="button"
                        className={`${styles.mobileToggle} ${isMenuOpen ? styles.active : ''}`}
                        onClick={() => (isMenuOpen ? dismissMenu() : setIsMenuOpen(true))}
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
                /* Lenis conduce el scroll del documento; sin esto seguiría
                   capturando la rueda/el gesto dentro del propio overlay. */
                data-lenis-prevent
            >
                <NavLink ref={firstLinkRef} to={ROUTES.home} end className={mobileNavLinkClass} onClick={closeMenu}>Inicio</NavLink>
                <NavLink to={ROUTES.soluciones} className={mobileNavLinkClass} onClick={closeMenu}>Soluciones</NavLink>
                <NavLink to={ROUTES.casos} className={mobileNavLinkClass} onClick={closeMenu}>Casos de Éxito</NavLink>
                <NavLink to={ROUTES.recursos} className={mobileNavLinkClass} onClick={closeMenu}>Recursos</NavLink>
                <NavLink to={ROUTES.contacto} className={mobileNavLinkClass} onClick={closeMenu}>Contacto</NavLink>
                <div className={styles.mobileCta}>
                    <ButtonLink
                        to={ROUTES.contacto}
                        onClick={closeMenu}
                        variant="primary"
                        fullWidth
                    >
                        Empieza ahora
                    </ButtonLink>
                </div>
            </div>
        </>
    );
};
