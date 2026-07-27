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
import type { ExternalLink, ProductId, ProductPreview, SectorId } from './types';

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
    /** Representación esquemática de la aplicación para la cuarta página del
     *  panel de /soluciones (ver `ProductPreview` en types.ts, donde está
     *  argumentado por qué es opcional y dónde está la línea entre ilustrar
     *  y mentir).
     *
     *  REGLA DE ORO PARA AÑADIR UNO: entra en la aplicación, mira el menú, y
     *  copia los nombres que veas. Si no puedes entrar, deja el campo fuera —
     *  la página no aparece y no pasa nada. Los cuatro de abajo se escribieron
     *  con la aplicación abierta delante el 2026-07-27. */
    preview?: ProductPreview;
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
        // La vista previa SÍ se pinta aunque el enlace esté apagado, y es una
        // decisión, no un descuido. `availability: 'down'` apaga ENLACES —
        // mandar a alguien a una pantalla en blanco es quemarlo—, no niega que
        // el producto exista: sigue teniendo ficha, artículo publicado y un
        // sector que le apunta. Un esquema de sus módulos no lleva a ninguna
        // parte, así que no puede quemar a nadie; borrarlo sería contar menos
        // verdad, no más. Lo que sí hace la página es explicar la ausencia del
        // enlace (ver `ProductPreview` / ProductPreview.tsx): con los otros
        // tres sectores enseñando enlace y este no, el silencio se leería como
        // "esto todavía no existe", que es justo lo falso.
        preview: {
            // Ámbar: el registro del papeleo. Y queda a seis posiciones del
            // otro warm (hostelería) en el carrusel de sectores, así que dos
            // paneles del mismo acento nunca se ven seguidos.
            accent: 'warm',
            tabs: ['Modelos', 'Conciliación', 'Facturas'],
            title: 'Los modelos de la AEAT y las facturas, en el mismo sitio',
            // De los ocho modelos que la aplicación presenta (303, 111, 115,
            // 130, 190, 202, 347, 390) solo sale UNO. Poner los ocho llenaría
            // la rejilla de números que nadie lee y diría "tiene muchos
            // formularios", que no es el valor. Estos cuatro cuentan la
            // historia entera de una asesoría hoy: el 303 es lo que presentas
            // por cada cliente cada trimestre —el trabajo repetitivo—; SII y
            // VeriFactu son las dos obligaciones que están OBLIGANDO al sector
            // a cambiar de software ahora mismo —el motivo de la llamada—; y
            // el OCR de tickets es la hora muerta que se recupera. Presentar,
            // cumplir, y dejar de teclear.
            block: {
                type: 'modules',
                items: [
                    { key: 'm303', icon: 'landmark', label: 'Modelo 303', active: true },
                    { key: 'sii', icon: 'documentCheck', label: 'SII' },
                    { key: 'verifactu', icon: 'shieldCheck', label: 'VeriFactu' },
                    { key: 'ocr', icon: 'scanLine', label: 'OCR tickets' },
                ],
            },
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
        // Aquí hay una trampa que conviene dejar escrita. EnergyDeal es el
        // único con web de marketing propia, y su menú (Funcionalidades ·
        // Cómo funciona · Integraciones · Precios · Blog) es lo primero que
        // uno ve. Copiar ESE menú habría sido lo fácil y habría estado mal:
        // esta página promete una vista previa del PRODUCTO, y el menú de una
        // web de venta no enseña el producto, enseña la web. Las pestañas y
        // los módulos de abajo son los de la aplicación, contrastados con lo
        // que describe su propio artículo en src/lib/resources.ts.
        preview: {
            // Azul de señal: es el acento que entró en el sistema para separar
            // ramas que compartían mint, y energía es el sector que mejor lo
            // lleva. Además evita que EnergyDeal y Presupuestador —vecinos en
            // el carrusel— se vean como el mismo producto en verde.
            accent: 'info',
            tabs: ['Comparador', 'Clientes', 'Comisiones'],
            title: 'Comparar tarifas, guardar la comparativa y cobrar la comisión',
            // Los cuatro que un CRM genérico NO tiene, que es exactamente el
            // argumento de que exista un CRM vertical. Tarifas y CUPS son el
            // vocabulario del sector —un CRM normal no sabe qué es un punto de
            // suministro—; Snapshots es el mecanismo que resuelve el problema
            // clásico ("hicimos la comparativa hace tres semanas y ya nadie
            // sabe qué se ofreció"); y Auditoría es lo que convierte la
            // liquidación de fin de mes en una consulta y no en una discusión.
            // "Comparador" y "Comisiones" ya viven arriba como pestañas: los
            // tiles no repiten, profundizan.
            block: {
                type: 'modules',
                items: [
                    { key: 'tarifas', icon: 'zap', label: 'Tarifas', active: true },
                    { key: 'cups', icon: 'plug', label: 'CUPS' },
                    { key: 'snapshots', icon: 'documentCheck', label: 'Comparativas' },
                    { key: 'auditoria', icon: 'history', label: 'Auditoría' },
                ],
            },
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
        preview: {
            accent: 'mint',
            // Las tres pestañas NO son las tres secciones más grandes de la
            // aplicación (que serían Panel y Estadísticas primero): son la
            // CADENA, y en su orden real. Presupuesto → obra → factura es el
            // recorrido entero de un trabajo de reforma, y que se lea de
            // izquierda a derecha en dos segundos vale más que enseñar el
            // dashboard. Panel, Estadísticas, Clientes/CRM, Admin y Proveedores
            // se quedan fuera por eso, no por ser secundarios.
            tabs: ['Presupuestos', 'Obras', 'Facturas'],
            title: 'Del presupuesto a la factura sin rehacer los números',
            // Si arriba va la cadena, abajo va la maquinaria que la hace
            // repetible: partidas, recursos y packs son la base de precios —lo
            // que separa un presupuesto de obra de un Word con un total al
            // final— y proveedores es de dónde salen esos precios. Es el
            // motivo por el que el segundo presupuesto cuesta un rato y no una
            // tarde, y no se puede contar con "Panel" y "Estadísticas".
            block: {
                type: 'modules',
                items: [
                    { key: 'partidas', icon: 'clipboard', label: 'Partidas', active: true },
                    { key: 'recursos', icon: 'wrench', label: 'Recursos' },
                    { key: 'packs', icon: 'layoutGrid', label: 'Packs' },
                    { key: 'proveedores', icon: 'truck', label: 'Proveedores' },
                ],
            },
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
        preview: {
            accent: 'warm',
            // De los DIECISÉIS módulos del ERP (Inicio, Inventario, Ventas,
            // Gastos, Vendedores, Catálogo, Caja, Estadísticas, Calendario,
            // Staff, Clientes, Facturas, Citas, Notificaciones, Cierre de Caja
            // y Configuración) salen siete: tres pestañas y cuatro tiles.
            // Enseñar los dieciséis diría "esto es enorme", que asusta y no
            // vende; enseñar siete dice "esto es tu turno de trabajo".
            tabs: ['Ventas', 'Inventario', 'Estadísticas'],
            title: 'La caja, el género y el turno en la misma aplicación',
            // El criterio es el DÍA DE SERVICIO, no el organigrama. Caja y
            // Cierre de Caja son la pareja que ningún software genérico cubre
            // —abrir, cobrar, cuadrar y cerrar— y es la rutina que un hostelero
            // reconoce antes de leer el titular. Catálogo es lo que alimenta
            // esa caja (la carta, los precios) y Staff el turno que la
            // atiende. Gastos, Facturas y Clientes son contabilidad: existen y
            // son útiles, pero cualquier gestor genérico las tiene y por tanto
            // no explican por qué este ERP y no otro.
            block: {
                type: 'modules',
                items: [
                    { key: 'caja', icon: 'banknote', label: 'Caja', active: true },
                    { key: 'cierre', icon: 'badgeCheck', label: 'Cierre de caja' },
                    { key: 'catalogo', icon: 'bookOpen', label: 'Catálogo' },
                    { key: 'staff', icon: 'users', label: 'Staff' },
                ],
            },
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
