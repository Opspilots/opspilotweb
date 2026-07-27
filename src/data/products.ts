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
import type { ExternalLink, ProductId, ProductPreview, ProductTheme, SectorId } from './types';

/* ═══════════════════════════════════════════════════════════════════════
   LAS PALETAS DE LAS APLICACIONES — leídas de cada `:root` en producción
   ═══════════════════════════════════════════════════════════════════════
   Contexto de por qué esto entra. La primera versión de la vista previa
   pintaba los cuatro productos con los tokens de OpsPilot (mint/ámbar/azul
   de variables.css). El resultado fue el que tenía que ser y así se
   describió: "son bastante básicas y similares entre ellas". Y con razón —
   eran el mismo componente cuatro veces.

   Un producto no se reconoce por su icono. Se reconoce por su temperatura:
   el ERP de hostelería es verde casi neón sobre azul marino porque se mira
   a las once de la noche con la cocina encendida; PresupuesYa es ámbar
   sobre un negro CÁLIDO, no neutro; EnergyDeal es azul sobre blanco, tema
   CLARO, porque es el único de los cuatro con web de marketing propia y
   vive a plena luz. Esas tres decisiones no las tomamos nosotros: ya están
   tomadas, en producción, y esto solo las copia.

   DE DÓNDE SALEN: se entró en cada aplicación y se leyeron sus variables
   CSS. Los valores van en `hsl()` tal cual estaban escritos —sin
   normalizar a hex— para que un `grep` del valor encuentre lo mismo aquí y
   en el `:root` del producto.

   QUÉ NO SALE DE AHÍ: `muted`, `line`, `accentInk`, `accentSoft` y `glow`.
   Las aplicaciones declaran `--muted` como una SUPERFICIE, no como un color
   de texto, y ninguna publica un token de "gris secundario legible". Esos
   cinco son derivados nuestros, elegidos dentro de la familia de cada
   producto y medidos: `muted` cumple 4.5:1 sobre `surface` en las cuatro.
   Están marcados uno a uno más abajo.

   Ver `ProductTheme` en types.ts para qué significa cada campo y, sobre
   todo, para qué hace `source`. */

/** ERP Hostelería — erp.mcpopspilot.org. Tema OSCURO.
 *  Verde casi neón sobre azul marino: el contraste más agresivo de los
 *  cuatro, y es exactamente lo que pide una pantalla que se mira de reojo
 *  entre dos comandas. */
const THEME_ERP: ProductTheme = {
    source: 'app',
    scheme: 'dark',
    bg: 'hsl(216 35% 8%)', //         --background
    surface: 'hsl(215 32% 12%)', //   --card
    raised: 'hsl(215 28% 16%)', //    --muted (superficie, no texto)
    line: 'hsl(215 25% 22%)', //      derivado — un escalón por encima de raised
    text: 'hsl(215 15% 92%)', //      --foreground
    muted: 'hsl(215 14% 68%)', //     derivado — medido sobre `surface`
    accent: 'hsl(145 100% 50%)', //   --accent / --secondary / --ring
    // Tinta OSCURA sobre el verde: con 50% de luminosidad y saturación
    // máxima, el blanco encima de este verde no llega ni a 2:1. El azul
    // marino del propio producto sí, y de paso es suyo.
    accentInk: 'hsl(216 35% 8%)',
    accentSoft: 'hsla(145 100% 50% / 0.12)',
    glow: '0 10px 30px -14px hsla(145 100% 50% / 0.45)',
};

/** PresupuesYa — presupuestador.mcpopspilot.org. Tema OSCURO CÁLIDO.
 *  El detalle que lo separa del ERP no es el ámbar, es el FONDO: hsl(30 8% 7%)
 *  es un negro con temperatura, no el gris azulado de todo el resto de la
 *  web. Puestos uno al lado del otro se nota antes que el acento. */
const THEME_PRESUPUESTADOR: ProductTheme = {
    source: 'app',
    scheme: 'dark',
    bg: 'hsl(30 8% 7%)', //           --background
    surface: 'hsl(30 8% 10%)', //     --card
    raised: 'hsl(30 8% 16%)', //      --secondary
    line: 'hsl(30 8% 21%)', //        derivado
    text: 'hsl(40 20% 96%)', //       --foreground
    muted: 'hsl(38 12% 66%)', //      derivado — medido sobre `surface`
    accent: 'hsl(38 82% 55%)', //     --primary / --ring
    accentInk: 'hsl(30 8% 7%)',
    accentSoft: 'hsl(38 55% 18%)', // --accent (el ámbar apagado del producto)
    glow: '0 10px 30px -14px hsla(38 82% 55% / 0.42)',
};

