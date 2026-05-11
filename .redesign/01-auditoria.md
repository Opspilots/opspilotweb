# Auditoría visual — OpsPilot Web · Fase 1

**Alcance:** Home + páginas secundarias  
**Referencias:** Linear, Vercel, Cursor, Raycast, Mintlify, Arc, Resend

---

## Jerarquía visual

### 🔴 Alta
- **Method section** (pasos): Los iconos circulares idénticos no crean jerarquía. El ojo no sabe dónde mirar primero. Linear y similares usan numeración tipográfica gigante (01, 02...) que convierte el número en un recurso decorativo con peso visual propio.
- **Build section**: 6 cards 2×3 absolutamente uniformes. Cualquier plantilla de Tailwind UI se ve igual. No hay protagonismo, no hay drama, no hay variación de escala.

### 🟡 Media
- **Hero headline**: Tamaño correcto (`clamp(2rem, 4.5vw, 3.75rem)`) pero podría ganar 0.5–1rem para más impacto en desktop (apuntar a 4.25–4.5rem max).
- **Problem section**: Las 3 columnas son iguales en peso. Quién grita, quién susurra — no hay distinción. En el referente Linear, los pain points son titulares editoriales, no tarjetas con iconos.
- **Stats strip**: CSS escrito pero sin usar. Oportunidad de credibilidad perdida — los números impactan más que las palabras.
- **No vertical products en home**: La navegación a `/soluciones` no está señalada visualmente. Usuarios que solo ven la home no saben qué verticales existen.

### 🟢 Baja
- Marquee: funcional y limpio.
- Cases carousel: distinción real, visualmente memorable.
- CTA final: el bloque con gradiente animado es bueno.

---

## Tipografía

| Dimensión | Estado | Hallazgo |
|-----------|--------|---------|
| Escala | ✅ Correcta | `clamp()` bien usado en headings |
| Hero max | ⚠️ Mejorable | 3.75rem max — puede llegar a 4.5rem |
| Line-height | ✅ | h1 1.05 es correcto para display |
| Tracking | ✅ | `--tracking-display: -0.035em` apropiado |
| Pareja | ✅ | Space Grotesk + Inter es sólida |
| Mono | ✅ | JetBrains Mono disponible pero poco visible |
| Numeric | ✅ | `font-variant-numeric: tabular-nums` en body |

---

## Color

| Dimensión | Estado | Hallazgo |
|-----------|--------|---------|
| Paleta base | ✅ | Navy oscuro distinctive |
| Acento mint | ✅ | `#39ce86` distintivo, no genérico |
| Acento warm | ⚠️ | `#d99457` definido pero raramente usado |
| Contraste WCAG AA | ✅ | Texto/fondo supera 4.5:1 |
| Glass/glow | ❌ | No hay tokens explícitos de glassmorfismo |
| Gradientes | ⚠️ | Solo en rotador y stats — podría expandirse |

---

## Espaciado y ritmo vertical

- ✅ Múltiplos de 4 consistentes
- ✅ `--space-section-*` bien definidos (tight/default/loose)
- ⚠️ El salto hero → marquee → problem → build es plano: todas las secciones tienen el mismo fondo y padding. Falta alternancia claro/oscuro o variación de densidad para "respirar" entre secciones.

---

## Componentes

| Componente | Estado | Hallazgo |
|-----------|--------|---------|
| Button primary | ✅ | Mint sólido, hover correcto |
| Button primary hover | ⚠️ | No hay glow sutil en hover — todos los refs lo tienen |
| Button sizes | ✅ | sm/md/lg correctos |
| Cards (problem/build) | ⚠️ | Uniformes, sin variedad |
| Eyebrow chip | ✅ | Mint soft + border — limpio |
| Navbar | ⚠️ | 7 items visibles — sobrecarga cognitiva |
| Footer | ⚠️ | Funcional pero sin personalidad |
| Focus states | ❌ | Solo Button tiene focus-visible; links y otros elementos no |

---

## Copy y microcopy

| Elemento | Estado | Hallazgo |
|---------|--------|---------|
| Hero headline | ✅ | "Construimos software a medida para [vertical]" — directo |
| Hero subtitle | ⚠️ | 2 frases largas — la segunda ("no las que te quieren vender") es buena pero queda enterrada |
| CTAs | ✅ | "Reservar diagnóstico" honesto y específico |
| Trust list | ⚠️ | 3 bullets OK, falta "Equipo en España" como prueba de cercanía |
| Problem titles | ✅ | Conversacionales y específicos |
| Method steps | ✅ | Verbos en primera persona, concretos |
| Casos stats | ✅ | Números reales y específicos (3×, -70%, etc.) |

---

## Responsive y breakpoints

- ✅ Breakpoints en 768px, 1024px, 1280px
- ✅ Hero responsive con `clamp()`
- ⚠️ Mobile: case carousel oculta las tarjetas prev/next con `opacity: 0` → OK funcionalmente, pero el usuario no sabe que hay más
- ⚠️ Method section en mobile: 4 columnas → 1 columna, gap demasiado grande

---

## Accesibilidad

| Dimensión | Estado | Hallazgo |
|-----------|--------|---------|
| Semántica HTML | ✅ | `<section>`, `<article>`, `<header>`, `<aside>`, `<nav>` usados |
| ARIA labels | ✅ | `aria-label` en marquee, trust list, carrusel |
| `aria-hidden` | ✅ | Decorativos marcados correctamente |
| `prefers-reduced-motion` | ✅ | Respetado en GSAP y marquee |
| `:focus-visible` | ⚠️ | Solo en Button. Links, inputs y nav sin estilos |
| Skip link | ❌ | No hay "saltar al contenido" |
| Color solo como info | ✅ | Texto siempre acompaña al color |

---

## Performance percibida

| Dimensión | Estado | Hallazgo |
|-----------|--------|---------|
| LCP (hero text) | ✅ | Texto, sin imagen grande |
| Fuentes | ⚠️ | Space Grotesk e Inter cargadas desde Google Fonts (asumiendo CDN) — no hay `font-display: swap` visible en el HTML |
| Aurora canvas | ⚠️ | WebGL OGL — puede ser costoso en móvil |
| `--transition-slow: 480ms` | ❌ | **Viola la regla de 400ms**. Afecta a componentes que lo usen |
| Lazy loading de páginas | ✅ | Implementado con React.lazy en App.tsx |
| Animaciones GSAP | ✅ | Con `prefers-reduced-motion` guard |

---

## Prioridades de acción (por impacto visual/esfuerzo)

1. **[Alta/Muy bajo]** Corregir `--transition-slow` a ≤380ms
2. **[Alta/Muy bajo]** Añadir `:focus-visible` global para links y elementos interactivos
3. **[Alta/Bajo]** Añadir stats strip en Home (CSS ya existe)
4. **[Alta/Medio]** Redesign Method section con números tipográficos grandes
5. **[Alta/Medio]** Añadir sección verticales en Home (4 sector cards)
6. **[Alta/Medio]** Redesign Build section con bento grid + terminal IA
7. **[Media/Bajo]** Badge announcement en hero + pequeño aumento de headline
8. **[Media/Bajo]** Glow sutil en hover del Button primary
9. **[Media/Bajo]** Polish Footer
10. **[Baja/Medio]** Simplificar Navbar (7 → 5 items en desktop)
