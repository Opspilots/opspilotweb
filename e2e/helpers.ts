import type { Page } from '@playwright/test';

/** Las 5 rutas públicas principales. `name` se usa para nombrar los baselines. */
export const ROUTES = [
    { name: 'home', path: '/' },
    { name: 'soluciones', path: '/soluciones' },
    { name: 'casos', path: '/casos' },
    { name: 'recursos', path: '/recursos' },
    { name: 'contacto', path: '/contacto' },
] as const;

/**
 * Navega y deja la página en un estado estable y comparable:
 * hidratada, con las fuentes ya resueltas y sin trabajo de red pendiente.
 *
 * Importante: las fuentes deben estar cargadas ANTES de medir tipografía o de
 * hacer un screenshot; si no, se mide el fallback y los tamaños/reflow bailan.
 */
export async function gotoStable(page: Page, path: string): Promise<void> {
    await page.goto(path, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
}

/**
 * Recorre la página entera de arriba abajo y vuelve al inicio.
 *
 * Aunque `reducedMotion: 'reduce'` revela el contenido sin esperar a
 * ScrollTrigger, este barrido fuerza cualquier carga perezosa (imágenes,
 * IntersectionObserver) antes de capturar el full-page. Sin él, un screenshot
 * de página completa puede salir con huecos.
 */
export async function scrollThroughPage(page: Page): Promise<void> {
    await page.evaluate(async () => {
        const step = window.innerHeight;
        const total = document.documentElement.scrollHeight;
        for (let y = 0; y < total; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => requestAnimationFrame(() => r(null)));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    await page.waitForLoadState('networkidle');
}

/** Medida de desbordamiento horizontal del documento. */
export interface OverflowMetrics {
    scrollWidth: number;
    innerWidth: number;
    /** Selectores de los elementos que sobresalen del viewport, si los hay. */
    offenders: string[];
}

/**
 * Mide el overflow horizontal y, si existe, identifica QUÉ elementos lo causan.
 *
 * Devolver solo el booleano haría el fallo inútil ("scrollWidth 431 > 430" no
 * dice dónde mirar). Recorremos el DOM buscando los elementos cuyo rect se sale
 * por la derecha del viewport y devolvemos un selector legible de cada uno.
 */
export async function measureOverflow(page: Page): Promise<OverflowMetrics> {
    return page.evaluate(() => {
        const innerWidth = window.innerWidth;
        const scrollWidth = document.documentElement.scrollWidth;

        const describe = (el: Element): string => {
            const tag = el.tagName.toLowerCase();
            const id = el.id ? `#${el.id}` : '';
            const cls =
                typeof el.className === 'string' && el.className.trim()
                    ? `.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}`
                    : '';
            return `${tag}${id}${cls}`;
        };

        const offenders: string[] = [];
        if (scrollWidth > innerWidth) {
            for (const el of Array.from(document.body.querySelectorAll('*'))) {
                const rect = el.getBoundingClientRect();
                // Ignoramos lo invisible y lo que no aporta anchura real.
                if (rect.width === 0 || rect.height === 0) continue;
                const style = getComputedStyle(el);
                if (style.visibility === 'hidden' || style.display === 'none') continue;
                // 1px de tolerancia para redondeos subpíxel.
                if (rect.right > innerWidth + 1) {
                    offenders.push(`${describe(el)} (right: ${Math.round(rect.right)}px)`);
                }
            }
        }

        // Los hijos heredan el desbordamiento del padre y saturarían la lista;
        // con los primeros basta para localizar el origen.
        return { scrollWidth, innerWidth, offenders: offenders.slice(0, 8) };
    });
}
