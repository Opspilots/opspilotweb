import React from 'react';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { useLenis } from '../../hooks/useLenis';
import styles from './Layout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    useLenis();

    return (
        <div className={styles.layout}>
            <Navbar />
            <main className={styles.main}>
                {children}
            </main>
            <Footer />
        </div>
    );
};
