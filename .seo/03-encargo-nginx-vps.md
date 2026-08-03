# Encargo para el agente con acceso al VPS — configuración de Nginx de opspilot.es

> Pégale esto entero. Está escrito para que se ejecute sin ningún contexto previo.

---

## Rol y objetivo

Eres el administrador de sistemas de `opspilot.es`, un sitio **estático prerenderizado** (Vite + `vite-react-ssg`) servido por **Nginx** desde un VPS. El código ya está desplegado y correcto. **El único trabajo pendiente está en la configuración de Nginx.**

Tu objetivo es que las URLs inexistentes dejen de devolver `200 OK`.

---

## Reglas innegociables

1. **Haz copia de seguridad del fichero de configuración ANTES de tocarlo**, con fecha en el nombre. Sin copia, no toques nada.
2. **Nunca recargues sin validar**: `sudo nginx -t` primero, siempre. Si falla, restaura la copia y para.
3. **No toques la configuración de TLS**: `ssl_certificate`, `ssl_certificate_key`, el bloque `listen 80` ni la redirección a HTTPS. Funcionan. Si los rompes, el sitio cae entero.
4. **No pegues bloques enteros encima.** Este documento describe cambios quirúrgicos sobre la configuración existente. Fusiona, no sustituyas.
5. Si algo no coincide con lo que se describe aquí, **para y repórtalo** en vez de improvisar.
6. Trabajas sobre un sitio en producción con tráfico real. Cada paso se verifica antes del siguiente.

---

## El problema, medido en producción

```
/                          -> 200   ✅ correcto
/productos/                -> 200   ✅ correcto
/casos/                    -> 200   ✅ correcto
/casos                     -> 301 a /casos/   ✅ correcto, NO lo cambies

/ruta-inventada-xyz        -> 200   ❌ debería ser 404
/landing-oficial-24542/    -> 200   ❌ debería ser 404
/category/uncategorized/   -> 200   ❌ debería ser 404
/services                  -> 301 a /services/  ⚠️ debería ir a /contacto/
```

**Por qué importa.** La configuración actual tiene un *fallback* de aplicación de página única (`try_files ... /index.html`) heredado de cuando el sitio SÍ era una SPA. Ya no lo es: **cada ruta real existe como fichero** en `dist/<ruta>/index.html`. Ese fallback ya no hace falta y sí hace daño: convierte **cualquier** URL inventada en un `200 OK` que sirve la **portada**, con su `robots: index, follow` y su `canonical` a `/`.

Consecuencia medida en Google Search Console (julio 2026): **solo 3 páginas indexadas de 22**, mientras 12 URLs muertas de un WordPress anterior —`/landing-oficial-24542/*`, `/category/uncategorized/`, `/?templately_library=*`— se rastrean una y otra vez porque responden 200 en lugar de morir.

---

## Paso 1 — Localizar y respaldar

```bash
# Localiza el fichero real (la ruta habitual es la primera, pero verifícalo)
sudo nginx -T 2>/dev/null | grep -n "server_name opspilot.es" -A3 -B10 | head -40
ls -la /etc/nginx/sites-available/

# Copia de seguridad con fecha
sudo cp /etc/nginx/sites-available/opspilot.es \
        /etc/nginx/sites-available/opspilot.es.bak.$(date +%Y%m%d-%H%M%S)
```

**Antes de seguir, muestra el bloque `server` completo del puerto 443.** Necesitas ver qué hay realmente antes de decidir dónde encaja cada cambio.

---

## Paso 2 — Los tres cambios

### 2.1 · El fallback de SPA pasa a 404 real *(el importante)*

Busca dentro del `location /` algo equivalente a:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Cámbialo por:

```nginx
location / {
    try_files $uri $uri/ =404;
}
```

Y añade, **a nivel de `server`** (fuera de cualquier `location`):

```nginx
error_page 404 /404/index.html;
```

`dist/404/index.html` ya existe en el despliegue y se genera con `noindex, follow`.

> ⚠️ **No cambies los dos primeros parámetros de `try_files`.** El `$uri` y el `$uri/` son los que producen el `301` de `/casos` a `/casos/`, y ese comportamiento **es correcto y necesario**: los `canonical`, el `sitemap.xml` y los `hreflang` del sitio declaran todos la forma **con** barra final. Si lo rompes, las 22 URLs del sitemap dejan de cuadrar.

### 2.2 · Redirecciones de URLs antiguas al destino final

Hoy `/services` acaba en `/services/` y el salto a `/contacto/` lo hace el navegador tras un `200`. Para un buscador eso es mucho peor que un `301` limpio.

Añade **antes** del `location /`:

