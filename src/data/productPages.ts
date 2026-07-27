// Las páginas de producto de /productos/<slug>/ — qué producto lleva página
// propia HOY, con qué metadatos y de qué artículos de /recursos se compone su
// contenido.
//
// ─── POR QUÉ ESTE FICHERO EXISTE Y NO ES `products.ts` ───
//
// `Product` (src/data/products.ts) responde a "qué productos tenemos": los 4
// están ahí, con su URL de producción y su interruptor de disponibilidad, y esa
// lista NO depende de si hemos escrito una página o no. Esto responde a algo
// distinto: "cuáles de esos 4 tienen HOY una URL propia en opspilot.es". Son
// dos ejes que se mueven a velocidades distintas —Fiscalidad es un producto
// vivo con ficha y artículo publicado, y aun así su página está congelada
// (§5 de .seo/01-rutas-y-metadatos.md)— y meterlos en la misma tabla habría
// significado un `page?: {...}` opcional dentro de `Product` que la mitad de
// las filas dejan vacío.
//
// La consecuencia práctica de tenerlo aparte: `PRODUCT_PAGES` es literalmente
// la lista de rutas que se prerenderizan (routes.tsx la usa como
// `getStaticPaths`) y la lista de tarjetas con enlace interno del hub. Publicar
// la página de un producto es AÑADIR UNA FILA aquí; nadie tiene que acordarse
// de tocar el enrutado ni el hub.
//
// ─── DE DÓNDE SALE CADA TEXTO ───
//
// `title`, `h1`, `description` y `slug` NO se han redactado aquí: están
// copiados literalmente de la §2 de `.seo/01-rutas-y-metadatos.md`, que es la
// especificación aprobada (con sus longitudes ya medidas: title ≤ 60,
// description ≤ 155). Si hay que cambiarlos, se cambian ALLÍ primero y luego
// aquí — al revés se pierde la trazabilidad de por qué una keyword está donde
// está.
//
// Lo que NO se escribe aquí es el CUERPO de la página. Ver `caseSlug`.
import type { ProductId } from './types';
import { getProduct } from './products';

export interface ProductPage {
    /** Último tramo de la URL: `/productos/<slug>/`.
     *
     *  NO se deriva de `Product.id` y no puede derivarse: el id de
     *  Presupuestador es `presupuestador` y su página, según la especificación,
     *  vive en `/productos/presupuestos-obra/` — porque el slug lo manda la
     *  búsqueda ("software presupuestos obra"), no nuestro nombre interno. Que
     *  en el ERP coincidan es una casualidad, no una regla. */
    slug: string;
    /** FK → `Product.id`. De ahí salen el nombre público, la URL de producción,
     *  el interruptor de disponibilidad, el sector y la vista previa. */
    productId: ProductId;
    /** `<title>` del documento. ≤ 60 caracteres (medido en la especificación). */
    title: string;
    /** El `<h1>` visible. Distinto del `title` a propósito: el title compite en
     *  la SERP y lleva el sufijo de marca; el H1 le habla a quien ya ha
     *  entrado. Duplicar uno en el otro desperdicia la mitad del espacio útil. */
    h1: string;
    /** `<meta name="description">`. ≤ 155 caracteres. */
    description: string;
    /** Slug del artículo de /recursos con el CASO PRÁCTICO del producto.
     *
     *  El artículo de producto no hace falta declararlo: ya es
     *  `Product.resourceSlug`. Este no tenía dónde vivir —ninguna relación del
     *  modelo unía un producto con su caso práctico de /recursos— y por eso se
     *  declara aquí y no se adivina.
     *
     *  ES LA MITAD DEL PLAN ANTI-DUPLICADO. La página de producto no copia ni
     *  un párrafo: lee estos dos recursos de src/lib/resources.ts y los
     *  compone. El día que se activen las 301 y estos dos artículos dejen de
     *  servirse por su URL, el texto sigue existiendo una sola vez y en el
     *  mismo sitio — no hay dos versiones que reconciliar. */
    caseSlug?: string;
    /** ¿Sale del índice de Google (y, por tanto, del sitemap)?
     *
     *  Ver el comentario largo de cada página abajo. Es OPCIONAL con default
     *  indexable por el mismo motivo que la prop de `PageSEO`: un olvido no
     *  puede desindexar nada. */
    noindex?: boolean;
}

