import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import styles from './NotFound.module.css';

export const NotFound: React.FC = () => {
    return (
        <div className={styles.wrap}>
            <div className={styles.inner}>
                <p className={styles.label}>
                    <span className={styles.labelDot} aria-hidden="true" />
                    error 404
                </p>

                <h1 className={styles.code} aria-label="Error 404 — página no encontrada">
                    404
                </h1>

                <p className={styles.copy}>
                    La página que buscas no existe o ha sido movida.
                </p>

                <div className={styles.actions}>
                    <Link to="/">
                        <Button variant="outline">Volver al inicio</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
