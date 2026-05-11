# Estado actual — OpsPilot Web · Fase 0 Reconocimiento

**Fecha de captura:** 2026-05-11  
**Branch de origen:** `main` (5678933)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 + Vite 7 + TypeScript 5.9 |
| Routing | React Router DOM 7 |
| Estilos | CSS Modules por página + `variables.css` global |
| Animaciones | GSAP 3.15 (ScrollTrigger, timelines) |
| Efectos WebGL | OGL 1.0 (Aurora canvas) |
| Iconos | Lucide React 0.575 |
| Formularios | formsubmit.co (sin backend propio) |
| Deploy | GitHub Actions → hosting estático |

No hay Tailwind, no hay CSS-in-JS, no hay Framer Motion.

---

## Estructura de ficheros

```
src/
├── App.tsx                     # Router + lazy loading
├── index.css                   # Reset global + reveal animations
├── main.tsx
├── components/
│   ├── common/
│   │   ├── Aurora.tsx/css      # Efecto canvas OGL (hero background)
│   │   ├── AuroraCanvas.tsx
│   │   ├── Footer.tsx/css
│   │   ├── Logo.tsx
│   │   ├── Navbar.tsx/css
│   │   └── ScrollToTop.tsx
│   ├── layout/Layout.tsx/css
│   └── ui/Button.tsx/css
├── hooks/
│   ├── useCountUp.ts           # Animación de números con GSAP
│   ├── useMagnetic.ts
│   ├── usePageSEO.ts
│   ├── useScrollReveal.ts
│   └── useTilt.ts
├── lib/routes.ts               # Rutas canónicas + redirects legacy
├── pages/
│   ├── Home.tsx / Home.module.css
│   ├── Services.tsx / Services.module.css
│   ├── Cases.tsx / Cases.module.css
│   ├── Pricing.tsx / Pricing.module.css
│   ├── Resources.tsx / Resources.module.css
│   ├── Contact.tsx / Contact.module.css
│   ├── Soluciones.tsx / Soluciones.module.css
│   ├── Product.tsx / Product.module.css
│   └── NotFound.tsx
└── styles/
    ├── variables.css           # Design tokens (colores, tipografía, espaciado...)
    └── page-system.module.css  # Shared layout: pageHero, endCta, eyebrow, etc.
```

---

## Sitemap real (rutas activas)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Home | Landing principal |
| `/soluciones` | Soluciones | Por vertical: fiscal, energía, obra, agencias... |
| `/productos` | Product | Productos verticales (SaaS propio) |
| `/servicios` | Services | Servicios a medida |
| `/casos` | Cases | Casos de éxito ampliados |
| `/precios` | Pricing | Tabla de precios |
| `/recursos` | Resources | Blog / recursos |
| `/contacto` | Contact | Formulario + diagnóstico |

**Redirects legacy:** `/services`, `/cases`, `/pricing`, `/resources`, `/contact`, `/demo`, `/product` → rutas en español.

---

## Sistema de diseño actual

### Colores
- **Base:** `#0d141c` (bg-deep), `#111a23` (bg), `#18222e` (elevated), `#1f2a37` (raised)
- **Acento principal:** `#39ce86` (mint/verde)
- **Acento secundario:** `#d99457` (ámbar/warm)
- **Texto:** `#FFFFFF` (strong), `#E6EBF2`, `#8E9BAA` (muted), `#5d6878` (subtle)

### Tipografía
- **Display:** Space Grotesk (geometric)
- **Body:** Inter (functional)
- **Mono:** JetBrains Mono
- Escala: xs(12) → 7xl(88)

### Tokens destacables
- `--transition-slow: 480ms` ⚠️ **Viola la regla de 400ms máximo**
- Transiciones con `cubic-bezier(0.32, 0.72, 0, 1)` — buena elección
- Espaciado en múltiplos de 4
- Radii: sm(4px) → full(9999px)

---

## Inventario de secciones (Home)

1. **Hero** — Aurora canvas + texto centrado + rotador de palabras + CTA + trust list
2. **Marquee** — Banda con categorías de servicio animada (scroll lateral)
3. **Problem** — 3 pain points en grid horizontal con iconos Lucide
4. **Qué hacemos** — 6 cards 2×3 con icono + título + texto
5. **Método** — 4 pasos con icono circular + título + texto
6. **Casos de éxito** — Carrusel 3D con stats por caso
7. **CTA final** — Bloque centrado con fondo degradado animado

**Lo que falta vs. el plan:**
- ❌ No hay sección de **productos verticales** (fiscal, energía, obra, ERP) en home
- ❌ No hay **stats strip** (CSS existe en Home.module.css pero no se usa en JSX)
- ❌ No hay **terminal/demo visual** para los agentes IA
- ❌ No hay **badge/announcement** en hero
- ❌ Método usa iconos circulares, no **numeración tipográfica grande**

---

## Deuda visual detectada

| Problema | Severidad | Esfuerzo |
|---------|-----------|---------|
| `--transition-slow: 480ms` viola regla 400ms | Alta | Muy bajo |
| Method section: iconos genéricos, nada memorable | Alta | Medio |
| Build section: grid 2×3 uniforme = plantilla estándar | Alta | Medio |
| No stats strip pese a existir el CSS | Media | Bajo |
| No sección verticales en home → página `/soluciones` poco descubrible | Media | Medio |
| Hero sin announcement badge (todos los referentes lo tienen) | Media | Bajo |
| Sin `:focus-visible` bonito para links no-botón | Media | Bajo |
| No hay glow/glass tokens explícitos | Baja | Bajo |
| Footer sin guiño de marca | Baja | Bajo |
| Navbar con 7 items — demasiado denso | Baja | Medio |
