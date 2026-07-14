import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Head } from 'vite-react-ssg';

interface RedirectToProps {
    to: string;
}

/**
 * Redirección client-side hacia una ruta canónica.
 *
 * En vite-react-ssg los `loader` solo se ejecutan en build (para fetch de
 * datos), no en navegación, por lo que un `redirect()` dentro de un loader no
 * dispararía en cliente. La forma soportada es este componente: en SSG
 * prerenderiza vacío y, al cargar en el navegador, redirige con `replace`.
 * Mismo comportamiento que el antiguo `<Navigate replace>`.
 */
export const RedirectTo: React.FC<RedirectToProps> = ({ to }) => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to, { replace: true });
    }, [navigate, to]);
    return (
        <Head>
            <title>Redirigiendo… — OpsPilot</title>
            <meta name="robots" content="noindex, follow" />
        </Head>
    );
};
