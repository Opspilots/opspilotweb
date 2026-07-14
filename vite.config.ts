import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
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