export const PRODUCT_PAGES: readonly ProductPage[] = [
    {
        slug: 'erp-hosteleria',
        productId: 'erp-hosteleria',
        title: 'ERP para hostelería: TPV, inventario y caja · OpsPilot',
        h1: 'ERP para hostelería: del TPV al cierre de caja',
        description:
            'ERP para restaurantes y bares: TPV con mesas y comandas, inventario y pedidos a proveedores, turnos, reservas y cierre de caja con analítica.',
        caseSlug: 'caso-hosteleria-tpv-inteligente-margen',
        // ⛔ NOINDEX TEMPORAL — LEER ANTES DE QUITARLO.
        //
        // Esta página cuenta lo mismo que `erp-hosteleria-tpv-restaurantes`
        // (312 palabras) y `caso-hosteleria-tpv-inteligente-margen` (526), que
        // HOY están publicados e indexables en /recursos. Dos URLs nuestras con
        // el mismo contenido compitiendo entre sí es exactamente lo que este
        // bloque venía a evitar, así que hasta que esos dos artículos dejen de
        // servirse esta página no puede entrar en el índice.
        //
        // CÓMO LEVANTARLO — las dos cosas EN EL MISMO DESPLIEGUE, nunca por
        // separado:
        //   1. Quitar esta línea (`noindex: true`).
        //   2. Activar las 301 de la §4 de .seo/01-rutas-y-metadatos.md:
        //        /recursos/erp-hosteleria-tpv-restaurantes/      → esta página
        //        /recursos/caso-hosteleria-tpv-inteligente-margen/ → esta página
        //
        // Quitar el noindex SIN las 301 publica el duplicado. Activar las 301
        // SIN quitar el noindex manda todo el tráfico y toda la autoridad de
        // esos dos artículos a una página que le hemos dicho a Google que no
        // indexe — o sea, tirar a la basura las 838 palabras y las impresiones
        // que ya tenían. Cada mitad por su cuenta es peor que no hacer nada.
        noindex: true,
    },
    // ── Las dos que NO están aquí, y por qué ───────────────────────────────
    //
    // `/productos/presupuestos-obra/` — BLOQUEADA POR DECISIÓN DE MARCA. La web
    // llama al producto "Presupuestador" y el producto, una vez dentro, se
    // llama "PresupuesYa" (ver el TODO(negocio) en products.ts). El slug, el H1
    // y el title salen del nombre definitivo, así que escribirlos hoy es
    // garantizar reescribir una URL después — y cambiar una URL ya publicada
    // cuesta otra 301. Sus metadatos ya están redactados en la §2 de la
    // especificación, esperando el nombre.
    //
    // `/productos/fiscalidad/` — CONGELADA. fiscalidad.mcpopspilot.org sirve
    // hoy una pantalla en blanco (le faltan las variables de entorno de
    // Supabase; está marcada `availability: 'down'`). Posicionar por "software
    // verifactu" —de las búsquedas con más intención de compra del inventario—
    // para llevar a una puerta cerrada quema la primera impresión y gasta el
    // poco presupuesto de rastreo que tiene el dominio. Orden correcto en la
    // §5: arreglar el despliegue → `'live'` → publicar la página → sus 301.
    //
    // EnergyDeal no aparece y NO es un olvido: no lleva página propia nunca.
    // energydeal.es ya es una web de marketing completa con su propio SEO, y
    // crear /productos/energydeal/ pondría dos páginas NUESTRAS a competir por
    // las mismas búsquedas desde dos dominios distintos (§3). El hub le enlaza
    // hacia fuera: se le presta autoridad, no se le compite.
];

export function getProductPage(slug: string): ProductPage | undefined {
    return PRODUCT_PAGES.find((p) => p.slug === slug);
}

/** ¿Este producto tiene página propia publicada HOY?
 *
 *  Es la pregunta que hace el hub para decidir si una tarjeta lleva enlace
 *  interno (`/productos/<slug>/`) o se conforma con su artículo de /recursos.
 *  Vive aquí y no en el render por el mismo motivo que `isLinkable` vive en
 *  products.ts: si la respuesta se calcula en cada superficie, tarde o temprano
 *  dos superficies contestan distinto. */
export function getProductPageByProductId(id: ProductId): ProductPage | undefined {
    return PRODUCT_PAGES.find((p) => p.productId === id);
}

/** Ruta interna canónica de una página de producto, CON barra final.
 *
 *  La barra no es cosmética: con `ssgOptions.dirStyle: 'nested'` cada ruta se
 *  prerenderiza como una CARPETA, así que el servidor responde 301 de
 *  `/productos/x` a `/productos/x/` por su cuenta. Emitir la forma sin barra en
 *  un canonical, un breadcrumb o el sitemap es apuntar a una URL que redirige
 *  — el fallo que ya costó 21 de 22 URLs del sitemap (ver el comentario de
 *  `loc` en scripts/generate-sitemap.mjs). Una sola función y no se vuelve a
 *  discutir. */
export function productPagePath(page: ProductPage): string {
    return `/productos/${page.slug}/`;
}

/** El producto de una página. Envuelve `getProduct` para que ningún consumidor
 *  tenga que importar los dos módulos solo para cruzar la FK. */
export function getPageProduct(page: ProductPage) {
    return getProduct(page.productId);
}
