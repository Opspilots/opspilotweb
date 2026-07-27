# Bloque C · Tabla de rutas y metadatos — páginas de producto

**Fecha:** 2026-07-27
**Decisión de partida:** ADR-001 (páginas de PRODUCTO, no de sector). Ver §4.

---

## 0. Por qué producto y no sector, en dos números

La propuesta original era publicar 7 páginas, una por sector vertical. Se descartó midiendo:

| | Páginas de sector | Páginas de producto |
|---|---|---|
| Copy propio ya escrito | **131 palabras** por sector | **838–938 palabras** por producto (artículo + caso práctico) |
| Demanda medida en Search Console | 0 impresiones en 5 de los 7 | `erp restaurante` 8, `erp hosteleria` 5, `framework de facturación` 2 |
| Palabras nuevas que habría que escribir | ~5.500 | **0** |

Y el dato que cierra la discusión: a 2026-07-27 el dominio tiene **3 páginas indexadas de 22**. Publicar 7 páginas flojas de golpe sobre un dominio en ese estado es la forma más rápida de que Google deje de rastrear el sitio.

Los sectores **no desaparecen**: siguen siendo la estructura de `/soluciones`, con sus anclas. Lo que no reciben es URL propia hasta que haya contenido que la sostenga.

---

## 1. Regla de asignación

> **¿Este sector tiene un producto propio?**
> Sí → el producto se lleva la página. No → el sector se queda como ancla en `/soluciones`.

| Sector | Producto | Qué recibe |
|---|---|---|
| `asesorias` | Fiscalidad | Página de producto — **congelada**, ver §5 |
| `energia` | EnergyDeal | **Ninguna.** Tiene dominio y SEO propios, ver §3 |
| `reformas` | PresupuesYa | Página de producto |
| `hosteleria` | ERP Hostelería | Página de producto |
| `agencias` | — | Ancla en `/soluciones` |
| `pymes` | — | Ancla en `/soluciones` |
| `medida` | — | Ancla en `/soluciones` |

---

## 2. Tabla de metadatos

Longitudes objetivo: `title` ≤ 60 caracteres, `description` ≤ 155. Ambas verificadas abajo entre paréntesis.

### `/productos/` — hub

| Campo | Valor |
|---|---|
| **title** | `Productos: software vertical para tu sector · OpsPilot` (53) |
| **H1** | Software que ya está funcionando |
| **description** | `Productos verticales en producción: ERP de hostelería, presupuestos de obra con BC3 y plataforma fiscal con VeriFactu. Con acceso a la aplicación real.` (150) |
| **keyword objetivo** | software vertical para pymes |
| **prioridad sitemap** | 0.9 |

Enlaza a las 3 páginas de producto y, como enlace externo, a EnergyDeal. Es el nodo que reparte autoridad hacia los productos, que hoy no la reciben de ningún sitio.

### `/productos/erp-hosteleria/`

| Campo | Valor |
|---|---|
| **title** | `ERP para hostelería: TPV, inventario y caja · OpsPilot` (53) |
| **H1** | ERP para hostelería: del TPV al cierre de caja |
| **description** | `ERP para restaurantes y bares: TPV con mesas y comandas, inventario y pedidos a proveedores, turnos, reservas y cierre de caja con analítica.` (139) |
| **keyword principal** | erp hostelería — *5 impresiones, posición 34* |
| **secundarias** | erp restaurante (*8 impr., pos. 68*), tpv para restaurantes, software gestión hostelería |
| **prioridad** | 0.9 |

**Es la que más urge.** Es el único sitio del inventario donde ya hay demanda medida y posición recuperable (34 es página 4: se sube con una página dedicada, no con un párrafo dentro de `/soluciones`). Hoy `hosteleria` es el **último** de los 7 sectores y no aparece ni en el title, ni en la description, ni en el H1 de `/soluciones`.

### `/productos/presupuestos-obra/`

| Campo | Valor |
|---|---|
| **title** | `Software de presupuestos de obra con BC3 · OpsPilot` (50) |
| **H1** | Presupuestos y certificaciones de obra con BC3 nativo |
| **description** | `Presupuestos para reformas y construcción con BC3/FIEBDC nativo, partidas descompuestas, certificaciones versionadas y firma digital del cliente.` (144) |
| **keyword principal** | software presupuestos obra |
| **secundarias** | programa presupuestos reformas, bc3 fiebdc, certificaciones de obra |
| **prioridad** | 0.8 |

⚠️ **Bloqueada por decisión de marca.** La web lo llama «Presupuestador» y el producto se llama «PresupuesYa». El slug, el H1 y el title tienen que salir del nombre definitivo. Ver `TODO(negocio)` en `src/data/products.ts`.

