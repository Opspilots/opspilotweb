# opspilot.es · construcción y despliegue (Astro, desde el 25-sep-2026)

> La web de marketing pasó de React (vite-react-ssg) a **HTML estático con Astro** en la rama
> `feat/web-horizonte`. La versión React queda en el historial de git. Lo que sigue a esta sección
> («Guía de despliegue en Hostinger» y «Despliegue en Nginx») es la guía anterior: la parte de nginx
> sigue valiendo; la parte de React/Vite/Hostinger ya no.

## Construir y revisar

```bash
npm ci
npm run build      # genera dist/: una carpeta con index.html por ruta, CON barra final
npm run check      # revisa dist/: enlaces rotos, title ≤ 60, description ≤ 155, un h1, canonical, JSON-LD, títulos únicos
```

Construcción de revisión que no se indexa: `PUBLIC_NOINDEX=1 npm run build`.

## Despliegue

Igual que antes: `.github/workflows/deploy.yml` construye en cada push a `main` y sube `dist/` por
rsync a `/var/www/opspilotweb/dist/` (nginx, VPS). **Mergear a main = publicar.**

## nginx: qué tiene y qué hay que añadir (ver Reenfoque)

La configuración de opspilot.es ya tenía (revisada en solo lectura el 25-sep) casi todo lo necesario y la web nueva se adapta a ella.
Lo que falta son las redirecciones del reenfoque, el bloqueo de ficheros ocultos y el cambio de `/product`: están en un ÚNICO bloque
copiable, en «Despliegue en Nginx (VPS)» más abajo. Lo que ya hay:
- `error_page 404 /404/index.html` + `try_files $uri $uri/ =404`: `scripts/postbuild.mjs` copia
  `dist/404.html` a `dist/404/index.html`.
- 301 de /services, /servicios, /contact, /demo, /diagnostico, /pricing y /precios → /contacto/;
  /resources y /product → /recursos/ (medido en producción el 11-nov-2026; /cases → /casos/ ya no sirve, ver «Reenfoque»).
  Las redirecciones de `astro.config.mjs` apuntan al mismo sitio, pero son páginas con meta refresh, NO un 301: el 301
  real solo existe si está en nginx (ver «Reenfoque»).
- La CSP está en enforce en producción (cabecera `Content-Security-Policy`, comprobado el 11-nov-2026).
- `.css`/`.js` con `Cache-Control: public, immutable` 30 días: como estos ficheros no llevan hash en
  el nombre, se les añade `?v=<hash del contenido>` con `version()` de `src/lib/version.ts`: lo usan
  `src/layouts/Base.astro` (`opspilot.css` y `opspilot.js`), `CabeceraMesa.astro` (`lamesa.css` y `lamesa.js`), `CabeceraPagina.astro`
  (`cabecera-pagina.css`), `Problemas.astro` (`problemas.css` y `problemas.js`);
  un `.css`/`.js` nuevo que se cargue con `<link>` o `<script>` tiene que pasar por esa función. **Ojo con fuentes e
  imágenes**: también son inmutables; si se cambia una, cambiar su NOMBRE, no sobrescribirla.
- `.html` sin caché: cada despliegue se ve al momento.

## Reenfoque (11-nov-2026): páginas retiradas y redirecciones

La web pasa a explicar «digitalización y webs para negocios»: menú Webs · Soluciones · Herramientas · Contacto. Páginas retiradas
y su destino (las mismas reglas están en `astro.config.mjs` y en `public/.htaccess`):

| Antes | Ahora |
|---|---|
| /productos/, /productos/erp-hosteleria/, /productos/presupuesya/ | /soluciones/ |
| /casos/, /cases/ | / |
| /soluciones/webs-y-tiendas/, /diseno-web-cordoba/ | /webs/ |
| /soluciones/software-a-medida/, /soluciones/automatizacion/, /desarrollo-software-cordoba/ | /soluciones/ |
| cuatro guías de producto de /recursos/ y los casos «ilustrativos» de octubre | /soluciones/ (la de leads, a su guía) |
| /herramientas/cuanto-cuesta-una-pagina-web/ | /webs/ |

