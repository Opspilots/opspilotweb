import React from 'react';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { CustomCursor } from '../fx/CustomCursor';
import { useLenis } from '../../hooks/useLenis';
import styles from './Layout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    useLenis();

    return (
        <div className={styles.layout}>
            {/* Primer elemento focusable del documento: con un Tab desde la barra
                de direcciones se salta la navbar entera y se aterriza en <main>.
                Oculto fuera de pantalla hasta que recibe foco. */}
            <a href="#main" className={styles.skipLink}>
                Saltar al contenido
            </a>
            <CustomCursor />
            <Navbar />
            {/* `tabIndex={-1}`: sin él, el salto por fragmento mueve el scroll pero
                NO el foco, y el siguiente Tab volvería al principio de la navbar. */}
            <main id="main" tabIndex={-1} className={styles.main}>
                {children}
            </main>
            <Footer />
        </div>
    );
};
