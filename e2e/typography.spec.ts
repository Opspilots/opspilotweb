import { test, expect } from '@playwright/test';
import { gotoStable } from './helpers';

/**
 * Tipografía responsive de los h1.
 *
 * Vigila que la escala móvil definida en `page-system.module.css` sea la que
 * realmente llega al navegador. El sistema de páginas es la fuente de verdad;
 * cuando el CSS de una página concreta la pisa sin quererlo, el h1 se dispara
 * y rompe el ritmo vertical en pantallas pequeñas.
 */
test.describe('Escala tipográfica móvil', () => {
    // El skip va a nivel de describe y lee `viewport` del fixture de opciones:
    // así se resuelve ANTES de lanzar navegador. Dentro del test tendríamos que
    // usar `page.viewportSize()`, lo que obliga a abrir el browser solo para
    // descartar el test.
    test.skip(
        ({ viewport }) => viewport?.width !== 375,
        'Aserción calibrada para el viewport de 375px.'
    );

    test(
        'el h1 de /soluciones mide ~30px a 375px',
        { tag: ['@critical', '@e2e', '@typography', '@TYPO-E2E-001'] },
        async ({ page }) => {
            await gotoStable(page, '/soluciones');

            const h1 = page.locator('h1');
            await expect(h1).toBeVisible();

            const fontSize = await h1.evaluate((el) =>
                parseFloat(getComputedStyle(el).fontSize)
            );

            /**
             * FALLA HOY — bug real, se arregla en fase 2. Mide 40px, esperamos ~30px.
             *
             * Causa: dos reglas de la MISMA especificidad (una clase) compiten
             * sobre el mismo h1, que lleva `sys.pageHeroTitle` + `styles.heroTitle`:
             *
             *   page-system.module.css @media (max-width: 767px):
             *     .pageHeroTitle { font-size: clamp(1.75rem, 8vw, 2.5rem) }  → 30px
             *   Soluciones.module.css (sin media query):
             *     .heroTitle      { font-size: clamp(2.5rem, 5vw, 4.5rem) }  → 40px
             *
             * A igual especificidad decide el orden de hoja. Soluciones.module.css
             * viaja en el chunk lazy de la ruta y se inyecta DESPUÉS de
             * page-system.module.css, así que gana — y el override de móvil del
             * sistema queda muerto. Que el override viva en una @media no le da
             * prioridad: las media queries no suman especificidad.
             *
             * Por eso este test corre sobre el build (ver playwright.config.ts):
             * en `dev` el orden de inyección es otro y el bug no se reproduce igual.
             */
            expect(
                fontSize,
                `El h1 de /soluciones mide ${fontSize}px a 375px; la escala móvil del sistema pide ~30px.`
            ).toBeLessThanOrEqual(32);
        }
    );
});
