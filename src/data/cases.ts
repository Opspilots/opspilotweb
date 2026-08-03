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
// como en la de Casos: una mini-interfaz FIJA por caso que representa la web
// ENTREGADA a ese cliente, con SU paleta y con la forma de lo que es. Ya no
// pasa por MockPreview (la maqueta genérica de OpsPilot) — ver el bloque de
// contexto de `CaseShowcase` en types.ts.
import type { Case, CaseSiteTheme, ServiceLine } from './types';

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
   LAS TRES PALETAS, LEÍDAS DE LAS TRES WEBS
   ═══════════════════════════════════════════════════════════════════════
   Valores tomados entrando en cada sitio. Son un HECHO sobre una web en
   producción, igual que sus nombres de sección, y por eso viven aquí y no
   incrustados en el CSS: una maqueta nueva entra sin tocar una línea de
   estilos (ver `CaseSiteTheme` en types.ts y el contrato de color en la
   cabecera de CaseMockPanel.module.css).

   RATIOS. Cada tema anota los pares que el render usa para TEXTO, y todos
   cumplen 4.5:1 (AA, texto normal). Las figuras mudas —barras, celdas,
   huecos— van `aria-hidden` y no dicen nada, así que no se les exige
   contraste de texto; el criterio es el mismo que ya gobierna las figuras de
   ProductPreview. */

/** ObraFácil — obrafacil2025.es. Tienda online.
 *
 *  El amarillo de señalización es toda su identidad, y trae una trampa que
 *  hay que decir en voz alta: `#F5D800` sobre blanco da 1.43:1. NO CUMPLE ni
 *  para texto ni para elemento no textual, así que el amarillo aquí no toca
 *  jamás el fondo claro por su cuenta — va SIEMPRE relleno con tinta casi
 *  negra encima (13.6:1) o pegado a la cabecera negra. Es lo mismo que hace
 *  la tienda: su amarillo vive en botones y sobre el hero oscuro.
 *
 *  Medidos:
 *    · texto #0D0D0D sobre blanco .................. 19.4:1
 *    · muted #57534E sobre blanco ...................  7.6:1
 *    · muted #57534E sobre raised #F1F0EA ...........  6.7:1
 *    · chromeInk #FAFAF8 sobre chrome #0D0D0D ....... 18.6:1
 *    · actionInk #0D0D0D sobre action #F5D800 ....... 13.6:1 */
const THEME_OBRAFACIL: CaseSiteTheme = {
    source: 'site',
    scheme: 'light',
    bg: 'rgb(250, 250, 248)',
    surface: '#ffffff',
    raised: '#f1f0ea',
    line: 'rgba(13, 13, 13, 0.13)',
    text: '#0d0d0d',
    // Derivado: gris CÁLIDO y no neutro. Un gris azulado al lado de este
    // amarillo se ve verdoso, y el sitio es cálido de arriba abajo.
    muted: '#57534e',
    accent: 'rgb(245, 216, 0)',
    accentSoft: 'rgba(245, 216, 0, 0.24)',
    // El botón real de la tienda: amarillo con tinta casi negra.
    action: 'rgb(245, 216, 0)',
    actionInk: '#0d0d0d',
    // Su hero es casi negro, y esa banda es lo primero que identifica a la
    // tienda: es la única de las tres maquetas con cabecera oscura.
    chrome: '#0d0d0d',
    chromeInk: 'rgb(250, 250, 248)',
    glow: '0 8px 22px -12px rgba(13, 13, 13, 0.28)',
};

/** J.R. Rodríguez e Hijos — rodriguezreformas.es. Web de captación local.
 *
 *  Verde oliva natural sobre blanco y crema: una paleta cálida y apagada que
 *  no se confunde ni con el amarillo saturado de ObraFácil ni con el azul
 *  frío de EnergyDeal, que era justo lo que fallaba antes.
 *
 *  EL PAR DE ACCIÓN NO ES EL OLIVA, y merece explicación porque es una
 *  desviación consciente respecto a su web: sus botones son oliva con texto
 *  blanco, o sea 3.86:1, por debajo de AA. Copiar ese par sería importar un
 *  defecto de accesibilidad ajeno a una web nuestra; oscurecer el oliva sería
 *  inventarle un color que no tiene. Así que el botón usa OTRO par suyo —el
 *  carbón del cuerpo con la crema de su titular, 10.6:1— y el oliva se queda
 *  donde sí cumple: filos, marcadores, tintes e iconos (3.86:1 sobre blanco,
 *  por encima del 3:1 de elementos no textuales).
 *
 *  Medidos:
 *    · texto #2F3130 sobre blanco ................... 13.6:1
 *    · muted #4F4F4C sobre blanco ...................  8.2:1
 *    · muted #4F4F4C sobre crema #E9E7E0 ............  6.6:1
 *    · actionInk #E9E7E0 sobre action #2F3130 ....... 10.6:1
 *    · accent #7D865D sobre blanco (solo gráfico) ...  3.9:1 */
