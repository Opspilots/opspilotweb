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
> Nota: `listen 443 ssl http2;` está deprecado desde nginx 1.25.1 y hace que `nginx -t`
> escupa un warning. La forma actual es `listen 443 ssl;` más una línea `http2 on;`.

```nginx
server {
  listen 443 ssl;
  http2 on;                    # nginx >= 1.25.1 (antes: `listen 443 ssl http2;`)
  server_name opspilot.es;
  root /var/www/opspilot/dist;
  index index.html;

  # ── Redirects 301 legacy → destino FINAL ──
  # Preserva el SEO de URLs antiguas que Google ya pueda haber indexado.
  # Van al destino final y CON barra: si apuntaran a /servicios o /productos
  # encadenarían un segundo 301 (esos stubs solo existen para redirigir), y si
  # apuntaran sin barra encadenarían el 301 que añade la barra. Un salto, no tres.
  # El `/?$` NO es adorno: con `location = /services` (match exacto) la variante
  # `/services/` no entraría aquí, caería en el `try_files` de abajo y devolvería
  # 404 — justo las URLs antiguas cuya autoridad queremos conservar. El .htaccess
  # sí las cubría (`^services/?$`). Las regex se evalúan ANTES que el prefijo `/`.
  location ~ ^/(services|servicios|contact|demo|diagnostico|pricing|precios)/?$ { return 301 /contacto/; }
  location ~ ^/cases/?$                                                        { return 301 /casos/; }
  location ~ ^/resources/?$                                                    { return 301 /recursos/; }

  # /product (EN) apunta al hub de productos, NO al blog.
  # ⚠️ NO añadas aquí `productos`. Hasta 2026-07-27 esta regla mandaba también
  # /productos a /recursos/, porque los productos vivían como artículos del
  # blog. Ya no: /productos/ es una página real. Como esta redirección es de
  # servidor y corre ANTES que React, dejarla puesta hace que el hub sea
  # inalcanzable en producción — y no se detecta en local, porque el servidor
  # de desarrollo de Vite no aplica ni este bloque ni el .htaccess.
  location ~ ^/product/?$                                                      { return 301 /productos/; }

  # ── Rutas estáticas + 404 REAL ──
  # La web es SSG (vite-react-ssg, dirStyle 'nested'): TODA ruta real existe como
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
  # TODOS la forma CON barra (/casos/), porque es lo que el servidor sirve hoy.
  # Hecho verificado el 2026-07-26 contra producción: pedir https://opspilot.es/casos
  # acaba en https://opspilot.es/casos/ (hay una redirección real de por medio).
  #
  # Ese 301 lo emite hoy la configuración actual, que NO es exactamente este
  # bloque. `try_files $uri $uri/` por sí solo puede resolver el directorio con un
  # internal redirect y servir 200 en la URL SIN barra, que dejaría dos URLs
  # sirviendo lo mismo. Por eso el `rewrite` de abajo: hace explícito y
  # dependiente-de-nada lo que hoy ocurre por configuración heredada.
  #
  # Si prefieres no añadirlo, COMPRUEBA primero que el 301 sigue vivo:
  #   curl -sI https://opspilot.es/casos | head -1     # debe decir 301
  #
  # El `[^.]*` es CRÍTICO, no una optimización: excluye cualquier ruta que
  # contenga un punto, es decir todos los ficheros con extensión. Sin él, la
  # regla capturaría también /assets/app-JSd3VJND.js, /favicon.svg, /robots.txt
  # y /sitemap.xml, y los redirigiría a una URL con barra que devuelve 404 —
  # tirando la web entera (sin JS ni CSS) además del sitemap y el robots.
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
# Las 4 primeras ya están activas en producción (verificado 2026-07-26).
# La CSP en Report-Only NO lo está: vivía solo en .htaccess, que no se aplica.
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://plausible.io https://formsubmit.co" always;
```

> ⚠️ **El `include` repetido no es redundancia: es la razón de ser del snippet.** En Nginx
> `add_header` **NO se hereda** hacia un `location` que declare sus propios `add_header`.
> Y esto muerde donde menos se espera: al pedir `/casos/`, la directiva `index` hace un
> internal redirect a `/casos/index.html`, que **vuelve a pasar por el matching de
> locations** y cae en la regex `\.html$` (las regex ganan al prefijo `/`). Si esa
> location declara su `Cache-Control` y no incluye el snippet, **las 6 cabeceras de
> seguridad desaparecen de todas las páginas del sitio**. Lo mismo aplica a `/assets/`:
> si le añades ahí un `add_header`, incluye también el snippet.
>
> Compruébalo siempre tras recargar:
> ```bash
> curl -sI https://opspilot.es/casos/ | grep -ic 'x-frame-options\|strict-transport'
> ```

Tras editar la configuración:
```bash
sudo nginx -t            # Valida sintaxis
sudo systemctl reload nginx
```

### Verificación de redirects

```bash
# Un SOLO salto hasta el destino final, ya con barra
curl -sI https://opspilot.es/services | grep -i '^HTTP\|^location'   # → 301 /contacto/
curl -sI https://opspilot.es/contact  | grep -i '^HTTP\|^location'   # → 301 /contacto/
curl -sI https://opspilot.es/demo     | grep -i '^HTTP\|^location'   # → 301 /contacto/

# 404 REAL en cualquier URL inventada (antes devolvía 200 con la home)
curl -sI https://opspilot.es/ruta-que-no-existe | head -1            # → HTTP/2 404
curl -sI https://opspilot.es/landing-oficial-24542/ | head -1        # → HTTP/2 404
curl -sI https://opspilot.es/recursos/slug-inexistente | head -1     # → HTTP/2 404

# Las URLs del sitemap responden 200 directo, sin redirección
curl -sI https://opspilot.es/casos/ | head -1                        # → HTTP/2 200
curl -sI https://opspilot.es/soluciones/ | head -1                   # → HTTP/2 200
```

> Los redirects client-side de `src/components/common/RedirectTo.tsx` son una red de seguridad, pero **los 301 server-side son los que cuentan para SEO**: solo así Google transfiere la autoridad de las URLs antiguas a las nuevas.

> **Comprobación obligatoria tras el primer despliegue de este cambio:** que ninguna ruta legítima haya empezado a devolver 404. El `=404` no perdona: si una ruta no se prerenderizó, deja de existir. Repasa las 22 URLs del sitemap.
