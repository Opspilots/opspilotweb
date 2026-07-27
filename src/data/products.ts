// Fuente ÚNICA de los productos propios de OpsPilot — los 4 SaaS verticales
// que ya están en producción, no los proyectos a medida de cliente.
//
// Por qué existe este fichero. Hasta ahora la información de cada producto
// estaba repartida en tres sitios que no se conocían entre sí:
//   · la URL de producción, enterrada en el ÚLTIMO bloque de un artículo
//     largo de /recursos (src/lib/resources.ts, bloques `type: 'link'`);
//   · el nombre, escrito a mano en el @graph de index.html (HTML estático,
//     fuera del bundler, así que nadie lo ve al refactorizar);
//   · la relación con el sector, implícita en `Sector.relatedResource`.
// Resultado: 4 productos vivos a los que un visitante normal no llega nunca
// — no aparecen en Inicio, ni en Soluciones, ni en Casos, ni en el pie. Solo
// al final de un artículo que hay que leer entero.
//
// A partir de aquí, quien quiera saber cómo se llama un producto, a dónde
// apunta o si hoy se puede enlazar, mira AQUÍ. `Sector.productId` y
// `Case.productId` referencian por identificador (ver src/data/types.ts):
// ningún otro fichero vuelve a escribir una URL de producto.
import type { ExternalLink, ProductId, SectorId } from './types';

export interface Product {
    id: ProductId;
    /** Nombre público. ÚNICO sitio donde vive: cambiarlo aquí lo cambia en
     *  todas las superficies que lo pinten. */
    name: string;
    /** FK → `Sector.id`. Un producto pertenece a UN sector vertical; la
     *  relación inversa (`Sector.productId`) es la que consulta el render de
     *  /soluciones. Se declara en los dos lados a propósito: son 4 filas y
     *  poder recorrer la relación en ambos sentidos sin construir un índice
     *  vale más que la pureza de tenerla escrita una sola vez. */
    sectorId: SectorId;
    /** Slug del artículo de /recursos que describe el producto (categoría
     *  'Producto' en src/lib/resources.ts).
     *
     *  Coincide hoy con `Sector.relatedResource.slug` en los 4 sectores con
     *  producto, y NO es duplicación: son dos relaciones distintas que
     *  casualmente comparten valor. `relatedResource` la tienen los 7
     *  sectores y responde a "qué debe leer quien mira este sector" (en
     *  agencias/pymes/medida apunta a artículos que no son de producto);
     *  esto responde a "qué artículo describe ESTE producto". Si algún día
     *  divergen, cada uno sigue siendo correcto en su eje. */
    resourceSlug: string;
    /** Enlace a la aplicación/web en producción, con su estado (ver
     *  `LinkAvailability` en types.ts). */
    site: ExternalLink;
}