```nginx
location ~ ^/(services|servicios|contact|demo|diagnostico|pricing|precios)/?$ { return 301 /contacto/; }
location ~ ^/cases/?$                                                        { return 301 /casos/; }
location ~ ^/(resources|product)/?$                                          { return 301 /recursos/; }
```

Tres detalles que no son opcionales:

- **`/?$`** cubre la variante con y sin barra. Con `location = /services` (coincidencia exacta), `/services/` no entraría, caería en el `try_files` y devolvería 404 — justo las URLs antiguas cuya autoridad queremos conservar.
- **Destino final y con barra.** Si apuntaran a `/servicios` encadenarían un segundo salto, y sin barra encadenarían el que añade la barra. Un salto, no tres.
- **NO incluyas `productos` en esa última línea.** `/productos/` es una **página real** del sitio desde el último despliegue. Redirigirla la haría inalcanzable.

### 2.3 · Cabeceras de seguridad — la trampa

Comprueba si hay algún `location` con `add_header` propio (típicamente `/assets/` o una regex `\.html$`).

**En Nginx, `add_header` NO se hereda hacia un `location` que declara los suyos.** Y esto muerde donde no se espera: al pedir `/casos/`, la directiva `index` hace una redirección interna a `/casos/index.html`, que **vuelve a pasar por la selección de `location`** y cae en cualquier regex `\.html$`. Si esa regex declara su propio `add_header`, **las cabeceras de seguridad desaparecen de todas las páginas del sitio**.

Si te encuentras ese caso, extrae las cabeceras a un fichero e inclúyelo en cada `location` que tenga `add_header` propio:

```nginx
# /etc/nginx/snippets/opspilot-headers.conf
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

Estas cuatro **ya están activas hoy** — verificado. Tu trabajo aquí es **no perderlas**, no añadirlas.

---

## Paso 3 — Validar y recargar

```bash
sudo nginx -t          # si falla: restaura la copia y para
sudo systemctl reload nginx
```

`reload` no corta conexiones. No uses `restart`.

---

## Paso 4 — Verificación

Ejecuta esto entero y **pega la salida en tu informe**:

```bash
echo "── Deben seguir dando 200 ──"
for u in / /productos/ /productos/erp-hosteleria/ /casos/ /soluciones/ /recursos/ /contacto/; do
  printf "%-34s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' https://opspilot.es$u)"
done

echo "── Deben pasar a 404 ──"
for u in /ruta-inventada-xyz /landing-oficial-24542/ /category/uncategorized/ /recursos/slug-que-no-existe; do
  printf "%-34s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' https://opspilot.es$u)"
done

echo "── Un solo salto al destino final ──"
for u in /services /contact /demo /cases; do
  printf "%-34s %s -> %s\n" "$u" \
    "$(curl -s -o /dev/null -w '%{http_code}' https://opspilot.es$u)" \
    "$(curl -s -o /dev/null -w '%{redirect_url}' https://opspilot.es$u)"
done

echo "── /casos DEBE seguir dando 301 a /casos/ ──"
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://opspilot.es/casos

echo "── Las 4 cabeceras de seguridad deben seguir ahí ──"
curl -sI https://opspilot.es/casos/ | grep -ic 'x-frame-options\|x-content-type\|referrer-policy\|strict-transport'
```

**Resultado esperado:** los siete primeros `200`; los cuatro siguientes `404`; los redirects con un solo salto a `/contacto/` y `/casos/`; `/casos` en `301` hacia `/casos/`; y el contador de cabeceras en **4**.

**Si alguna ruta legítima empieza a dar 404, restaura la copia inmediatamente.** El `=404` no perdona: si una ruta no se prerenderizó, deja de existir.

---

## Rollback

```bash
sudo cp /etc/nginx/sites-available/opspilot.es.bak.<TU-FECHA> \
        /etc/nginx/sites-available/opspilot.es
sudo nginx -t && sudo systemctl reload nginx
```

---

## Lo que NO debes hacer

- **No añadas** una redirección de `/productos` — es una página real.
- **No cambies** el `301` de `/casos` a `/casos/`; el sitio entero depende de esa convención.
- **No toques** TLS, el bloque del puerto 80 ni la redirección a HTTPS.
- **No uses** `restart`; `reload` basta y no corta conexiones.
- **No inventes** rutas ni reglas que no estén aquí.
- **No borres** el fichero de copia de seguridad al terminar.

---

## Entregable

1. El bloque `server` **antes** y **después**, para poder comparar.
2. La salida completa del Paso 4.
3. Cualquier cosa que no coincidiera con lo descrito aquí.
4. La ruta exacta del fichero de copia de seguridad.
