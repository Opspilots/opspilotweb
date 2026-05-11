# Sistema de diseño — OpsPilot v2 · Fase 2

El sistema de tokens ya existe en `src/styles/variables.css`. Este documento recoge las **adiciones y correcciones** que se hacen en el redesign.

---

## Cambios en tokens existentes

| Token | Valor anterior | Valor nuevo | Motivo |
|-------|---------------|------------|--------|
| `--transition-slow` | `480ms` | `380ms` | Viola la regla de 400ms máximo |

---

## Tokens nuevos añadidos

### Glass y glow
```css
--glow-mint:         0 0 32px rgba(57, 206, 134, 0.25);
--glow-mint-sm:      0 0 12px rgba(57, 206, 134, 0.18);
--glow-mint-lg:      0 0 60px rgba(57, 206, 134, 0.22);
--glass-bg:          rgba(255, 255, 255, 0.03);
--glass-border:      rgba(255, 255, 255, 0.08);
```

### Gradientes display
```css
--gradient-mint-text: linear-gradient(135deg, #6fe2a8 0%, #39ce86 55%, #2bb874 100%);
--gradient-hero:      radial-gradient(ellipse 80% 50% at 50% -10%,
                        rgba(57, 206, 134, 0.18) 0%, transparent 70%);
```

---

## Paleta — sin cambios de fondo

La paleta dark navy + mint se mantiene. No se introduce modo claro en esta iteración (marca muy dark-native).

Los 4 fondos de superficie (`bg-deep` → `bg-raised`) crean profundidad suficiente para cards anidadas.

El **ámbar** (`--color-warm`) se usará más activamente: 
- Cards de "Energía" (vertical product)
- Labels de estado "warning"

---

## Tipografía — sin cambio de fuentes

**Space Grotesk + Inter + JetBrains Mono** se mantienen.

El hero pasará de `clamp(2rem, 4.5vw, 3.75rem)` a `clamp(2.25rem, 5vw, 4.5rem)` para más impacto en desktop.

---

## Easing y duración

| Token | Valor | Uso |
|-------|-------|-----|
| `--transition-fast` | `160ms cubic-bezier(0.32, 0.72, 0, 1)` | Hover de color, border |
| `--transition-normal` | `280ms cubic-bezier(0.32, 0.72, 0, 1)` | Hover con transform |
| `--transition-slow` | `380ms cubic-bezier(0.32, 0.72, 0, 1)` | Modales, overlays (**corregido**) |

Nuevas constantes de easing (solo en CSS donde se necesita):
- Entrada: `cubic-bezier(0.16, 1, 0.3, 1)` — spring out, para scroll reveals
- Bounce: `cubic-bezier(0.22, 1, 0.36, 1)` — micro-interacciones

---

## Focus visible — nuevo estándar

Todos los elementos interactivos (`a`, `button`, `input`, `select`, `textarea`) tendrán:

```css
:focus-visible {
    outline: 2px solid var(--color-mint);
    outline-offset: 3px;
    border-radius: var(--radius-sm);
}
```

Los inputs del formulario en `:focus` tendrán `border-color: var(--color-mint)` + `box-shadow: 0 0 0 3px rgba(57,206,134,0.15)`.

---

## Grid de página

- **Max-width contenedor:** 1280px (sin cambio)
- **Padding lateral:** `var(--spacing-7)` mobile / `var(--spacing-10)` desktop (sin cambio)
- **Gutter interno de secciones:** `gap` de 1px sobre fondo `var(--color-border-subtle)` para el bento grid

---

## Componentes

### Button primary — mejora hover
Se añade glow sutil en hover:
```css
.primary:hover {
    box-shadow: 0 0 20px rgba(57, 206, 134, 0.22);
}
```

### Vertical card — nuevo
- Fondo: `var(--color-bg-elevated)`
- Border: `1px solid var(--color-border-subtle)`
- Hover: `translateY(-2px)` + border-color → `var(--color-border-strong)` + glow del color del vertical
- Radii: `var(--radius-2xl)`

### Stats strip — activar
- Ya tiene CSS en `Home.module.css`
- Añadir JSX con los 4 stats y hook `useCountUp`

### Terminal demo — nuevo
- Fondo mono-spaced con Mac-style dots
- Lines que se escriben con CSS `animation-delay`
- Sin librería externa

### Method step — rediseño
- Número grande: `font-family: mono`, `font-size: clamp(4rem, 8vw, 6.5rem)`, color: `rgba(255,255,255,0.05)` como decorativo
- Step número visible: encima del número decorativo, en `var(--color-mint)`, 0.75rem
- Título y texto como siempre debajo

---

## Qué NO cambia

- Stack de fuentes
- Paleta de colores base
- Sistema de tokens de spacing
- Radii, shadows existentes
- Breakpoints
- El carrusel de casos (ya es distintivo)
- El endCta block (ya tiene buena estética)
