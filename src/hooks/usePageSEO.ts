import { useEffect } from 'react';

interface PageSEO {
    title: string;
    description: string;
    canonical?: string;
}

/**
 * Actualiza title, meta description y canonical por ruta.
 * SPA-friendly — sin librerías externas.
 */
export function usePageSEO({ title, description, canonical }: PageSEO) {
    useEffect(() => {
        document.title = title;

        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', description);

        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);

        let twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', title);

        let twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) twDesc.setAttribute('content', description);

        if (canonical) {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }
            link.setAttribute('href', canonical);

            const setAlt = (hreflang: string) => {
                let alt = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
                if (!alt) {
                    alt = document.createElement('link');
                    alt.setAttribute('rel', 'alternate');
                    alt.setAttribute('hreflang', hreflang);
                    document.head.appendChild(alt);
                }
                alt.setAttribute('href', canonical);
            };
            setAlt('es-ES');
            setAlt('x-default');

            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) ogUrl.setAttribute('content', canonical);
        }
    }, [title, description, canonical]);
}