**Cómo se sirven.** `astro.config.mjs` (`redirects`) genera, por cada una, una página estática con `<meta http-equiv="refresh">` y
canonical al destino: sirve como red de seguridad, pero **no es un 301** y no traspasa la autoridad SEO. `public/.htaccess` tiene los
301 equivalentes, pero producción usa nginx y lo ignora. **El 301 real exige editar el `server {}` de opspilot.es en nginx** (no está
en el repo; hay que hacerlo a mano, con copia de seguridad y `sudo nginx -t` antes de recargar). Hay UN solo bloque, el de
«Despliegue en Nginx (VPS)» más abajo: las reglas van como `rewrite` a nivel de `server`, con destino absoluto y ANTES del `rewrite` de la
barra final, y sustituyen a las `location` antiguas (`/cases` → `/casos/`, `/product` → `/productos/`, etc.): hay que borrar esas
`location`, no dejarlas junto a las nuevas. Los tres sitios (`astro.config.mjs`, `public/.htaccess` y ese bloque) deben tener las mismas
reglas: si cambias una, cambia las otras dos.

Con nginx sin tocar, esas URLs siguen devolviendo 200 con la página de redirección de Astro (meta refresh), no un 301 ni un 404.
La comprobación tras recargar está en «Verificación de redirects».

## Dónde está cada cosa

- `src/pages/`: una página por ruta. Menú: /webs/, /soluciones/, /herramientas/ y /contacto/ (con las 9 herramientas en
  `src/pages/herramientas/` y `src/data/herramientas.ts`). Además: la home, /recursos/ (guías, fuera del menú) y las legales.
  `/webs/` y `/soluciones/` reúnen lo que antes eran siete páginas (ver «Reenfoque»).
- `src/data/herramientas.ts`, `src/lib/resources.ts` y `src/lib/company.ts`: el contenido de las herramientas, las guías y la empresa.
- `public/css/opspilot.css`: el sistema visual «horizonte artificial».
- Cabecera de la home, «La mesa»: `src/components/CabeceraMesa.astro`, el dibujo se genera en la construcción en
  `src/lib/mesa.ts`, y solo la home carga `public/css/lamesa.css` y `public/js/lamesa.js` (los dos con `?v=`
  por `version()`). De arriba abajo: la tabla del titular, la mesa y, debajo, el tablón que la cierra (`.lm-pie`: servicios,
  promesa y botones de contacto). No hay mando, arrastre ni enlace «Ver lo que hemos hecho»: la mesa llega revuelta y se recoge
  sola, una vez, cuando se ve (con el gesto final de la marca). En escritorio (≥ 1000 px) la altura de la mesa sale de `svh`
  (lo que deja la ventana tras el titular y el tablón) sin que el dibujo baje de 1020 px de ancho; entre 1000 y 1019 px ocupa
  todo el ancho y la letra queda en 12,0-12,2 px. Si no cabe en alto, el dibujo se recorta por abajo (el teclado del portátil),
  no se encoge. Sin imágenes ni fuentes nuevas: la madera es un patrón SVG dentro del HTML (como imagen de fondo se llevaría
  el LCP). La promesa «Desde 500 € · Respuesta en menos de 24 h» es un bloque suelto, marcado con un comentario en el
  componente, para quitarlo si el dueño decide no mostrarla. Si se quita, hay que revisar también la `description` de
  `src/pages/index.astro` (línea 13), que repite «precio cerrado desde 500 €» y «respuesta en menos de 24 h». Si `lamesa.js`
  no carga o falla al arrancar, la mesa se queda recogida (clase `sin-script`).