/** EnergyDeal — energydeal.es. Tema CLARO.
 *  El único, y por eso el que más trabaja: pasar de PresupuesYa a EnergyDeal
 *  en el carrusel es pasar de un negro cálido a un blanco frío. Ninguna
 *  etiqueta hace ese trabajo tan rápido como el fondo. */
const THEME_ENERGYDEAL: ProductTheme = {
    source: 'app',
    scheme: 'light',
    bg: 'hsl(210 20% 98%)', //        --background
    surface: 'hsl(0 0% 100%)', //     --card
    raised: 'hsl(210 40% 96%)', //    --secondary / --accent
    line: 'hsl(214 30% 88%)', //      derivado
    text: 'hsl(222 47% 11%)', //      --foreground
    muted: 'hsl(215 20% 40%)', //     derivado — medido sobre `surface` (blanco)
    accent: 'hsl(221 83% 53%)', //    --primary / --ring (#2563EB)
    accentInk: 'hsl(0 0% 100%)',
    accentSoft: 'hsl(221 90% 96%)',
    // Sombra GRIS y no tintada: en tema claro un halo de color no se lee como
    // brillo, se lee como suciedad alrededor de la caja.
    glow: '0 8px 22px -12px hsla(222 40% 25% / 0.22)',
};

/** Fiscalidad — PALETA PROVISIONAL, y esto hay que leerlo entero.
 *
 *  A las otras tres se les leyó el `:root` con la aplicación abierta
 *  delante. A esta NO SE PUDO: fiscalidad.mcpopspilot.org sirve una pantalla
 *  en blanco porque le faltan las variables de entorno de Supabase (ver el
 *  bloque del enlace desactivado más abajo). La aplicación nunca monta, así
 *  que nunca llega a declarar sus variables. No hay nada que copiar.
 *
 *  Dos salidas y por qué se eligió esta:
 *
 *  (a) Dejarla con la paleta de OpsPilot. Es la opción de "no inventamos
 *      nada"... y reintroduce el problema entero: mint sobre azul marino
 *      queda a un paso del verde neón sobre azul marino del ERP, o sea que
 *      dos de los cuatro paneles volverían a parecer el mismo. Arreglar la
 *      similitud en tres productos y recrearla en el cuarto no es arreglarla.
 *
 *  (b) Darle una identidad propia y DECIRLO. Es lo que está aquí. Tinta
 *      oscura fría + rojo lacre + una hoja de papel como protagonista: el
 *      mundo del registro, el sello y el modelo presentado, que es el
 *      dominio de la aplicación. No imita a la AEAT ni a ningún organismo
 *      —eso sería suplantar una marca ajena, otro problema distinto y peor—:
 *      evoca el oficio, no la institución.
 *
 *  Lo que hace honesta a (b) no es el gusto, es `source: 'provisional'`: el
 *  render lo lee y CAMBIA LA NOTA VISIBLE bajo el esquema para decir que el
 *  color todavía no es el suyo (ver ProductPreview.tsx). Un color inventado
 *  presentado como el del producto sería una captura falsa en miniatura; un
 *  color inventado que se anuncia como provisional no afirma nada.
 *
 *  CÓMO CERRARLO: cuando el despliegue arranque, se entra, se lee el `:root`
 *  igual que en los otros tres, se sustituyen estos valores y se cambia
 *  `source` a 'app'. La nota se apaga sola. */