const THEME_RODRIGUEZ: CaseSiteTheme = {
    source: 'site',
    scheme: 'light',
    bg: '#ffffff',
    surface: '#ffffff',
    // Su crema, la del titular sobre el hero. Aquí hace de banda: es lo que
    // da el aire cálido y bajo en contraste de toda la web.
    raised: '#e9e7e0',
    line: 'rgba(47, 49, 48, 0.16)',
    text: '#2f3130',
    // Derivado a partir de su gris de cuerpo (#5A5A5A). Se oscurece porque el
    // #5A5A5A sobre su propia crema se queda en 4.2:1 y aquí sí hay texto
    // secundario apoyado en la banda crema.
    muted: '#4f4f4c',
    accent: 'rgb(125, 134, 93)',
    accentSoft: 'rgba(125, 134, 93, 0.16)',
    action: '#2f3130',
    actionInk: '#e9e7e0',
    chrome: '#ffffff',
    chromeInk: '#2f3130',
    glow: '0 8px 22px -12px rgba(47, 49, 48, 0.22)',
};

/** EnergyDeal — energydeal.es. CRM vertical, tema claro y frío.
 *
 *  Estos son los MISMOS valores que `THEME_ENERGYDEAL` en products.ts, y la
 *  duplicación es deliberada, no un descuido. Aquel describe la APLICACIÓN
 *  (lo que se ve tras entrar) y este el SITIO PÚBLICO; hoy comparten sistema
 *  de diseño y por eso coinciden. Con un solo objeto compartido, el día que
 *  se rediseñe uno de los dos sin tocar el otro habría que mentir en alguno —
 *  y el campo `source` de ambos afirma justo que se han mirado por separado.
 *
 *  Medidos:
 *    · texto hsl(222 47% 11%) sobre blanco .......... 17.9:1
 *    · muted hsl(215 20% 40%) sobre blanco ..........  6.2:1
 *    · muted hsl(215 20% 40%) sobre raised ..........  5.6:1
 *    · actionInk blanco sobre action #2563EB ........  5.2:1 */
