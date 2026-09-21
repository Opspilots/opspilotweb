/// <reference types="vite/client" />

declare module '*.svg' {
    const content: string;
    export default content;
}

/** Año del build, inyectado como literal por `define` en vite.config.ts.
 *  Ver el comentario de BUILD_YEAR en src/components/common/Footer.tsx. */
declare const __BUILD_YEAR__: number;
