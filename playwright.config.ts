import { defineConfig, devices } from '@playwright/test';

/**
 * QA visual móvil — red de seguridad para el refactor del formato móvil.
 *
 * ─── Por qué `preview` del build y no `dev` ───
 * El proyecto es SSG (vite-react-ssg). Dos de los bugs que esta suite vigila
 * solo existen en el artefacto de producción:
 *
 *   1. El orden de inyección de las hojas CSS. En `dev`, Vite inyecta cada
 *      CSS Module vía JS en el orden en que se importa el módulo; en el build
 *      son <link> emitidos por Rollup, con un orden distinto. El bug del h1 de
 *      /soluciones (chunk lazy que pisa a page-system por orden de hoja) NO se
 *      reproduce igual en dev.
 *   2. El HTML prerenderizado. `dev` sirve una shell SPA vacía que se hidrata;
 *      `preview` sirve el mismo HTML estático que ve el usuario (y Google).
 *
 * Testear `dev` daría una red que no cubre lo que se despliega. El coste es el
 * build (~95 s); se amortiza con `reuseExistingServer` en local.
 *
 * ─── Artefactos ───
 * Nada cae en la raíz del repo: los artefactos efímeros viven en
 * `e2e/.artifacts/` (gitignorado) y los baselines en `e2e/__screenshots__/`
 * (versionados — ver la excepción añadida a .gitignore, que por defecto ignora
 * todos los *.png del repo).
 */
export default defineConfig({
    testDir: './e2e',

    // Artefactos efímeros (trazas, diffs, videos) fuera de la raíz del repo.
    outputDir: './e2e/.artifacts/test-results',
    // Baselines de screenshot: versionados, para que la comparación
    // antes/después del refactor sea compartible y no solo local.
    snapshotDir: './e2e/__screenshots__',
    // Un baseline por viewport, sin sufijo de SO: la suite es determinista
    // gracias a reducedMotion + animations:'disabled', y así el nombre del
    // fichero no depende de la máquina que lo generó.
    snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}-{projectName}{ext}',

    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,

    reporter: [
        ['list'],
        ['html', { outputFolder: './e2e/.artifacts/playwright-report', open: 'never' }],
    ],

    use: {
        baseURL: 'http://localhost:4173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        /**
         * Determinismo. La app respeta `prefers-reduced-motion` en todos sus
         * sistemas de animación (useScrollReveal, useHeroReveal, motion/react):
         * con `reduce`, los reveals aplican `.revealed` al instante en vez de
         * esperar a que ScrollTrigger los dispare al entrar en viewport. Sin
         * esto, un screenshot full-page capturaría tarjetas en opacity:0.
         */
        reducedMotion: 'reduce',
    },

    expect: {
        toHaveScreenshot: {
            // Congela animaciones CSS/Web Animations y las lleva a su estado final.
            animations: 'disabled',
            // Oculta el caret de texto, que parpadea y rompe la comparación.
            caret: 'hide',
            // Margen para el antialiasing de fuentes entre ejecuciones.
            maxDiffPixelRatio: 0.01,
        },
    },

    /**
     * Viewports. Los descriptores de Playwright traen el viewport *útil* del
     * navegador (iPhone SE = 320x568, iPhone 14 = 390x664), no el tamaño lógico
     * de pantalla que se usa como referencia de diseño. Tomamos del descriptor
     * lo que sí queremos (userAgent, deviceScaleFactor, isMobile, hasTouch) y
     * fijamos el viewport exacto que nos interesa vigilar.
     *
     * `browserName: 'chromium'` va DESPUÉS del spread a propósito: los
     * descriptores de iPhone/iPad traen `defaultBrowserType: 'webkit'` y sin
     * este override la suite intentaría lanzar WebKit. Empezamos solo con
     * chromium; añadir webkit es un `npx playwright install webkit` y quitar
     * esta línea (recomendable más adelante — Safari iOS es el navegador real
     * de estos viewports).
     */
    projects: [
        {
            name: 'iphone-se-375',
            use: {
                ...devices['iPhone SE'],
                browserName: 'chromium',
                viewport: { width: 375, height: 667 },
            },
        },
        {
            name: 'iphone-14-390',
            use: {
                ...devices['iPhone 14'],
                browserName: 'chromium',
                viewport: { width: 390, height: 844 },
            },
        },
        {
            name: 'iphone-15-pro-max-430',
            use: {
                ...devices['iPhone 15 Pro Max'],
                browserName: 'chromium',
                viewport: { width: 430, height: 932 },
            },
        },
        {
            // 768 es exactamente el breakpoint del menú desktop (min-width: 768px):
            // aquí la hamburguesa ya NO se muestra. Los tests de navbar móvil se
            // saltan este proyecto a propósito.
            name: 'ipad-mini-768',
            use: {
                ...devices['iPad Mini'],
                browserName: 'chromium',
                viewport: { width: 768, height: 1024 },
            },
        },
    ],

    webServer: {
        // Build + preview: `vite preview` sirve `dist/`, así que sin build previo
        // se testearía un artefacto viejo. El build es la única forma de que el
        // orden real de las hojas CSS llegue al navegador.
        command: 'npm run build && npm run preview -- --port 4173 --strictPort',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});