- «Cuatro cosas que vemos cada semana» (`src/components/Problemas.astro`, solo en la home).
  Con JS la sección es interactiva y se ve como siempre: lista 01-04 a la izquierda y ventana a la derecha (en móvil, pestañas
  fijas y un problema cada vez). Si hay movimiento permitido y alto suficiente, además se queda fija: el bloque (`.pb-escena`)
  es `position:sticky` dentro de una pista alta (`.pb-pista`, en `svh`: la ventana más 4 pasos de 90 svh) y el scroll nativo
  va cambiando el activo del 1 al 4 (`public/js/problemas.js` solo lee cuánto se ha avanzado por la pista: un
  `requestAnimationFrame` por scroll pasivo; sin `wheel`, `touch` ni `preventDefault`; ningún temporizador). Estilos en
  `public/css/problemas.css` (los de cada réplica siguen en `opspilot.css`); los dos ficheros con `?v=` por `version()`.
  El modo lo decide un script en línea al final del componente, antes del primer pintado: usa la svh PEQUEÑA (una sonda de
  `100svh`), nunca la altura que sigue a la barra del navegador, la fuente raíz y el ancho útil (sin barra de desplazamiento)
  dividido por esa fuente. Solo se recalcula al cambiar el ancho, la svh, la fuente raíz (un `ResizeObserver` sobre una sonda de
  `1rem` lo detecta aunque no haya `resize`) o «reducir movimiento»; al hacerlo se conserva lo que se veía (el problema, si se
  estaba dentro de la pista; lo que había en pantalla, si se estaba debajo). Sin `svh` o con «reducir movimiento» no hay pin: se ve
  de uno en uno, como siempre. Los umbrales (alto de ventana a 16 px de fuente, medidos con el contenido de la escena más la
  cabecera, tabla `UM` del script en línea; las bandas de ancho son en rem × 16):
  - Escritorio (≥ 768 px): nivel 0, el tamaño de siempre, desde 705 px de alto (≥ 1280 px de ancho), 770 px (1024-1279) o 908 px
    (768-1023); nivel 1, más compacto (menos aire y letra algo menor), desde 541, 551 o 648 px. En escritorio las réplicas llevan
    los tamaños de letra de siempre (algunos bajan de 12 px, como en el resto del sitio).
  - Móvil (≥ 360 px): nivel 0 desde 862-888 px; nivel 1 (menos aire) desde 729-774 px; nivel 2 (además, el párrafo del problema
    solo a la vista del lector de pantalla) desde 668-687 px; nivel 3 (además, la nota de la réplica) desde 602-621 px. Aquí las
    réplicas no bajan de 12 px y no se recortan.
  - Por debajo de todo, o con «reducir movimiento»: un problema cada vez y sin pin. Los cuatro apilados quedan solo para sin JS
    y para el script fallido o colgado: si `problemas.js` no ha arrancado a los 4 s, se retira todo (clase `sin-pin`) y los
    cuatro problemas se leen apilados y completos, con las dos caras y las dos notas.
  Las anclas `#p-google`, `#p-sitios`, `#p-excel` y `#p-pestanas` (y los `#w-…` de cada réplica) llevan al apartado. Si vienen en la
  URL al cargar, el script en línea las guarda y las quita de la URL mientras carga (para que el salto nativo al fragmento no
  pise el de `problemas.js`), y `problemas.js` salta de golpe y las devuelve a la URL; al recargar o volver con Atrás se respeta el
  scroll que restaura el navegador. Solo al hacer clic en un enlace a un problema hay entrada nueva en el historial (si no se está
  ya en ese ancla) y foco en la pestaña o el título.
  El configurador de la home señala el problema que más se parece (evento `opspilot:ruta`, marca «para ti» y un aviso bajo su
  formulario con el enlace); no lo activa, para no cambiar el alto de lo que hay encima.
- Plausible (`src/layouts/Base.astro`) se carga con `async`, no con `defer`: un `defer` colgado bloquearía `lamesa.js`,
  `problemas.js` y `opspilot.js`, que van detrás en el orden de los scripts diferidos.
- Cabeceras de las subpáginas (5-nov-2026): `src/components/CabeceraPagina.astro` pinta la misma tira de madera que la home con
  UN objeto de la mesa a la derecha (debajo del texto en móvil). Qué objeto lleva cada ruta está en la tabla `OBJETO_POR_RUTA`
  de `src/lib/objetos-pagina.ts` (las guías `/recursos/<slug>/` entran por prefijo); una ruta que no esté en la tabla rompe la
  construcción, y el prop `objeto` de `CabeceraPagina` la salta. `ninguno` = solo la tira; `aro` = el aro grande de antes (solo la
  404, que sigue usando `.instrumento`, `.giro` y `.suelo` de `opspilot.css`; `Cierre.astro` conserva su aro con `.giro` y `.suelo`).
  El dibujo se genera en la construcción (reutiliza lo exportado de `src/lib/mesa.ts`) y los estilos están en
  `public/css/cabecera-pagina.css` (con `?v=` por `version()`). Sin JS: el único gesto es una animación CSS de una vez.