const THEME_ENERGYDEAL: CaseSiteTheme = {
    source: 'site',
    scheme: 'light',
    bg: 'hsl(210 20% 98%)',
    surface: 'hsl(0 0% 100%)',
    raised: 'hsl(210 40% 96%)',
    line: 'hsl(214 30% 88%)',
    text: 'hsl(222 47% 11%)',
    muted: 'hsl(215 20% 40%)',
    accent: 'hsl(221 83% 53%)',
    accentSoft: 'hsl(221 90% 96%)',
    action: 'hsl(221 83% 53%)',
    actionInk: 'hsl(0 0% 100%)',
    chrome: 'hsl(0 0% 100%)',
    chromeInk: 'hsl(222 47% 11%)',
    glow: '0 8px 22px -12px hsla(222 40% 25% / 0.22)',
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
        /* PUENTE GENIL, EN EL TÍTULO Y EN EL RESUMEN, Y NO SOLO EN LA
           NARRATIVA. El dato ya estaba en `text` ("desde su almacén en la
           carretera de Puente Genil a Herrera") y `text` NO se pinta en la
           portada: allí la tarjeta muestra `title` + `summary` + `bullets`, o
           sea que la única localización auténtica que tiene este caso vivía
           justo en el campo que el visitante de la home no llega a leer.

           Es un HECHO, no una etiqueta de posicionamiento: la propia tienda se
           titula «Placas decorativas de PVC sin obra | Puente Genil · Herrera».
           Se escribe "Puente Genil (Córdoba)" y no solo el municipio porque
           quien busca desde fuera de la comarca no tiene por qué situarlo, y
           porque es la provincia la que conecta este caso con los otros dos.
           Herrera se queda fuera del resumen —es de Sevilla y el almacén está
           en la carretera ENTRE los dos— para no comprimir en una línea un
           matiz que la narrativa larga ya cuenta bien. */
        title: 'Una tienda de Puente Genil que vende placas y te dice cuántas necesitas',
        summary:
            'Tienda online de placas decorativas de PVC en Andalucía, con almacén en Puente Genil (Córdoba): carrito, calculadora y WhatsApp.',
        text:
            'ObraFácil vende placas y paneles decorativos de PVC que se colocan sobre el azulejo existente, sin obra, además de palillería y suelo SPC, desde su almacén en la carretera de Puente Genil a Herrera. Vender eso por internet tiene dos frenos concretos: el catálogo es grande —más de cien imágenes de producto— y el particular que mira una placa no sabe cuántas le entran en su pared. Construimos la tienda entera alrededor de esos dos frenos: catálogo con carrito de compra, una calculadora de placas que traduce los metros de la pared a unidades, una galería de «antes y después» que enseña el resultado sobre azulejo real, página de servicios, preguntas frecuentes y un botón de WhatsApp para las dudas que no cierra una ficha de producto. La propia tienda anuncia más de 200 diseños en stock y respuesta por WhatsApp en 24 horas. Está publicada: se puede entrar y comprobarlo entero.',
        bullets: [
            'Catálogo con carrito de compra y más de cien imágenes de producto: placas de PVC, palillería y suelo SPC',
            'Calculadora de placas: el cliente sabe cuántas necesita para su pared sin echar cuentas',
            'Galería de «antes y después» sobre azulejo real, preguntas frecuentes y WhatsApp para las dudas',
        ],
        /* La maqueta se dibuja como lo que es: UNA TIENDA. Rejilla de
           producto con una ficha grande delante, las categorías de su propio
           catálogo al lado y la fila de destacados debajo — no cuatro fichas
           con icono, que es lo que había y lo que no distinguía este caso de
           los otros dos.

           SIN PRECIO, y aquí es donde más aprieta la regla: esta tienda está
           abierta, cualquiera puede entrar y comprobar lo que cuesta una
           placa. Donde iría el importe va un hueco vacío (ver `.priceSlot` en
           CaseMockPanel.module.css), igual que en las figuras de
           ProductPreview. Un precio inventado en la maqueta de un cliente
           verificable es exactamente la mentira que esta web vino a quitar. */
        showcase: {
            theme: THEME_OBRAFACIL,
            siteName: 'ObraFácil',
            // Tres de sus secciones de primer nivel. "Catálogo" primero
            // porque es lo que la tienda ES; en contenedor estrecho la
            // tercera se pliega sola.
            nav: ['Catálogo', 'Antes y después', 'FAQ'],
            // Su llamada a la acción, con su texto.
            cta: 'Ver catálogo',
            title: 'De la placa al pedido, sin salir de la tienda',
            sub: 'Catálogo con carrito, calculadora de placas y WhatsApp para lo que no cabe en una ficha.',
            stage: {
                kind: 'storefront',
                // Categorías REALES de su catálogo. Cuatro de las siete que
                // tiene: las que caben con su nombre entero. Las otras tres
                // no se recortan ni se inventan — se cuentan en
                // `moreCategories` como filas mudas.
                categories: [
                    'Placas Decorativas PVC',
                    'Palillería Interior',
                    'Suelos SPC',
                    'Jardines Verticales',
                ],
                moreCategories: 3,
                // Producto real de su catálogo, con su nombre y su ficha.
                product: { name: 'Calacatta Oro 260×122cm', spec: 'PVC alto brillo' },
                siblings: 3,
                // Su sección destacada de portada, en sus versalitas.
                featured: 'LO MÁS VENDIDO',
                // La pieza que esta tienda tiene y una tienda cualquiera no.
                // Dos huecos de entrada, vacíos: los metros de la pared son
                // del cliente, no nuestros.
                tool: { label: 'Calculadora de placas', fields: 2 },
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
        //
        // SE QUEDA SIN CIUDAD, a propósito, y va escrito porque la tentación
        // de poner "Reformas integrales · Córdoba" es evidente. Dos razones.
        // La primera es de dato: este campo es UN EJE —el ramo del cliente—
        // y al lado va el otro —la línea de servicio—; meterle una tercera
        // cosa rompe la lectura de los dos chips que tiene la tarjeta y que
        // este fichero documenta arriba. La segunda es que sería redundante:
        // la localización de este caso YA está en las dos superficies que se
        // leen de verdad, el `title` y el `summary` de aquí abajo, que dicen
        // Córdoba los dos. Añadirla una tercera vez en la misma tarjeta no
        // posiciona más, solo suena a relleno.
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
        /* La maqueta NO es una rejilla de servicios: es un MAPA DE PÁGINAS.
           Aquí la arquitectura del sitio es literalmente el argumento del
           caso —una página por servicio y ciudad— y dibujarlo como tres
           chips con icono, que es lo que había, tiraba a la basura lo único
           que hay que contar. Ahora se ven las CUATRO rutas reales, con sus
           barras, y una de ellas abierta por dentro: hueco de imagen del
           hero, texto, la pareja «antes / después» y el formulario.

           Las cuatro rutas responden 200, verificado. La ruta es el dato:
           escribirla mal sería enviar a comprobar algo que no existe. Y falta
           a propósito /calculadora-gratuita/, que hoy devuelve 404 — ver el
           TODO(negocio) del final del fichero. */
        showcase: {
            theme: THEME_RODRIGUEZ,
            siteName: 'J.R. Rodríguez e Hijos',
            nav: ['Servicios', 'Antes y después', 'Contacto'],
            // NO "Solicita Presupuesto Gratuito", que es su botón más visible:
            // ese apunta a /calculadora-gratuita/ y hoy da 404. Dibujarlo aquí
            // sería pintar como logro un enlace roto. WhatsApp sí funciona y
            // además con el mensaje ya escrito.
            cta: 'WhatsApp',
            title: 'Cada servicio, con su propia página',
            sub: 'Quien busca su reforma concreta aterriza en la página de esa reforma, no en una portada genérica.',
            stage: {
                kind: 'sitemap',
                routes: [
                    { path: '/reformas-banos-cordoba/', label: 'Baños y aseos' },
                    { path: '/reformas-cocinas-cordoba/', label: 'Cocinas a medida' },
                    { path: '/reformas-integrales-cordoba/', label: 'Reformas integrales' },
                    {
                        path: '/reformas-locales-comerciales-cordoba/',
                        label: 'Locales comerciales',
                    },
                ],
                // Los campos que su formulario pide de verdad, por su nombre.
                // Se dibujan como huecos VACÍOS: rellenarlos sería inventar
                // el teléfono de alguien.
                form: ['Nombre', 'Teléfono', 'Correo', 'Tu reforma'],
                direct: 'WhatsApp',
                // Secciones suyas, de cierre. "Testimonios" es una sección
                // real de su web y se queda FUERA a propósito: nombrarla
                // dentro de nuestra prueba de trabajo la convierte en prueba
                // social nuestra, que es de lo que esta web ya se deshizo.
                sections: ['¿Cómo trabajamos?', 'Zonas de actuación', 'Preguntas frecuentes'],
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
        // SIN LOCALIZACIÓN, y aquí no es un olvido de la pasada de SEO local
        // que sí tocó los otros dos casos: este cliente es `anonymous` (ver
        // abajo), y de alguien a quien no se puede nombrar tampoco se puede
        // decir de dónde es — la ciudad de un comercial de energía en un
        // sector pequeño lo identifica casi tan bien como el nombre.
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
        /* La tercera maqueta es la CONSOLA, y su forma es la densidad: tabla
           comparativa delante, la cartera jerárquica al lado y el ciclo de
           estados al pie. Puestas en fila las tres, se lee sola la
           progresión: escaparate → web de captación → herramienta de
           trabajo. Ninguna se parece a las otras dos ni en color ni en
           cantidad de información por centímetro.

           Cero cifras, como siempre: las celdas de la comparativa van vacías
           (son condiciones de tarifas de terceros que cambian en días — ver
           el propio texto del caso) y los estados son PALABRAS, no recuentos.
           Ningún CRM genérico tiene un estado llamado "revertida", así que
           las cuatro palabras hacen más trabajo de reconocimiento que
           cualquier número inventado. */
        showcase: {
            theme: THEME_ENERGYDEAL,
            siteName: 'EnergyDeal',
            // Sus tres secciones de primer nivel, tal y como se llaman dentro
            // (mismas que `preview.tabs` de energydeal en products.ts, leídas
            // con la aplicación delante).
            nav: ['Comparador', 'Clientes', 'Comisiones'],
            // Una aplicación no tiene "llamada a la acción" de portada: tiene
            // la acción del módulo abierto. La de un comparador es guardar la
            // comparativa, que es justo lo que este producto hace distinto.
            cta: 'Guardar comparativa',
            title: 'La comparativa de hace tres semanas, tal cual se hizo',
            sub: 'Comparador con la comparativa congelada, cartera por CIF y CUPS, y comisiones con estado.',
            stage: {
                kind: 'console',
                rail: { root: 'CIF', child: 'CUPS', children: 2 },
                compare: { columns: 3, rows: 4 },
                badge: 'Snapshot inmutable',
                states: ['pendiente', 'validada', 'pagada', 'revertida'],
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
