import { test, expect } from '@playwright/test';
import { gotoStable } from './helpers';

/**
 * Escala tipográfica — invariantes del sistema, no valores mágicos.
 *
 * El h1 de TODAS las páginas sale de un único token (`--font-size-h1` en
 * src/styles/variables.css) y ninguna página declara su propio clamp. Estos
 * tests vigilan las dos propiedades que ese diseño garantiza y que el CSS
 * anterior rompía:
 *
 *   1. CONSISTENCIA — a un mismo viewport, el h1 mide lo mismo en todas las
 *      rutas. Antes no: `sys.pageHeroTitle` y el `.heroTitle` de cada página
 *      eran dos reglas de la MISMA especificidad compitiendo por el mismo
 *      nodo, así que quién ganaba dependía del orden en que se inyectara el
 *      chunk lazy de la ruta — un accidente de bundling, no una regla.
 *
 *   2. MONOTONÍA — el h1 nunca ENCOGE al crecer el viewport. Antes sí: el
 *      hero del home se pintaba a 48px a 414px y bajaba a 44px a 768px,
 *      porque el tramo de teléfono y el de tablet eran dos clamp()
 *      independientes que no se encontraban en el breakpoint.
 *
 * Por eso corren sobre el build (ver playwright.config.ts): en `dev` el orden
 * de inyección de las hojas es otro y el fallo de consistencia no se
 * reproduce igual.
 */

const ROUTES_WITH_H1 = ['/', '/soluciones', '/casos', '/recursos', '/contacto'];

async function h1FontSize(page: import('@playwright/test').Page, route: string) {
    await gotoStable(page, route);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    return h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
}

test.describe('Escala tipográfica', () => {
    test(
        'el h1 mide lo mismo en las 5 páginas al mismo viewport',
        { tag: ['@critical', '@e2e', '@typography', '@TYPO-E2E-001'] },
        async ({ page }) => {
            const sizes: Record<string, number> = {};
            for (const route of ROUTES_WITH_H1) {
                sizes[route] = await h1FontSize(page, route);
            }

            const unique = [...new Set(Object.values(sizes).map((n) => Math.round(n)))];
            expect(
                unique,
                `El h1 debería salir del mismo token en todas las rutas. Medido: ${JSON.stringify(sizes)}`
            ).toHaveLength(1);
        }
    );

    test(
        'el h1 nunca encoge al ensanchar el viewport',
        { tag: ['@critical', '@e2e', '@typography', '@TYPO-E2E-002'] },
        async ({ page }) => {
            // 414 y 768 son los dos anchos donde estaba el salto real
            // (48px -> 44px). 360 y 1280 cubren los extremos del rango.
            const widths = [360, 414, 768, 1280];
            const measured: Array<{ width: number; size: number }> = [];

            for (const width of widths) {
                await page.setViewportSize({ width, height: 900 });
                measured.push({ width, size: await h1FontSize(page, '/') });
            }

            for (let i = 1; i < measured.length; i++) {
                expect(
                    measured[i].size,
                    `El h1 baja de ${measured[i - 1].size}px a ${measured[i - 1].width}px ` +
                        `hasta ${measured[i].size}px a ${measured[i].width}px. ` +
                        `Serie completa: ${JSON.stringify(measured)}`
                ).toBeGreaterThanOrEqual(measured[i - 1].size);
            }
        }
    );

    test(
        'los titulares cargan un peso real, no el peso del cuerpo',
        { tag: ['@e2e', '@typography', '@TYPO-E2E-003'] },
        async ({ page }) => {
            await gotoStable(page, '/');
            const weight = await page
                .locator('h1')
                .first()
                .evaluate((el) => parseInt(getComputedStyle(el).fontWeight, 10));

            expect(
                weight,
                `El h1 se pinta a font-weight ${weight}; la escala canónica pide 700.`
            ).toBe(700);
        }
    );
});
