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

## 4. Configuración de Rutas (.htaccess)

Hemos incluido automáticamente un archivo `.htaccess` en la carpeta `public` que se copiará a `dist` al construir. Este archivo es CRÍTICO para que funcionen las rutas de la aplicación (como `/contact`, `/pricing`, etc.) cuando el usuario recarga la página.

**Contenido de .htaccess (ya incluido):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

Si por alguna razón las rutas dan error 404, verifica que este archivo (sin nombre, solo extensión `.htaccess`) esté presente en `public_html`.

## 5. Variables de Entorno (Si aplica)

Si tu aplicación usa variables de entorno (como `VITE_SUPABASE_URL`), asegúrate de que estén definidas en tu archivo `.env` localmente AL MOMENTO DE HACER EL BUILD.
Vite "incrusta" estas variables en el código JavaScript durante el comando `npm run build`. No necesitas subir el archivo `.env` al servidor.

¡Tu sitio debería estar línea!

---

## Despliegue en Nginx (VPS)

Si el sitio se hospeda en un VPS con Nginx, las reglas de `.htaccess` no aplican. La configuración equivalente debe vivir en el bloque `server { ... }` de Nginx (típicamente en `/etc/nginx/sites-available/opspilot.es`).

### Bloque server completo (referencia)

```nginx
server {
  listen 443 ssl http2;
  server_name opspilot.es;
  root /var/www/opspilot/dist;
  index index.html;

  # ── Redirects 301 inglés → español ──
  # Preserva el SEO de URLs antiguas que Google ya pueda haber indexado.
  location = /services  { return 301 /servicios; }
  location = /cases     { return 301 /casos; }
  location = /pricing   { return 301 /precios; }
  location = /resources { return 301 /recursos; }
  location = /contact   { return 301 /contacto; }
  location = /product   { return 301 /productos; }
  location = /demo      { return 301 /contacto; }

  # ── SPA fallback ──
  location / {
    try_files $uri $uri/ /index.html;
  }

  # ── Cache largo para assets fingerprinted ──
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

Tras editar la configuración:
```bash
sudo nginx -t            # Valida sintaxis
sudo systemctl reload nginx
```

### Verificación de redirects

```bash
curl -I https://opspilot.es/services   # Debe responder 301 Location: /servicios
curl -I https://opspilot.es/contact    # → 301 /contacto
curl -I https://opspilot.es/demo       # → 301 /contacto
```

> Los `<Navigate>` definidos en `src/App.tsx` actúan como red de seguridad client-side, pero **los redirects 301 server-side son críticos para SEO**: solo así Google transfiere la autoridad de las URLs antiguas a las nuevas.