### `/productos/fiscalidad/` — **NO PUBLICAR TODAVÍA**

| Campo | Valor |
|---|---|
| **title** | `Software fiscal con VeriFactu y SII nativos · OpsPilot` (53) |
| **H1** | Facturación, contabilidad y modelos AEAT en una plataforma |
| **description** | `Software fiscal y contable español: VeriFactu y SII nativos, contabilidad PGC, modelos 303, 130, 347 y 390, y captura de tickets con OCR.` (135) |
| **keyword principal** | software verifactu |
| **secundarias** | programa facturación asesorías, modelo 303 software, sii aeat |
| **prioridad** | 0.8 |

**Congelada hasta que se arregle el producto.** Ver §5.

---

## 3. EnergyDeal no lleva página, y es deliberado

`energydeal.es` ya es una web de marketing completa —Funcionalidades, Cómo funciona, Integraciones, Precios, Blog—, indexable y con sus propios metadatos. Crear `/productos/energydeal/` en opspilot.es sería **poner dos páginas nuestras a competir por las mismas búsquedas desde dos dominios distintos**, que es la peor forma de canibalización porque ni siquiera se puede resolver con un canonical entre ellas sin renunciar a una.

Lo correcto: `/productos/` enlaza a `energydeal.es`, y el caso práctico de energía vive en `/casos`. Se le presta autoridad, no se le compite.

⚠️ **Incoherencia de posicionamiento pendiente:** `energydeal.es` se vende como *«CRM para Aseguradoras y Corredurías»*, mientras que en opspilot.es se describe como *«CRM para agentes y comercializadoras energéticas»*. Son dos públicos distintos. Alguien tiene que decidir cuál es, porque hoy las dos webs cuentan cosas diferentes del mismo producto.

---

## 4. Mapa de redirecciones 301

**No activar hasta que las páginas destino estén publicadas y revisadas.** Un 301 se propaga en días y revertirlo cuesta semanas.

| Origen (publicado hoy) | Destino | Palabras que aporta |
|---|---|---|
| `/recursos/erp-hosteleria-tpv-restaurantes/` | `/productos/erp-hosteleria/` | 312 |
| `/recursos/caso-hosteleria-tpv-inteligente-margen/` | `/productos/erp-hosteleria/` | 526 |
| `/recursos/presupuestador-obra-bc3/` | `/productos/presupuestos-obra/` | 353 |
| `/recursos/caso-reformas-de-excel-a-sistema/` | `/productos/presupuestos-obra/` | 355 |
| `/recursos/fiscalidad-plataforma-fiscal-contable/` | `/productos/fiscalidad/` | 408 |
| `/recursos/caso-asesoria-archivo-digital-cliente-web/` | `/productos/fiscalidad/` | 530 |
| `/soluciones/` | *se queda* — pasa a ser el hub de servicios | — |

**Se quedan donde están** los dos de EnergyDeal (`energydeal-crm-energetico`, `caso-energydeal-comercializadora-excel`): sin página de destino, no hay nada a lo que redirigir.

Balance: el blog pasa de 17 a 11 artículos. Los 6 que se absorben eran de intención **comercial**, mal colocados en una sección informativa. Los 11 que quedan son los que de verdad hacen de blog.

---

## 5. Fiscalidad: por qué se congela

`fiscalidad.mcpopspilot.org` sirve hoy una **pantalla en blanco**. La consola da el motivo: `Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY`. Está marcada `availability: 'down'` en `src/data/products.ts` y su enlace ya no se renderiza en ninguna superficie.

Publicar una página que posicione por «software verifactu» y lleve a una aplicación rota es peor que no publicarla: gastas el poco presupuesto de rastreo que tiene un dominio nuevo en atraer gente a una puerta cerrada, y quemas la primera impresión de las búsquedas que más intención de compra tienen de todo el inventario.

**Orden correcto:** arreglar el despliegue → cambiar `'down'` por `'live'` → publicar la página → activar sus dos 301.

---

## 6. Orden de ejecución

1. `/productos/` + `/productos/erp-hosteleria/` — es donde hay demanda medida.
2. `/productos/presupuestos-obra/` — en cuanto se decida el nombre.
3. Verificar en producción que las 3 responden 200 y que el sitemap las recoge.
4. **Solo entonces**, activar las 301 de la §4, de una en una y comprobando cada una.
5. `/productos/fiscalidad/` cuando el producto vuelva a estar en pie.
6. Revisar impresiones y posición por página en Search Console a las 4-6 semanas.

**Dependencia externa que bloquea todo lo anterior:** el arreglo de Nginx en el VPS (ver `DEPLOY.md`). Mientras cualquier URL inventada siga devolviendo 200 con la home, publicar rutas nuevas es echar más leña a un rastreo que ya está roto.