## Pendiente del negocio (bloquea las páginas legales)

`src/lib/company.ts` tiene vacíos LEGAL_NAME, TAX_ID y ADDRESS.street/postalCode. Mientras lo estén,
/aviso-legal/, /privacidad/ y /cookies/ se publican con los huecos marcados, en noindex y fuera del
sitemap, y la construcción lo avisa. Al rellenarlos se completan e indexan solas.

---

# Guía de Despliegue en Hostinger

Esta aplicación es una Single Page Application (SPA) construida con React y Vite. Para desplegarla en Hostinger (o cualquier hosting compartido Apache), sigue estos pasos:

## 1. Preparación

Asegúrate de tener todas las dependencias instaladas:
```bash
npm install
```

## 2. Construcción (Build)

Ejecuta el comando de construcción para generar los archivos estáticos optimizados para producción:

```bash
npm run build
```

Este comando:
1. Verificará que no haya errores de TypeScript.
2. Generará una carpeta `dist` en la raíz de tu proyecto.

## 3. Subida de Archivos

1. **Accede a tu panel de Hostinger** (hPanel) y ve al **Administrador de Archivos**.
2. Navega a la carpeta `public_html`.
3. Borra cualquier archivo por defecto que pueda haber (como `default.php`).
4. **Sube el CONTENIDO de la carpeta `dist`** (no la carpeta `dist` en sí, sino lo que hay dentro) a `public_html`.
   - Deberías ver `index.html`, `assets/`, y otros archivos directamente en `public_html`.

## 4. Configuración de Rutas (.htaccess) — SOLO si sirves desde Apache

> ⚠️ **Producción NO usa este fichero.** opspilot.es se sirve desde un VPS con Nginx
> (verificado el 2026-07-26: `server: nginx`), y Nginx ignora `.htaccess` por completo.
> Si estás desplegando en el VPS, **sáltate esta sección** y ve directamente a
> "Despliegue en Nginx (VPS)" más abajo, que es la configuración que manda.

`public/.htaccess` se copia a `dist/` al construir y se mantiene por si algún día el
sitio vuelve a servirse desde Apache. Léelo entero antes de tocar nada: contiene los
301 legacy, las cabeceras de seguridad, la política de caché y el manejo del 404.

**Lo que NO debes hacer nunca, ni aquí ni en Nginx:** un fallback del tipo
`RewriteRule . /index.html [L]` o `try_files $uri $uri/ /index.html`. La web dejó de
ser una SPA: es un sitio estático prerenderizado (`vite-react-ssg`), y **cada ruta real
existe ya como `dist/<ruta>/index.html`**. Ese fallback no hace falta para nada y sí
hace daño: convierte cualquier URL inventada en un **200 OK sirviendo la home**, con su
`robots: index, follow` y su canonical a `/`.

No es teórico. Medido en Search Console en julio de 2026, con el fallback activo: **solo
3 páginas del sitio indexadas**, mientras 12 URLs muertas de un WordPress anterior
(`/landing-oficial-24542/*`, `/category/uncategorized/`, `/?templately_library=*`)
seguían rastreándose una y otra vez porque respondían 200 en lugar de morir.

Lo correcto es que una ruta inexistente devuelva **404 real** con `dist/404/index.html`,
que ya se genera con `noindex, follow`.

## 5. Variables de Entorno (Si aplica)

Si tu aplicación usa variables de entorno (como `VITE_SUPABASE_URL`), asegúrate de que estén definidas en tu archivo `.env` localmente AL MOMENTO DE HACER EL BUILD.
Vite "incrusta" estas variables en el código JavaScript durante el comando `npm run build`. No necesitas subir el archivo `.env` al servidor.

¡Tu sitio debería estar línea!

---

## Despliegue en Nginx (VPS)

Si el sitio se hospeda en un VPS con Nginx, las reglas de `.htaccess` no aplican. La configuración equivalente debe vivir en el bloque `server { ... }` de Nginx (típicamente en `/etc/nginx/sites-available/opspilot.es`).

### Bloque server completo (referencia)

