// Fuente única de los 3 casos de éxito, consumidos por el carrusel de Home
// (resumen corto + bullets) y por la página /casos (narrativa larga + cita).
// Antes vivían duplicados en src/pages/Home.tsx (`const CASES`) y
// src/pages/Cases.tsx (`const CASES`), con prosa que había divergido entre
// ambos. `summary`/`bullets` (Home) y `text` (Casos) NO son una divergencia:
// son contenido distinto para usos de render distintos (resumen+lista vs.
// párrafo narrativo) y se conservan ambos tal cual, sin tocar el render de
// ninguna de las dos páginas.
//
// `showcase` alimenta CaseMockPanel (componente compartido en
// src/components/cases/CaseMockPanel.tsx), usado tanto en la tarjeta de Home
// como en la de Casos — reutiliza MockPreview (el mismo lenguaje visual del
// Paso 4 de HeroLeadWidget, ver src/components/marketing/MockPreview.tsx)
// para mostrar una mini-interfaz FIJA por caso que representa la mejora de
// ese sector.
import type { Case, ServiceLine } from './types';

/** Cómo se pinta cada línea de servicio en la tarjeta de un caso. Vive junto
 *  a los datos (mismo patrón que `NECESIDAD_LABEL`/`OBJETIVO_LABEL` en
 *  leadFunnel.ts) y no en types.ts, que es solo tipos: es una tabla de
 *  PRESENTACIÓN de 3 entradas atada 1:1 a la unión `ServiceLine`. `Record`
 *  y no un objeto suelto para que añadir una línea de servicio a la unión
 *  sin darle etiqueta no compile. */
export const SERVICE_LINE_LABEL: Record<ServiceLine, string> = {
    tienda: 'TIENDA',
    web: 'WEB',
    app: 'APP A MEDIDA',
};

/* ═══════════════════════════════════════════════════════════════════════
   TRES CASOS, TRES PROYECTOS REALES, UNA LÍNEA DE SERVICIO CADA UNO
   ═══════════════════════════════════════════════════════════════════════
   Aquí ya no conviven dos clases de caso. Hasta hace nada este fichero
   tenía cuatro entradas y tres de ellas eran COMPOSICIONES (`reformas`,
   `asesoria-fiscal`, `agencia-servicios`): resúmenes de varios proyectos
   del mismo sector, sin empresa concreta detrás, con testimonios firmados
   por un cargo genérico y con cifras de resultado que nadie había
   verificado ("triplicaron su capacidad", "el cierre sale al 80% solo",
   "20 horas cada semana"). Eso no era mentira mientras se dijera —y se
   decía, ver CasesDisclaimer— pero tampoco era una prueba: el visitante no
   podía comprobar ni una sola palabra.

   Las tres se han retirado. Lo que queda son tres proyectos que existen,
   uno por línea de servicio, y por eso esta página funciona además como
   muestrario:

     · ObraFácil          → `tienda`  → obrafacil2025.es
     · J.R. Rodríguez      → `web`     → rodriguezreformas.es
     · EnergyDeal         → `app`     → energydeal.es

   Tres y no cuatro a propósito: mejor tres fichas que se pueden abrir en
   otra pestaña que cuatro donde la última no lleva a ningún sitio.

   QUÉ SOSTIENE CADA FICHA, en el dato y no en la prosa:
     · `client` — `named` cuando el cliente se puede escribir (los dos
       primeros lo publican ellos mismos en su propia web) y `anonymous`
       cuando NO consta que se pueda. `anonymous` registra una decisión, no
       un hueco; ver `ClientDisclosure` en types.ts. Ya no hay ningún
       `composite`, y esa es exactamente la condición que apaga sola a
       CasesDisclaimer — el descargo existía para cubrir composiciones y sin
       composiciones no tiene a quién cubrir.
     · `productionLink` — los tres lo tienen, los tres `live`, los tres
       verificados entrando. Es la diferencia entre contar un caso y
       enseñarlo.
     · `serviceLine` — TIENDA / WEB / APP A MEDIDA.

   REGLA PARA AÑADIR EL SIGUIENTE: si es un cliente real, se nombra y se
   enlaza; y si no se puede enlazar, no se inventa nada para compensar. Las
   cifras de resultado (ventas, pedidos, facturación, horas ahorradas) NO
   entran aquí mientras no haya un dato de negocio verificado — es la misma
   regla que ya gobierna las maquetas (`CaseShowcase` en types.ts: ni un
   porcentaje, ni una gráfica, ni un contador). Los tres casos de abajo van
   además SIN `quote` ni `author`: ningún cliente nos ha dado una cita y
   escribírsela en la boca a empresas a las que se puede llamar por teléfono
   es peor que no tener testimonio.

   `productId` sigue vacío en los tres, y en EnergyDeal esa ausencia es
   deliberada y merece explicación — está escrita en su ficha. */

