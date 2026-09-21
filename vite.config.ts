import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // Año de build horneado como literal. El footer NO puede llamar a
  // `new Date().getFullYear()` durante el render: ese valor lo calcula el
  // prerender SSG el día del build y lo recalcula el navegador del visitante,
  // así que el 1 de enero siguiente el HTML estático ya desplegado dice un año
  // y el primer render de cliente dice otro → mismatch de hidratación en el
  // footer de TODAS las páginas. Con un `define`, el mismo literal viaja en el
  // HTML y en el bundle; el footer sube al año real en un useEffect, ya
  // después de hidratar.
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  // Salida SSG: un index.html por ruta dentro de su carpeta
  // (/soluciones -> /soluciones/index.html), no ficheros planos.
  ssgOptions: {
    dirStyle: 'nested',
  },
  build: {
    rollupOptions: {
      // manualChunks solo aplica al bundle de cliente. En el build SSR de
      // vite-react-ssg, react/react-dom/react-router-dom son externos y
      // rollup no permite incluir módulos externos en manualChunks.
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              icons: ['lucide-react'],
              // Librerías de animación en su propio chunk: gsap + lenis (efectos
              // de scroll/ambient, ahora diferidos a post-paint) y motion
              // (transiciones de página). Sacarlas del bundle `app` reduce el
              // JS crítico que compite con el primer paint.
              anim: ['gsap', 'lenis', 'motion'],
            },
          },
    },
  },
}))