> **Producción corre sobre Nginx.** Verificado el 2026-07-26 (`server: nginx` en la
> respuesta de `https://opspilot.es/`). Es decir: **`public/.htaccess` no se aplica y
> nunca se ha aplicado.** Se mantiene en el repo por si algún día se sirve desde Apache,
> pero cualquier regla de rastreo, redirect o cabecera que deba tener efecto real
> tiene que estar TAMBIÉN aquí. Si cambias uno, cambia el otro.

> **Esto es un FRAGMENTO para fusionar con tu `server {}` actual, no un fichero completo
> que puedas pegar encima.** Deliberadamente no incluye lo que ya funciona en producción y
> yo no puedo ver: rutas de los certificados (`ssl_certificate`), el `server {}` de
> escucha en el puerto 80 que fuerza HTTPS, la canonicalización de `www` a sin `www`, ni
> la configuración de `gzip` (que normalmente vive a nivel `http`, no aquí).
> Si pegas esto tal cual encima de tu configuración, tiras el TLS y el sitio deja de
> servirse. **Copia solo los bloques marcados y respeta el orden.**
>
> ⚠️ **Este bloque va SOLO dentro del `server {}` de opspilot.es.** El VPS tiene más servicios: nunca lo pongas en un
> snippet compartido, en `nginx.conf` ni en el `default_server`, o aplicarías estas reglas (y el `=404`) a sitios que no son este.
>
> Nota: `listen 443 ssl http2;` está deprecado desde nginx 1.25.1 y hace que `nginx -t`
> escupa un warning. La forma actual es `listen 443 ssl;` más una línea `http2 on;`.