// Estado verificado en vivo el 2026-07-27. Las etiquetas (`label`) están
// escritas para que se lea a dónde va cada enlace ANTES de pulsarlo: no es
// lo mismo mandar a alguien a una web de marketing que soltarlo directo
// dentro de una aplicación con pantalla de acceso.
export const PRODUCTS: readonly Product[] = [
    {
        id: 'fiscalidad',
        name: 'Fiscalidad',
        sectorId: 'asesorias',
        resourceSlug: 'fiscalidad-plataforma-fiscal-contable',
        // ⛔ ENLACE DESACTIVADO — INTERRUPTOR, NO AMPUTACIÓN.
        //
        // Qué pasó: el 2026-07-27, https://fiscalidad.mcpopspilot.org sirve
        // una PANTALLA EN BLANCO. La consola del navegador escupe:
        //   "Faltan las variables de entorno VITE_SUPABASE_URL y
        //    VITE_SUPABASE_ANON_KEY"
        // O sea: el despliegue no tiene configuradas las variables de entorno
        // de Supabase, la app no arranca y el visitante ve una página vacía.
        // No es un fallo de esta web, es del despliegue del producto.
        //
        // Qué hace `availability: 'down'`: ningún enlace a esta URL se
        // renderiza en NINGUNA superficie. Ni en /soluciones, ni en /casos,
        // ni el bloque `link` del final de su propio artículo en
        // src/lib/resources.ts (lo filtra ResourceDetail.tsx consultando este
        // registro; no hay ningún `if` con el nombre "Fiscalidad" dentro,
        // funciona igual para cualquier producto que se marque `down`).
        //
        // Lo que NO hace: borrar nada. La ficha sigue aquí, el artículo sigue
        // publicado e indexable, el sector `asesorias` sigue apuntando a él.
        // Solo desaparece el enlace que llevaría a una pantalla en blanco.
        //
        // CÓMO REACTIVARLO: arreglar el despliegue (definir VITE_SUPABASE_URL
        // y VITE_SUPABASE_ANON_KEY en el entorno del producto), comprobar que
        // la URL carga, y cambiar aquí abajo 'down' por 'live'. Una línea.
        site: {
            url: 'https://fiscalidad.mcpopspilot.org',
            label: 'Ver Fiscalidad en fiscalidad.mcpopspilot.org',
            availability: 'down',
        },
    },
    {
        id: 'energydeal',
        name: 'EnergyDeal',
        sectorId: 'energia',
        resourceSlug: 'energydeal-crm-energetico',
        // Es el único de los cuatro con web de marketing PROPIA y completa
        // (Funcionalidades, Precios, Blog) y con su propio SEO — verificado
        // en vivo. Por eso el enlace se puede ofrecer a tráfico frío sin
        // ninguna advertencia: aterriza en una página de venta, no en un
        // formulario de acceso.
        site: {
            url: 'https://energydeal.es',
            label: 'Ver la web de EnergyDeal',
            availability: 'live',
        },
    },
    {
        id: 'presupuestador',
        name: 'Presupuestador',
        // TODO(negocio): confirmar el nombre público. La web dice
        // "Presupuestador" (aquí, en el título del artículo de /recursos y en
        // el copy del sector reformas); el producto real, una vez dentro, se
        // llama "PresupuesYa". Son dos marcas distintas para la misma cosa y
        // el visitante que pulse el enlace lo va a notar. No lo decide el
        // código: decide negocio cuál de los dos gana. Cuando esté decidido,
        // se cambia el `name` de esta línea y queda propagado a todas las
        // superficies que lo pintan — el título del artículo y el copy del
        // sector son textos editoriales y se cambian aparte, a mano.
        sectorId: 'reformas',
        resourceSlug: 'presupuestador-obra-bc3',
        // Vivo, pero abre directo en /dashboard: es la APLICACIÓN, no una
        // página de venta. La etiqueta lo dice para que nadie llegue creyendo
        // que va a leer características.
        site: {
            url: 'https://presupuestador.mcpopspilot.org',
            label: 'Entrar en la aplicación de Presupuestador',
            availability: 'live',
        },
    },
    {
        id: 'erp-hosteleria',
        name: 'ERP Hostelería',
        sectorId: 'hosteleria',
        resourceSlug: 'erp-hosteleria-tpv-restaurantes',
        // Mismo caso que Presupuestador: vivo, pero abre en /dashboard.
        site: {
            url: 'https://erp.mcpopspilot.org',
            label: 'Entrar en la aplicación de ERP Hostelería',
            availability: 'live',
        },
    },
];

/** ¿Se puede pintar este enlace HOY?
 *
 *  Es un type guard, no un booleano suelto, para que el llamante se quede
 *  con el `ExternalLink` ya estrechado y no tenga que repetir el `&&` para
 *  convencer a TypeScript de que no es `undefined`.
 *
 *  Acepta `undefined` a propósito: el 99% de las llamadas son sobre un campo
 *  opcional (`sector.productId` puede no existir, `case.productionLink`
 *  puede no existir), y obligar a cada consumidor a comprobarlo antes es
 *  repartir la misma condición por toda la app. Aquí, una sola vez.
 *
 *  ÚNICO punto donde se decide si un destino externo es enlazable. Todo lo
 *  que quiera enlazar fuera pasa por aquí — así "apagar" un producto es
 *  cambiar un dato, no cazar renders. */
export function isLinkable(link: ExternalLink | undefined): link is ExternalLink {
    return link !== undefined && link.availability === 'live';
}

export function getProduct(id: ProductId): Product | undefined {
    return PRODUCTS.find((p) => p.id === id);
}

/** Normaliza para comparar URLs escritas a mano en sitios distintos: quita
 *  espacios, mayúsculas y la barra final. No toca query ni hash — si algún
 *  día un enlace lleva parámetros, que NO empareje es lo correcto: sería una
 *  URL distinta y merece una decisión consciente. */
function normalizeUrl(url: string): string {
    return url.trim().toLowerCase().replace(/\/+$/, '');
}

/** Busca el producto al que apunta una URL suelta.
 *
 *  Existe por un motivo concreto: los artículos de /recursos llevan sus
 *  enlaces a producción escritos como bloques `type: 'link'` con la URL a
 *  pelo (src/lib/resources.ts). Ese copy editorial no se reescribe, pero
 *  tampoco puede saltarse el interruptor de disponibilidad — si Fiscalidad
 *  está caída, su enlace no debe pintarse TAMPOCO al final de su artículo.
 *  ResourceDetail.tsx resuelve cada URL externa contra este registro antes
 *  de pintarla. Genérico: vale para los 4 productos y para los que vengan. */
export function getProductByUrl(url: string): Product | undefined {
    const target = normalizeUrl(url);
    return PRODUCTS.find((p) => normalizeUrl(p.site.url) === target);
}