export const CASES: readonly Case[] = [
    /* ─── PRIMERO, y no por orden de llegada ────────────────────────────
       Los carruseles de la portada y de /casos enseñan UNA tarjeta a la vez
       (`flex: 0 0 100%`, sin asomo de la siguiente): la primera posición no
       es "la primera de la lista", es la única que ve quien no desliza. El
       único caso que un visitante puede verificar por su cuenta tiene que
       estar ahí. Ahora los tres lo son, así que el criterio cambia de
       "el único verificable" a "el más rápido de verificar": una tienda
       abierta al público se comprueba en diez segundos, y por eso sigue
       primera. El orden de los tres es tienda → web → app, que además es
       el orden en que crece lo que se construye.

       Datos verificados entrando en obrafacil2025.es. La regla de este
       fichero es la de siempre: si no se ha visto, no se escribe. */
    {
        id: 'obrafacil',
        // FK al sector `reformas` (el de "Reformas, instalaciones y oficios").
        // Es el encaje honesto: ObraFácil no ejecuta reformas, vende el
        // material con el que se hacen — y su cliente final es exactamente
        // quien busca reformar sin obra. `pymes` habría sido el cajón de
        // sastre y no habría dicho nada.
        sectorId: 'reformas',
        // `globe` y no `building`: `building` ya identifica al caso de la
        // empresa de reformas y aquí el hecho diferencial no es el ladrillo,
        // es que la venta ocurre en internet.
        iconKey: 'globe',
        // `label` es el SECTOR del cliente y `serviceLine` es lo que le
        // construimos: por eso aquí no pone "Tienda" (eso ya lo dice la
        // etiqueta TIENDA de al lado) sino de qué vive el negocio.
        label: 'Material de reforma',
        title: 'Una tienda que vende placas y te dice cuántas necesitas',
        summary:
            'Tienda online de placas decorativas de PVC en Andalucía, con carrito, calculadora y WhatsApp.',
        text:
            'ObraFácil vende placas y paneles decorativos de PVC que se colocan sobre el azulejo existente, sin obra, además de palillería y suelo SPC, desde su almacén en la carretera de Puente Genil a Herrera. Vender eso por internet tiene dos frenos concretos: el catálogo es grande —más de cien imágenes de producto— y el particular que mira una placa no sabe cuántas le entran en su pared. Construimos la tienda entera alrededor de esos dos frenos: catálogo con carrito de compra, una calculadora de placas que traduce los metros de la pared a unidades, una galería de «antes y después» que enseña el resultado sobre azulejo real, página de servicios, preguntas frecuentes y un botón de WhatsApp para las dudas que no cierra una ficha de producto. La propia tienda anuncia más de 200 diseños en stock y respuesta por WhatsApp en 24 horas. Está publicada: se puede entrar y comprobarlo entero.',
        bullets: [
            'Catálogo con carrito de compra y más de cien imágenes de producto: placas de PVC, palillería y suelo SPC',
            'Calculadora de placas: el cliente sabe cuántas necesita para su pared sin echar cuentas',
            'Galería de «antes y después» sobre azulejo real, preguntas frecuentes y WhatsApp para las dudas',
        ],
        showcase: {
            // `warm` con esta entrada en cabeza deja la serie alternando
            // ámbar / mint / ámbar / mint al deslizar. Dos maquetas seguidas
            // del mismo acento se leen como la misma maqueta repetida.
            accent: 'warm',
            // NO 'Tienda online': la etiqueta TIENDA de la cabecera de la
            // tarjeta queda a dos centímetros de aquí y repetir la palabra
            // gasta el único renglón que tiene la maqueta para decir algo que
            // no se sepa ya. Esto dice de qué va el producto.
            kicker: 'Comprar sin obra',
            // Los cuatro tiles son módulos que la tienda TIENE, vistos en su
            // menú y en su portada. La rejilla de `modules` es de 4 columnas
            // en escritorio y 2×2 en móvil (MockPreview.module.css), así que
            // cuatro es el número que cuadra: un quinto se quedaría solo en
            // una fila. La galería de «antes y después» es el que se queda
            // fuera y por eso se cuenta en el texto, no se dibuja a medias.
            title: 'De la placa al pedido, sin salir de la tienda',
            sub: 'Catálogo, carrito, calculadora y WhatsApp para lo que no cabe en una ficha.',
            block: {
                type: 'modules',
                items: [
                    { key: 'catalogo', icon: 'layoutGrid', label: 'Catálogo', active: true },
                    { key: 'carrito', icon: 'shoppingCart', label: 'Carrito', active: true },
                    { key: 'calculadora', icon: 'calculator', label: 'Calculadora', active: true },
                    { key: 'whatsapp', icon: 'chatMessage', label: 'WhatsApp', active: true },
                ],
            },
        },
        // SIN `quote` ni `author`, y es una decisión, no un hueco. Los dos
        // campos son opcionales en `Case` justamente para esto: el cliente no
        // nos ha dado ninguna cita y escribirle una en la boca a una empresa
        // que se puede llamar por teléfono es peor que no tener testimonio.
        // El render de /casos ya no pinta el bloque cuando faltan (ver
        // Cases.tsx) — no queda ni el filete superior de la cita.
        serviceLine: 'tienda',
        client: { kind: 'named', name: 'ObraFácil' },
        // `productId` va FUERA: ObraFácil no está construida sobre ninguno de
        // los 4 SaaS del registro (products.ts), es un desarrollo entregado al
        // cliente. El campo es opcional en `Case` precisamente para poder
        // distinguir "es uno de los nuestros" de "es suyo", así que omitirlo
        // es la respuesta correcta y no una carencia.
        productionLink: {
            url: 'https://obrafacil2025.es',
            // La etiqueta dice a dónde va ANTES de pulsar, misma regla que las
            // de products.ts: esto es una tienda abierta al público, no una
            // aplicación con pantalla de acceso.
            label: 'Entrar en la tienda de ObraFácil',
            // Verificado en vivo. Si la tienda se cae o se rediseña, esto pasa
            // a 'down' y el enlace desaparece de las dos superficies sin tocar
            // ni un render (ver `isLinkable` en products.ts).
            availability: 'live',
        },
        // `screenshots` fuera: no hay ni una captura de la tienda en el repo y
        // no se fabrican placeholders. Cuando existan, se añaden aquí y el
        // modelo ya las admite.
    },
    /* ─── SEGUNDO: la línea `web` ────────────────────────────────────────
       Datos verificados entrando en rodriguezreformas.es y recorriendo el
       menú, la galería y el formulario. Lo que NO se ha visto no está
       escrito, y hay dos ausencias que conviene dejar por escrito porque
       alguien las va a echar de menos:

         · NO hay sistema de reservas ni agenda de citas. El formulario de
           /formulario-contacto/ pide nombre, teléfono, correo, una
           descripción de la reforma y el consentimiento de contacto: es una
           petición de PRESUPUESTO, no una reserva de hueco. No hay
           calendario, ni franjas, ni confirmación automática. Por eso esta
           ficha habla de presupuesto y de WhatsApp y no de reservas.
         · NO se menciona la "calculadora de presupuesto". Los dos botones
           más visibles de su portada ("Solicita Presupuesto Gratuito" y
           "Quiero calcular un presupuesto") apuntan a /calculadora-gratuita/,
           que HOY devuelve 404. Contarla como una función del sitio sería
           enviar al visitante a comprobar algo que está roto. Ver el
           TODO(negocio) del final del fichero. */
    {
        id: 'rodriguez-reformas',
        // Mismo sector que ObraFácil y no es un error de encaje: aquel vende
        // el material con el que se reforma, este ejecuta la reforma. Son los
        // dos extremos del mismo ramo y las fichas no se pisan porque lo que
        // las separa en pantalla es la LÍNEA DE SERVICIO (TIENDA / WEB), que
        // es el eje que esta página usa como muestrario.
        sectorId: 'reformas',
        // `building` queda libre al retirarse el antiguo caso compuesto de
        // reformas, y aquí sí es literal: obra sobre vivienda y local.
        iconKey: 'building',
        // El SECTOR del cliente, no lo que le construimos (eso ya lo dice la
        // etiqueta WEB de al lado).
        label: 'Reformas integrales',
        title: 'Una página por cada reforma que se busca en Córdoba',
        summary:
            'Web de captación para una empresa de reformas de Córdoba: una página por servicio, galería de antes y después y presupuesto por formulario o WhatsApp.',
        text:
            'J.R. Rodríguez e Hijos hace reformas integrales, cocinas, baños y locales comerciales en Córdoba capital y provincia. Un negocio así no compite por «reformas» a secas: compite por «reformas de baños en Córdoba», y esa pelea no la gana una web de una sola página por bonita que sea. La suya tiene una página propia por servicio y ciudad —reformas integrales, locales comerciales, cocinas y baños—, cada una con su título, su texto y su entrada de búsqueda, más una galería de «antes y después» donde se ve el resultado sobre obra real y un apartado de zonas de actuación con los pueblos a los que se desplazan. La captación va directa y sin intermediarios: un formulario que llega con nombre, teléfono, correo y la descripción de la reforma, y un botón de WhatsApp con el mensaje ya escrito para quien prefiere no rellenar nada. Y un bloque de preguntas frecuentes que responde por escrito lo que antes se contestaba una y otra vez por teléfono: plazos, licencias, pagos por hitos y garantía. Está publicada: se puede entrar y recorrerla entera.',
        bullets: [
            'Una página propia por servicio y ciudad: reformas integrales, locales comerciales, cocinas y baños en Córdoba',
            'Galería de «antes y después» sobre obra real y zonas de actuación de la provincia',
            'Presupuesto por formulario con los datos ya ordenados, o por WhatsApp con el mensaje escrito',
        ],
        showcase: {
            // `mint` entre dos ámbares: la serie queda ámbar / mint / ámbar al
            // deslizar y ninguna maqueta se lee como la repetición de la
            // anterior. Es el mismo criterio que ya justificaba el `warm` de
            // ObraFácil, solo que ahora aplicado a una serie de tres.
            accent: 'mint',
            kicker: 'Búsqueda local',
            title: 'Cada servicio, con su propia página',
            sub: 'Quien busca su reforma concreta aterriza en la página de esa reforma.',
            block: {
                // `services` y no `modules`: esto es una WEB pública, no un
                // panel de gestión, y lo que la hace reconocible a un
                // profesional del oficio son los nombres de servicio, no una
                // rejilla de módulos. Los iconos siguen el vocabulario que ya
                // fijó la rama "reformas" del embudo (src/data/leadFunnel.ts):
                // `building` para la reforma integral, `hammer` para la obra,
                // `wrench` para baños y cocinas. Repetirlo aquí no es pereza,
                // es que el mismo oficio se dibuja igual en las dos
                // superficies.
                //
                // Tres chips para cuatro páginas reales, y es deliberado: el
                // bloque `services` de este sistema va siempre de tres (ver
                // las cuatro ramas del embudo) y la maqueta no es un mapa del
                // sitio. Cocinas y baños comparten chip porque comparten
                // icono; las cuatro páginas se enumeran donde sí caben, en el
                // texto y en los bullets.
                type: 'services',
                items: [
                    { key: 'integrales', icon: 'building', label: 'Reformas integrales' },
                    { key: 'locales', icon: 'hammer', label: 'Locales comerciales' },
                    { key: 'banos-cocinas', icon: 'wrench', label: 'Cocinas y baños' },
                ],
            },
        },
        // Sin `quote` ni `author`, misma decisión que en ObraFácil: no nos han
        // dado ninguna cita. Su web sí publica testimonios firmados por
        // clientes suyos, pero son SUS testimonios sobre SU obra — traerlos
        // aquí y presentarlos como prueba de nuestro trabajo sería apropiarse
        // de un elogio ajeno.
        serviceLine: 'web',
        // El nombre lo publican ellos mismos en su propia web, en el título,
        // en el pie y en la ficha de Google del mapa. No hay nada que
        // proteger, así que `named`.
        client: { kind: 'named', name: 'J.R. Rodríguez e Hijos' },
        productionLink: {
            url: 'https://rodriguezreformas.es',
            // "Ver la web" y no "Entrar en la tienda" (ObraFácil): la etiqueta
            // dice a dónde va ANTES de pulsar y aquí no se compra nada.
            label: 'Ver la web de J.R. Rodríguez',
            // Verificado en vivo: portada, las cuatro páginas de servicio, la
            // galería y el formulario responden 200.
            availability: 'live',
        },
    },
    /* ─── TERCERO: la línea `app` ────────────────────────────────────────
       Y aquí hay una confusión fácil que hay que cortar de raíz: energydeal.es
       es HOY una web de producto que se vende a corredurías de seguros, con
       sus precios y su blog. ESO NO ES EL CASO. El caso es el PROYECTO que
       lo originó — un desarrollo a medida para un agente comercial del sector
       energético— y es lo único que se cuenta abajo. Contar el catálogo
       actual en la ficha de un caso sería vender producto disfrazado de
       prueba de trabajo.

       Datos verificados entrando en energydeal.es y contrastados con lo que
       ya describen sus dos artículos de /recursos (`energydeal-crm-energetico`
       y `caso-energydeal-comercializadora-excel` en src/lib/resources.ts) y
       con los módulos que su ficha de producto lista tras entrar en la
       aplicación (`preview` de `energydeal` en src/data/products.ts). */
    {
        id: 'energydeal',
        sectorId: 'energia',
        iconKey: 'zap',
        label: 'Comercial de energía',
        title: 'Un CRM que sabe qué es un CUPS',
        summary:
            'Software a medida para un agente comercial de luz y gas: comparador con la comparativa congelada, cartera por CIF y CUPS, y comisiones con estado.',
        text:
            'EnergyDeal nació como desarrollo a medida para un agente comercial del sector energético: alguien que compara y vende tarifas de luz y gas de varias comercializadoras a la vez y a quien ningún CRM del mercado le servía, porque ningún CRM del mercado sabe qué es un CUPS. Los dos problemas que había que resolver eran muy concretos. El primero: una comparativa deja de ser reproducible en cuanto las tarifas se mueven —cosa que pasa en días— mientras que un cliente empresa tarda semanas en firmar, así que cuando llega la reclamación nadie puede demostrar qué condiciones se ofrecieron realmente. Se resolvió congelando cada comparativa en un snapshot inmutable, con sus tarifas, sus condiciones y su fecha exacta. El segundo: la liquidación de comisiones a fin de mes se hacía de memoria, comparando notas sueltas. Se modeló el ciclo entero con estados explícitos —pendiente, validada, pagada, revertida— y un registro de auditoría, para que el cierre sea una consulta y no una discusión. Alrededor de eso, la cartera se organiza por CIF con sus CUPS y puntos de suministro colgando de cada cliente, y las tarifas entran por un proceso de carga masiva desde los PDF de la comercializadora en vez de copiarse a mano. Hoy EnergyDeal tiene web pública propia y se puede entrar a verla.',
        bullets: [
            'Comparador multi-proveedor que guarda cada comparativa en un snapshot inmutable, reproducible meses después aunque las tarifas hayan cambiado',
            'Cartera organizada por CIF, con los CUPS y puntos de suministro de cada cliente — vocabulario que un CRM genérico no tiene',
            'Comisiones con estados explícitos (pendiente, validada, pagada, revertida) y registro de auditoría de toda la actividad',
        ],
        showcase: {
            accent: 'warm',
            kicker: 'Vertical, no genérico',
            title: 'La comparativa de hace tres semanas, tal cual se hizo',
            sub: 'Comparador, suministros por CUPS y comisiones con estado.',
            block: {
                // Los cuatro nombres son de módulos que la aplicación tiene de
                // verdad: "Comparador" y "Comisiones" son dos de sus tres
                // secciones de primer nivel y "CUPS" y "Auditoría" dos de sus
                // módulos (ver `preview` de energydeal en products.ts, leído
                // con la aplicación delante). Cuatro y no cinco porque la
                // rejilla de `modules` es de 4 columnas en escritorio y 2×2 en
                // móvil (MockPreview.module.css).
                type: 'modules',
                items: [
                    { key: 'comparador', icon: 'documentCheck', label: 'Comparador', active: true },
                    { key: 'cups', icon: 'plug', label: 'CUPS', active: true },
                    { key: 'comisiones', icon: 'banknote', label: 'Comisiones', active: true },
                    { key: 'auditoria', icon: 'history', label: 'Auditoría', active: true },
                ],
            },
        },
        serviceLine: 'app',
        // `anonymous` y NO `named`: nadie ha confirmado que el agente comercial
        // para el que se construyó esto se pueda nombrar públicamente. El campo
        // registra esa DECISIÓN (ver `ClientDisclosure` en types.ts); dejarlo
        // fuera habría registrado un olvido, que es otra cosa. Si mañana consta
        // el permiso, se cambia una línea.
        client: { kind: 'anonymous' },
        // `productId: 'energydeal'` NO va, y no por descuido. Ese campo
        // significa "el caso se construyó SOBRE uno de nuestros productos", y
        // aquí el producto no es el cimiento: es el resultado. Además tiene una
        // consecuencia de render que lo confirma — /casos pinta `productId` y
        // `productionLink` uno al lado del otro (ver `cardLinks` en Cases.tsx)
        // y ambos resolverían a la MISMA url, energydeal.es, o sea dos enlaces
        // gemelos en la misma tarjeta; y la portada no pinta `productId` en
        // absoluto, así que el caso se quedaría allí sin salida a producción.
        productionLink: {
            url: 'https://energydeal.es',
            // Misma etiqueta que usa la ficha de producto para esta URL (ver
            // `site` de energydeal en products.ts): es el mismo destino y
            // llamarlo de dos maneras distintas en el mismo sitio solo confunde.
            label: 'Ver la web de EnergyDeal',
            availability: 'live',
        },
    },
];

/* TODO(negocio), lo único que queda abierto y no lo decide el código:

   · rodriguezreformas.es sirve un 404 en /calculadora-gratuita/, y ahí es
     donde apuntan los DOS botones principales de su portada ("Solicita
     Presupuesto Gratuito" en el hero y "Quiero calcular un presupuesto" en
     el cierre). Es un problema del sitio del cliente, no de esta ficha —que
     por eso no menciona la calculadora—, pero conviene avisarles: hoy su
     llamada a la acción más visible lleva a una página que no existe.

   · Si el agente comercial de EnergyDeal autoriza que se le nombre, su
     `client` pasa de `anonymous` a `{ kind: 'named', name: '…' }` y la
     tarjeta empieza a pintar el nombre sola, en las dos superficies. */

export function getCase(id: string): Case | undefined {
    return CASES.find((c) => c.id === id);
}