```nginx
server {
  listen 443 ssl;
  http2 on;                    # nginx >= 1.25.1 (antes: `listen 443 ssl http2;`)
  server_name opspilot.es;
  root /var/www/opspilotweb/dist;   # misma ruta que `remote_path` en .github/workflows/deploy.yml
  index index.html;

  # ── Ficheros ocultos: nada de .htaccess, .git, .env… (/.well-known/ sigue abierto) ──
  # Sin esto https://opspilot.es/.htaccess se lee en público (dist/ lo contiene).
  location ~ /\.(?!well-known) { deny all; }

  # ── Redirects 301 → destino FINAL, ABSOLUTO y CON barra ──
  # Mismas reglas que `redirects` en astro.config.mjs y que public/.htaccess.
  # Preserva el SEO de URLs antiguas que Google ya pueda haber indexado.
  #
  # POR QUÉ `rewrite … permanent` A NIVEL DE `server` Y NO `location … { return 301 }`:
  # el `rewrite ^(/[^.]*[^/])$ $1/ permanent;` de más abajo también está a nivel de server y se
  # ejecuta ANTES de elegir location. Con una `location` para /casos, la petición a /casos (sin
  # barra) la atrapaba ese rewrite primero: 301 a /casos/ y, desde ahí, otro 301 a /. Dos saltos.
  # Estas reglas, en cambio, se evalúan en orden con el resto de directivas del server y la primera
  # que casa corta: por eso TODAS van antes de ese rewrite. El `/?$` cubre la URL con y sin barra, y
  # el destino absoluto (https://opspilot.es/…) no depende de qué host o esquema llegó la petición.
  # No dejes `location` antiguas para estas rutas (p. ej. `/cases` → `/casos/` o `/product` → `/productos/`):
  # borra las que haya y deja solo estas.
  rewrite ^/(services|servicios|contact|demo|diagnostico|pricing|precios)/?$ https://opspilot.es/contacto/ permanent;
  rewrite ^/(resources|product)/?$                                           https://opspilot.es/recursos/ permanent;
  rewrite ^/(cases|casos)/?$                                                 https://opspilot.es/ permanent;
  rewrite ^/productos(/(erp-hosteleria|presupuesya))?/?$                     https://opspilot.es/soluciones/ permanent;
  rewrite ^/(soluciones/webs-y-tiendas|diseno-web-cordoba)/?$                https://opspilot.es/webs/ permanent;
  rewrite ^/(soluciones/(software-a-medida|automatizacion)|desarrollo-software-cordoba)/?$ https://opspilot.es/soluciones/ permanent;
  rewrite ^/recursos/(energydeal-crm-energetico|presupuestador-obra-bc3|erp-hosteleria-tpv-restaurantes|fiscalidad-plataforma-fiscal-contable|caso-reformas-de-excel-a-sistema|caso-energydeal-comercializadora-excel|caso-asesoria-archivo-digital-cliente-web|caso-hosteleria-tpv-inteligente-margen)/?$ https://opspilot.es/soluciones/ permanent;
  rewrite ^/recursos/caso-agencia-servicios-pipeline-automatizado/?$         https://opspilot.es/recursos/gestion-leads-agencia-sin-crm/ permanent;
  rewrite ^/herramientas/cuanto-cuesta-una-pagina-web/?$                     https://opspilot.es/webs/ permanent;

  # ── Rutas estáticas + 404 REAL ──
  # La web es estática (Astro, `build.format: 'directory'`): TODA ruta real existe como
  # dist/<ruta>/index.html, así que no hace falta ningún fallback a /index.html.
  #
  # El `=404` es el punto crítico y la razón de ser de este bloque. Con el antiguo
  # `try_files $uri $uri/ /index.html` cualquier URL inventada devolvía 200 sirviendo
  # la HOME prerenderizada, con su `robots: index, follow` y su canonical a `/`. Efecto
  # medido en Search Console (julio 2026): 12 URLs muertas de un WordPress anterior
  # (/landing-oficial-24542/*, /category/uncategorized/, /?templately_library=*) seguían
  # rastreándose indefinidamente porque respondían 200 en vez de morir, mientras solo 3
  # páginas reales del sitio estaban indexadas.
  #
  # La barra final importa: los canonical, el sitemap y los hreflang declaran
  # TODOS la forma CON barra (/webs/), porque es lo que el servidor sirve hoy.
  # Hecho verificado el 2026-07-26 contra producción: pedir https://opspilot.es/webs
  # acaba en https://opspilot.es/webs/ (hay una redirección real de por medio).
  #
  # Ese 301 lo emite hoy la configuración actual, que NO es exactamente este
  # bloque. `try_files $uri $uri/` por sí solo puede resolver el directorio con un
  # internal redirect y servir 200 en la URL SIN barra, que dejaría dos URLs
  # sirviendo lo mismo. Por eso el `rewrite` de abajo: hace explícito y
  # dependiente-de-nada lo que hoy ocurre por configuración heredada.
  #
  # Si prefieres no añadirlo, COMPRUEBA primero que el 301 sigue vivo:
  #   curl -sI https://opspilot.es/webs | head -1      # debe decir 301
  #
  # El `[^.]*` es CRÍTICO, no una optimización: excluye cualquier ruta que
  # contenga un punto, es decir todos los ficheros con extensión. Sin él, la
  # regla capturaría también /css/opspilot.css, /favicon.svg, /robots.txt
  # y /sitemap.xml, y los redirigiría a una URL con barra que devuelve 404 —
  # tirando la web entera (sin JS ni CSS) además del sitemap y el robots.
  # (Las reglas de redirección de arriba van antes a propósito: ver su comentario.)
  rewrite ^(/[^.]*[^/])$ $1/ permanent;

  location / {
    try_files $uri $uri/ =404;
  }

  # Página de 404: dist/404/index.html ya se genera con `noindex, follow`.
  error_page 404 /404/index.html;

  # ── Cache largo para assets fingerprinted ──
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # ── HTML siempre revalidado: el prerender cambia en cada despliegue ──
  location ~* \.html$ {
    include snippets/opspilot-headers.conf;   # ← OBLIGATORIO, ver aviso abajo
    add_header Cache-Control "no-cache, must-revalidate" always;
  }

  # ── Cabeceras de seguridad (nivel server, para todo lo que no tenga location propia) ──
  include snippets/opspilot-headers.conf;
}
```

**`/etc/nginx/snippets/opspilot-headers.conf`:**

```nginx
# Cabeceras activas en producción. La CSP está en ENFORCE (cabecera `Content-Security-Policy`,
# comprobado el 2026-11-11); ya no es Report-Only. Si la cambias, pruébala primero en Report-Only.
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://plausible.io https://formsubmit.co" always;
```

