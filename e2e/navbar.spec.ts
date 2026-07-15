import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { gotoStable } from './helpers';

/**
 * Cabecera móvil — simetría de gutters y áreas táctiles.
 *
 * Estos tests codifican la INTENCIÓN de diseño, no el estado actual. Varios
 * fallan a propósito hoy: son el baseline de bugs conocidos que arregla la
 * fase 2 del refactor. Ver el comentario de cada uno.
 *
 * El proyecto `ipad-mini-768` se salta el fichero entero: 768px es exactamente
 * el breakpoint `min-width: 768px` donde la hamburguesa desaparece y entra el
 * menú desktop, así que no hay cabecera móvil que medir.
 */
test.describe('Cabecera móvil', () => {
    test.skip(
        ({ viewport }) => (viewport?.width ?? 0) >= 768,
        'A partir de 768px la navbar cambia al menú desktop: no hay hamburguesa.'
    );

    /**
     * Gutter izquierdo del logo = distancia del borde del viewport al logo.
     *
     * Se acota a `<nav>`: el wordmark "OpsPilot" también aparece en el footer,
     * así que sin acotar el locator es ambiguo (strict mode violation).
     */
    async function logoGutter(page: Page): Promise<number> {
        const logo = page.locator('nav').first().getByRole('link', { name: 'OpsPilot' });
        const box = await logo.boundingBox();
        expect(box, 'No se encontró el logo en la cabecera').not.toBeNull();
        return box!.x;
    }

    /**
     * Alto real del área táctil de un control.
     *
     * No basta con el rect del propio elemento: el CTA del menú es un
     * `<a>` (inline) envolviendo un `<button>` (bloque). El rect del ancla
     * colapsa a la altura de línea (~20px) aunque lo que el dedo toca es el
     * botón de dentro. Medir solo el ancla daría un falso positivo de "target
     * pequeño". Nos quedamos con el descendiente más alto.
     */
    async function tapTargetHeight(locator: ReturnType<Page['locator']>): Promise<number> {
        return locator.evaluate((el) => {
            const rects = [
                el.getBoundingClientRect(),
                ...Array.from(el.querySelectorAll('*')).map((c) => c.getBoundingClientRect()),
            ];
            return Math.max(...rects.map((r) => r.height));
        });
    }

    /**
     * Gutter derecho del TRAZO de la hamburguesa.
     *
     * Ojo: medimos el <span> del trazo (1.25rem), no el <button> (2.75rem). El
     * botón se agranda para dar área táctil, pero lo que el ojo alinea contra
     * el logo es el trazo. Medir el botón escondería el bug.
     */
    async function hamburgerStrokeGutter(page: Page): Promise<number> {
        const stroke = page.getByRole('button', { name: 'Abrir menú' }).locator('span');
        const box = await stroke.boundingBox();
        expect(box, 'No se encontró el trazo de la hamburguesa').not.toBeNull();
        const viewportWidth = page.viewportSize()!.width;
        return viewportWidth - (box!.x + box!.width);
    }

    test(
        'el gutter del logo y el del trazo de la hamburguesa son simétricos',
        { tag: ['@critical', '@e2e', '@navbar', '@NAV-E2E-001'] },
        async ({ page }) => {
            await gotoStable(page, '/');

            const left = await logoGutter(page);
            const right = await hamburgerStrokeGutter(page);

            /**
             * FALLA HOY — bug real, se arregla en fase 2.
             *
             * Causa: `.container` aplica `padding: 0 var(--spacing-7)` (28px), pero
             * `.mobileToggle` mide 2.75rem (44px) y centra un trazo de 1.25rem
             * (20px). Eso mete (44-20)/2 = 12px de aire extra a la derecha:
             *   izquierda = 28px · derecha = 28 + 12 = 40px.
             *
             * La solución NO es encoger el botón (rompería el área táctil ≥44px
             * que verifica el test de más abajo), sino compensar con un margin
             * negativo o desplazar el padding del contenedor.
             */
            expect(
                Math.abs(left - right),
                `Gutters asimétricos: logo a ${left}px del borde izquierdo, trazo de la hamburguesa a ${right}px del derecho.`
            ).toBeLessThanOrEqual(1);
        }
    );

    test(
        'con el menú abierto, el gutter de los links coincide con el del logo',
        { tag: ['@critical', '@e2e', '@navbar', '@NAV-E2E-002'] },
        async ({ page }) => {
            await gotoStable(page, '/');

            const left = await logoGutter(page);

            await page.getByRole('button', { name: 'Abrir menú' }).click();
            const menu = page.locator('#mobile-nav-menu');
            await expect(menu).toBeVisible();
            // El panel entra con translateX: esperamos a que el transform acabe
            // antes de medir, o mediríamos una posición intermedia.
            await expect(page.getByRole('button', { name: 'Cerrar menú' })).toBeVisible();
            await page.waitForTimeout(400);

            const linkBox = await menu.getByRole('link', { name: 'Soluciones' }).boundingBox();
            expect(linkBox, 'No se encontró el link "Soluciones" en el menú móvil').not.toBeNull();

            /**
             * FALLA HOY — bug real, se arregla en fase 2.
             *
             * Causa: `.mobileMenu` usa `padding: var(--spacing-8) var(--spacing-6)`
             * → 24px laterales, mientras el logo de la cabecera vive a 28px
             * (`--spacing-7`). Al abrir el menú, el texto salta 4px a la izquierda.
             *
             * Ambos deberían leer del token `--gutter` (1.75rem = 28px), que ya
             * existe en variables.css justamente para esto.
             */
            expect(
                linkBox!.x,
                `El link del menú arranca a ${linkBox!.x}px pero el logo está a ${left}px: el contenido salta al abrir el menú.`
            ).toBeCloseTo(left, 0);
        }
    );

    test(
        'los controles de navegación tienen área táctil ≥44px',
        { tag: ['@high', '@e2e', '@navbar', '@a11y', '@NAV-E2E-003'] },
        async ({ page }) => {
            await gotoStable(page, '/');

            // WCAG 2.2 (2.5.8 Target Size, nivel AA) pide un mínimo de 24px;
            // 44px es la guía de Apple HIG y el estándar de facto en táctil.
            const MIN = 44;

            const toggle = page.getByRole('button', { name: 'Abrir menú' });
            const toggleBox = await toggle.boundingBox();
            expect(toggleBox, 'No se encontró el botón de menú').not.toBeNull();
            expect(
                Math.min(toggleBox!.width, toggleBox!.height),
                `El botón de menú mide ${toggleBox!.width}x${toggleBox!.height}px.`
            ).toBeGreaterThanOrEqual(MIN);

            await toggle.click();
            await expect(page.getByRole('button', { name: 'Cerrar menú' })).toBeVisible();
            await page.waitForTimeout(400);

            const menu = page.locator('#mobile-nav-menu');
            const links = menu.getByRole('link');
            const count = await links.count();
            expect(count, 'El menú móvil no tiene links').toBeGreaterThan(0);

            for (let i = 0; i < count; i++) {
                const link = links.nth(i);
                const label = (await link.textContent())?.trim() || `link ${i}`;
                const height = await tapTargetHeight(link);
                expect(
                    height,
                    `El link "${label}" del menú móvil tiene un área táctil de ${height}px de alto.`
                ).toBeGreaterThanOrEqual(MIN);
            }
        }
    );
});