const THEME_FISCALIDAD: ProductTheme = {
    source: 'provisional',
    scheme: 'dark',
    bg: 'hsl(230 28% 8%)',
    surface: 'hsl(230 24% 12%)',
    raised: 'hsl(230 20% 17%)',
    line: 'hsl(230 20% 22%)',
    // Blanco CÁLIDO, y no por capricho: es el mismo valor que usa la hoja del
    // esquema como fondo (ver `sheet` en ProductPreview.module.css). Un
    // blanco azulado ahí no parece papel, parece un cuadro de diálogo.
    text: 'hsl(38 20% 94%)',
    muted: 'hsl(230 12% 64%)',
    accent: 'hsl(4 72% 60%)', //      rojo lacre
    // Tinta OSCURA sobre el rojo, y esto se midió antes de escribirlo: blanco
    // sobre este rojo da 3.6:1 y las etiquetas del esquema son de 10px, o sea
    // por debajo del mínimo. El mismo ink del fondo da 5.2:1. Bajar el rojo
    // para que el blanco cumpliera lo habría dejado por debajo de 4.5 contra
    // la superficie, que es donde más se usa. Gana el ink oscuro.
    accentInk: 'hsl(230 28% 8%)',
    accentSoft: 'hsla(4 72% 60% / 0.14)',
    glow: '0 10px 30px -14px hsla(4 72% 60% / 0.40)',
};

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
            theme: THEME_FISCALIDAD,
            nav: 'secciones',
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
            //
            // El 303 sube a protagonista y se dibuja como lo que es: una HOJA
            // con casillas. Es la única composición clara-sobre-oscura de los
            // cuatro productos, y se reconoce sin leer una palabra — un modelo
            // oficial es papel, no una tarjeta de dashboard. Las casillas van
            // VACÍAS, obviamente: rellenarlas sería inventar la declaración de
            // alguien.
            stage: { kind: 'sheet', module: 'Modelo 303', icon: 'landmark', rows: 4 },
            modules: [
                { key: 'sii', icon: 'documentCheck', label: 'SII' },
                { key: 'verifactu', icon: 'shieldCheck', label: 'VeriFactu' },
                { key: 'ocr', icon: 'scanLine', label: 'OCR tickets' },
            ],
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
            // El ÚNICO tema claro de los cuatro, y su mejor argumento visual:
            // deslizar de PresupuesYa (negro cálido) a EnergyDeal (blanco
            // frío) no se puede confundir con "la misma maqueta otra vez".
            theme: THEME_ENERGYDEAL,
            nav: 'secciones',
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
            // módulos no repiten, profundizan.
            //
            // Sube a protagonista Comparativas y NO Tarifas, aunque Tarifas
            // fuera el que estaba marcado activo antes. Motivo: la figura que
            // le toca a este producto es un comparador —columnas enfrentadas—
            // y eso es literalmente lo que es una comparativa guardada. Una
            // lista de tarifas se dibujaría como una lista cualquiera, o sea
            // como el ERP. La forma tiene que decir algo o sobra.
            stage: { kind: 'compare', module: 'Comparativas', icon: 'documentCheck', rows: 3 },
            modules: [
                { key: 'tarifas', icon: 'zap', label: 'Tarifas' },
                { key: 'cups', icon: 'plug', label: 'CUPS' },
                { key: 'auditoria', icon: 'history', label: 'Auditoría' },
            ],
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
            theme: THEME_PRESUPUESTADOR,
            // `cadena` y no `secciones`: las tres pestañas de aquí abajo son
            // un recorrido en orden, no tres sitios independientes, y hasta
            // ahora se pintaban como tres pestañas sueltas — o sea que el
            // argumento entero del producto se perdía en la maqueta. Ver
            // `PreviewNav` en types.ts.
            nav: 'cadena',
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
            //
            // Partidas es el protagonista y se dibuja como un ÁRBOL CON
            // SANGRÍA. Esa sangría es el producto: un presupuesto de obra es
            // capítulo → partida → recurso, y eso es exactamente lo que un
            // Word con un total al final no tiene. Sin cifras: las columnas de
            // precio son huecos, no números.
            stage: { kind: 'tree', module: 'Partidas', icon: 'clipboard', rows: 5 },
            modules: [
                { key: 'recursos', icon: 'wrench', label: 'Recursos' },
                { key: 'packs', icon: 'layoutGrid', label: 'Packs' },
                { key: 'proveedores', icon: 'truck', label: 'Proveedores' },
            ],
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
            theme: THEME_ERP,
            // `rail` —barra lateral— y no pestañas: es la forma que toma una
            // aplicación con DIECISÉIS módulos, y aquí la barra lateral no es
            // un adorno, es la prueba de que hay más de lo que cabe arriba.
            nav: 'rail',
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
            //
            // Caja abierta como protagonista, dibujada como LISTA DE LÍNEAS:
            // es la pantalla en la que un hostelero pasa el turno entero. Las
            // líneas van sin texto y sin importes —forma, no dato— y la última
            // es el total, marcada con el acento pero igual de vacía. Ni un
            // euro en toda la figura.
            // Tres líneas y el total, no cuatro y el total: es el único
            // producto con barra lateral, así que sus módulos secundarios
            // bajan al pie y a la figura le quedan ~63px medidos. Con cinco
            // filas ahí dentro cada una caía a 9.4px —por debajo de la marca
            // de 9px que llevan a la izquierda— y la lista se leía como una
            // trama, no como líneas. Con cuatro respiran a 12.8px.
            stage: { kind: 'ledger', module: 'Caja', icon: 'banknote', rows: 3 },
            modules: [
                { key: 'cierre', icon: 'badgeCheck', label: 'Cierre de caja' },
                { key: 'catalogo', icon: 'bookOpen', label: 'Catálogo' },
                { key: 'staff', icon: 'users', label: 'Staff' },
            ],
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