> ⚠️ **El `include` repetido no es redundancia: es la razón de ser del snippet.** En Nginx
> `add_header` **NO se hereda** hacia un `location` que declare sus propios `add_header`.
> Y esto muerde donde menos se espera: al pedir `/webs/`, la directiva `index` hace un
> internal redirect a `/webs/index.html`, que **vuelve a pasar por el matching de
> locations** y cae en la regex `\.html$` (las regex ganan al prefijo `/`). Si esa
> location declara su `Cache-Control` y no incluye el snippet, **las 6 cabeceras de
> seguridad desaparecen de todas las páginas del sitio**. Lo mismo aplica a `/assets/`:
> si le añades ahí un `add_header`, incluye también el snippet.
>
> Compruébalo siempre tras recargar:
> ```bash
> curl -sI https://opspilot.es/webs/ | grep -ic 'x-frame-options\|strict-transport'
> ```

Tras editar la configuración:
```bash
sudo nginx -t            # Valida sintaxis
sudo systemctl reload nginx
```

### Verificación de redirects

Tras `sudo nginx -t` y la recarga. Cada URL retirada, con y sin barra, debe dar UN solo `301` directo al destino final (absoluto).
La salida debe ser `HTTP/2 301` y una única línea `location:` con el destino de la última columna; si aparece un segundo salto
(p. ej. `/casos` → `/casos/` → `/`), hay una `location` antigua o una regla colocada después del `rewrite` de la barra final.

```bash
for u in /casos /casos/ /cases /cases/ /productos /productos/ /productos/erp-hosteleria/ /productos/presupuesya \
         /diseno-web-cordoba /diseno-web-cordoba/ /desarrollo-software-cordoba /desarrollo-software-cordoba/ \
         /soluciones/webs-y-tiendas /soluciones/webs-y-tiendas/ /soluciones/software-a-medida/ /soluciones/automatizacion \
         /recursos/caso-reformas-de-excel-a-sistema /recursos/caso-reformas-de-excel-a-sistema/ \
         /recursos/erp-hosteleria-tpv-restaurantes /recursos/erp-hosteleria-tpv-restaurantes/ \
         /recursos/caso-agencia-servicios-pipeline-automatizado/ /herramientas/cuanto-cuesta-una-pagina-web/ \
         /product /product/ /resources /services /contact; do
  printf '%-62s' "$u"
  curl -sI "https://opspilot.es$u" | grep -i '^HTTP\|^location' | tr -d '\r' | tr '\n' ' '
  echo
done
```

Destinos esperados (todos como `https://opspilot.es/...`): `/casos`, `/cases` → `/`; `/productos…`, `/soluciones/software-a-medida/`,
`/soluciones/automatizacion`, `/desarrollo-software-cordoba` y las guías retiradas → `/soluciones/`; `/diseno-web-cordoba`,
`/soluciones/webs-y-tiendas` y `/herramientas/cuanto-cuesta-una-pagina-web/` → `/webs/`;
`/recursos/caso-agencia-servicios-pipeline-automatizado/` → `/recursos/gestion-leads-agencia-sin-crm/`; `/product`, `/resources` → `/recursos/`;
`/services` y `/contact` → `/contacto/`.

```bash
# Ficheros ocultos: 403 (o 404), nunca 200
curl -sI https://opspilot.es/.htaccess | head -1                      # → HTTP/2 403
curl -sI https://opspilot.es/.well-known/security.txt | head -1       # sigue abierto: 200 si el fichero existe, 404 si no; nunca 403

# 404 REAL en cualquier URL inventada (antes devolvía 200 con la home)
curl -sI https://opspilot.es/ruta-que-no-existe | head -1            # → HTTP/2 404
curl -sI https://opspilot.es/landing-oficial-24542/ | head -1        # → HTTP/2 404
curl -sI https://opspilot.es/recursos/slug-inexistente | head -1     # → HTTP/2 404

# Las URLs del sitemap responden 200 directo, sin redirección
curl -sI https://opspilot.es/webs/ | head -1                          # → HTTP/2 200
curl -sI https://opspilot.es/soluciones/ | head -1                   # → HTTP/2 200
```

> Las páginas de redirección de `astro.config.mjs` (meta refresh) son una red de seguridad, pero **los 301 server-side son los que cuentan para SEO**: solo así Google transfiere la autoridad de las URLs antiguas a las nuevas.

> **Comprobación obligatoria tras el primer despliegue de este cambio:** que ninguna ruta legítima haya empezado a devolver 404. El `=404` no perdona: si una ruta no se generó en la construcción, deja de existir. Repasa las URLs de `sitemap-0.xml`.
