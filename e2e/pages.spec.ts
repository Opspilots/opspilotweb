import { test, expect } from '@playwright/test';
import { ROUTES, gotoStable, scrollThroughPage, measureOverflow } from './helpers';

/**
 * Cobertura base de las 5 rutas públicas en los 4 viewports del config.
 *
 * Dos garantías por ruta/viewport:
 *   1. Baseline visual full-page — detecta regresiones no intencionadas.
 *   2. Ausencia de scroll horizontal — el riesgo real del formato actual
 *      (5 carruseles con margin-right negativo, blobs en `vw` con offsets
 *      negativos). Un desbordamiento en móvil se nota al instante y es fácil
 *      de introducir sin querer.
 */
for (const route of ROUTES) {
    test.describe(`Ruta ${route.path}`, () => {
        test(
            `sin overflow horizontal en ${route.path}`,
            { tag: ['@critical', '@e2e', '@layout'] },
            async ({ page }) => {
                await gotoStable(page, route.path);
                // Medimos DESPUÉS del barrido: hay elementos que solo entran en
                // juego al revelarse, y podrían desbordar aunque el top no lo haga.
                await scrollThroughPage(page);

                const { scrollWidth, innerWidth, offenders } = await measureOverflow(page);

                expect(
                    scrollWidth,
                    offenders.length
                        ? `Scroll horizontal en ${route.path}. Elementos que se salen:\n  - ${offenders.join('\n  - ')}`
                        : `Scroll horizontal en ${route.path} (${scrollWidth}px > ${innerWidth}px) sin elemento identificable — sospecha de margin/transform en un pseudo-elemento.`
                ).toBeLessThanOrEqual(innerWidth);
            }
        );

        test(
            `baseline visual de ${route.path}`,
            { tag: ['@e2e', '@visual'] },
            async ({ page }) => {
                await gotoStable(page, route.path);
                await scrollThroughPage(page);

                await expect(page).toHaveScreenshot(`${route.name}.png`, {
                    fullPage: true,
                });
            }
        );
    });
}
