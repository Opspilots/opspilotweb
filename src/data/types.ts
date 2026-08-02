// Tipos de datos puros (sin React) para el contenido de Soluciones/Home/Casos.
// Los iconos se referencian por clave (`IconKey`) y se resuelven a componentes
// lucide-react en `src/components/icons/registry.tsx` — así estos módulos de
// datos son serializables y no arrastran React ni lucide como dependencia.

export type SectorId =
    | 'asesorias'
    | 'energia'
    | 'reformas'
    | 'agencias'
    | 'pymes'
    | 'medida'
    | 'hosteleria';

export type IconKey =
    | 'clipboard'
    | 'zap'
    | 'building'
    | 'target'
    | 'globe'
    | 'settings'
    | 'calculator'
    | 'utensils';

export interface ProcessStep {
    title: string;
    description: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   Pruebas de producto: capturas, enlaces a producción y línea de servicio
   ═══════════════════════════════════════════════════════════════════════
   Contexto de por qué esto entra ahora. Hasta hoy ni `Sector` ni `Case`
   tenían UN SOLO campo capaz de referenciar una imagen o una URL externa:
   el único enlace que existía era `Sector.relatedResource.slug`, que apunta
   a una ruta interna de /recursos. O sea que un caso de éxito era
   FÍSICAMENTE INCAPAZ de enseñar una captura del software o de enlazar al
   producto en producción — no era una decisión editorial, era una carencia
   del modelo. Las 5 imágenes que hay en public/images/resources/ son
   ilustraciones vectoriales abstractas (una sección de edificio estilo CAD,
   una torre de alta tensión): portadas de artículo, no producto.

   Todo lo que sigue es OPCIONAL en `Sector`/`Case` a propósito: hoy no hay
   ni una sola captura en el repo y no se van a inventar, así que las fichas
   de sectors.ts y las de cases.ts tienen que seguir siendo válidas sin tocar
   ni un campo. El modelo abre la puerta; llenarla es trabajo de negocio, no
   de tipos.

   ACTUALIZACIÓN: la puerta ya no está entera por abrir. ObraFácil
   (src/data/cases.ts) es el primer caso que ejerce `serviceLine`, `client` y
   `productionLink` con datos verificados en vivo — cliente nombrable, tienda
   publicada y enlace pulsable. `screenshots` sigue vacío en TODAS las fichas
   por el mismo motivo de siempre: no hay imágenes y no se fabrican. */

/** Identificador estable de cada producto propio de OpsPilot. Es la clave
 *  que une `Sector`/`Case` con el registro de src/data/products.ts — se
 *  referencian POR ID y nunca copiando nombre ni URL, que es justo lo que
 *  hoy pasa (el enlace vive en lib/resources.ts, el nombre en el @graph de
 *  index.html, la relación con el sector en sectors.ts: tres sitios, cero
 *  fuente única).
 *
 *  Unión cerrada y no `string`: son 4 productos contados. Con un `string`,
 *  un typo en un `productId` sería un enlace que simplemente no aparece y
 *  nadie se entera; con la unión, no compila. */
export type ProductId = 'fiscalidad' | 'energydeal' | 'presupuestador' | 'erp-hosteleria';

/** Estado de un destino externo. `down` NO significa "borrado": significa
 *  "existe, tiene ficha y artículo, pero HOY no se puede enlazar sin quemar
 *  al visitante". Es un interruptor, no una amputación (ver el caso de
 *  Fiscalidad en products.ts).
 *
 *  Dos estados y no más porque hoy solo hay dos situaciones reales
 *  observadas. Si mañana hace falta `private` (existe pero aún no es
 *  público) o `soon`, se amplía la unión y el compilador señala los sitios
 *  donde hay que decidir qué hacer con el estado nuevo. */
export type LinkAvailability = 'live' | 'down';

/** Enlace a una URL FUERA de opspilot.es (producto en producción, web de
 *  marketing propia de un producto, proyecto entregado a un cliente). */
export interface ExternalLink {
    /** URL ABSOLUTA, con esquema. No admite rutas internas: para eso ya
     *  está `relatedResource.slug` / ROUTES, que navegan con el router. */
    url: string;
    /** Texto visible del enlace. Va aquí y no en el componente porque cambia
     *  por destino ("Conocer X" vs "Entrar en X") y porque quien decide cómo
     *  se llama públicamente un producto es negocio, no el render. */
    label: string;
    /** OBLIGATORIO, no opcional con default `live`. Un default silencioso
     *  significa que quien añada un enlace roto y se olvide del campo lo
     *  publica igual; forzarlo obliga a decir "sí, lo he mirado y funciona".
     *  Son 4 URLs en todo el sitio: el coste de escribirlo es cero. */
    availability: LinkAvailability;
}

/** Encuadre con el que se pinta una captura. NO es CSS ni un componente:
 *  es una pista de qué es la imagen, para que el marco lo elija el render.
 *  Se deja como campo opcional y con solo dos valores porque hoy no existe
 *  NINGUNA captura en el repo — inventar aquí un sistema de encuadres
 *  completo sería diseñar contra cero casos reales. Cuando lleguen las
 *  primeras imágenes se verá si hace falta más. */
export type ScreenshotFrame = 'browser' | 'phone';

/** Una captura real de producto. */
export interface Screenshot {
    /** Ruta pública servida desde /public (p. ej. '/images/product/...webp'),
     *  igual que `Resource.cover` en lib/resources.ts. */
    src: string;
    /** Texto alternativo descriptivo. OBLIGATORIO por tipo, no opcional:
     *  una captura de una interfaz sin `alt` es una imagen ilegible para
     *  lector de pantalla Y para el rastreador — y "opcional" en la práctica
     *  significa "vacío". Que no compile es la única forma fiable de que se
     *  escriba. Describe QUÉ SE VE en la pantalla, no repitas el título. */
    alt: string;
    frame?: ScreenshotFrame;
}

/* ═══════════════════════════════════════════════════════════════════════
   Vista previa esquemática de un producto
   ═══════════════════════════════════════════════════════════════════════
   La cuarta página del panel de /soluciones enseña el producto del sector.
   Cuando haya capturas (`Sector.screenshots`) enseña la captura; mientras
   no las haya, enseña ESTO: los módulos que la aplicación tiene de verdad,
   dibujados con el mismo lenguaje de maqueta que ya usan el embudo del hero
   y las tarjetas de casos (MockPreview).

   DÓNDE ESTÁ LA LÍNEA entre ilustrar y mentir, que es la pregunta que
   gobierna todo este fichero: una ilustración no finge ser una fotografía
   —la maqueta no se parece en nada a una captura y la página lo dice con
   todas las letras— y NO LLEVA CIFRAS. Ni un porcentaje, ni una gráfica,
   ni un contador, ni un "+37% de margen". Los únicos textos que entran aquí
   son nombres de módulo verificados entrando en la aplicación. Si algo no
   se ha visto en pantalla, no se escribe.

   Por eso `Product.preview` es OPCIONAL y no obligatorio: obligar a
   rellenarlo empujaría a quien añada el quinto producto a inventarse los
   módulos para que compile. Sin `preview`, la cuarta página sencillamente
   no existe para ese sector — que es la respuesta correcta a "todavía no lo
   he mirado", y el motivo real de que el número de páginas del panel dependa
   del sector y no sea una constante. */
/* ─── La paleta de CADA aplicación, no la nuestra ───────────────────────
   Por qué existe este tipo. La primera versión de esta vista previa pintaba
   los cuatro productos con los tokens de OpsPilot (mint/ámbar/azul de
   variables.css) y el resultado fue exactamente el que tenía que ser: cuatro
   veces el mismo componente con etiquetas distintas. Deslizabas entre
   sectores y no cambiaba nada. Un producto no se reconoce por su icono, se
   reconoce por su TEMPERATURA — el ERP es verde neón sobre azul marino y
   EnergyDeal es azul sobre blanco, y esa diferencia es toda la información.

   Los valores viven AQUÍ, en el dato, y no incrustados en el CSS: son un
   hecho sobre una aplicación en producción (igual que sus nombres de módulo),
   no una decisión de maquetación. El componente solo los publica como custom
   properties en su contenedor. Un producto nuevo entra sin tocar una línea
   de estilos.

   FORMATO: cadena CSS completa, tal cual se copió de la aplicación (`hsl(...)`
   en los tres casos verificados). No se normalizan a hex a propósito — así un
   `grep` del valor encuentra lo mismo aquí que en el `:root` del producto. */
export interface ProductTheme {
    /** DE DÓNDE SALE ESTA PALETA. Es el campo que sostiene la honestidad del
     *  color igual que `Screenshot.alt` sostiene la de las imágenes:
     *
     *   · `app`         — leída del `:root` de la aplicación en producción,
     *                     con la aplicación abierta delante.
     *   · `provisional` — NO se pudo leer (la aplicación no monta) y es una
     *                     identidad nuestra hasta que se pueda confirmar.
     *
     *  No es documentación interna: el render lo PINTA (ver la nota bajo el
     *  esquema en ProductPreview.tsx). Un color inventado y presentado como
     *  el del producto sería el mismo tipo de mentira que una captura falsa,
     *  a menor escala; un color inventado que se anuncia como provisional no
     *  afirma nada. */
    source: 'app' | 'provisional';
    /** Claro u oscuro. Se declara aparte de los colores porque hay decisiones
     *  que dependen del MODO y no de los valores: el peso de las sombras (en
     *  claro son grises finas, en oscuro son pozos), la fuerza de los bordes y
     *  si el brillo del acento suma o ensucia. Y porque es el mayor golpe de
     *  diferenciación que tiene esta pantalla: con tres oscuros y un claro, el
     *  claro se lee como "otra aplicación" antes de leer una sola palabra. */
    scheme: 'dark' | 'light';
    /** Fondo de la aplicación (`--background`). */
    bg: string;
    /** Superficie de tarjeta/panel (`--card`). */
    surface: string;
    /** Un escalón por encima de `surface` — filas, cabeceras, chips
     *  (`--muted`/`--secondary` según la aplicación). */
    raised: string;
    /** Borde/hairline. */
    line: string;
    /** Texto principal (`--foreground`). */
    text: string;
    /** Texto secundario. Tiene que cumplir 4.5:1 sobre `surface`: aquí no
     *  vale "un gris más flojo", los ratios están medidos. */
    muted: string;
    /** El color de marca (`--accent`/`--primary`/`--ring`). */
    accent: string;
    /** Texto SOBRE `accent`. Va explícito y no calculado porque el verde neón
     *  del ERP pide tinta oscura y el azul de EnergyDeal pide blanca —
     *  adivinarlo con una fórmula de luminancia es cómo se acaba con texto
     *  gris sobre fondo gris en el único producto que no miraste. */
    accentInk: string;
    /** Relleno tenue del acento (mismo papel que `--color-mint-soft`). */
    accentSoft: string;
    /** Sombra/halo tintado del acento. En `scheme: 'light'` es una sombra
     *  gris normal: un halo de color sobre blanco se ve sucio. */
    glow: string;
}

/** Cómo navega la aplicación, que es una propiedad SUYA y no del diseño de
 *  esta página:
 *
 *   · `rail`      — barra lateral. La eligen las aplicaciones con muchos más
 *                   módulos de los que caben en una fila (el ERP tiene 16).
 *   · `secciones` — pestañas independientes entre sí.
 *   · `cadena`    — pestañas EN ORDEN, cada una detrás de la anterior. Solo
 *                   la lleva Presupuestador, y no es un adorno: presupuesto →
 *                   obra → factura es el recorrido literal de un trabajo de
 *                   reforma (ver el comentario de sus `tabs` en products.ts).
 *                   Pintarlas como tres pestañas sueltas perdía justo eso. */
export type PreviewNav = 'rail' | 'secciones' | 'cadena';

/** El elemento PROTAGONISTA del esquema: el módulo que está abierto y la
 *  forma que tiene por dentro.
 *
 *  Existe para arreglar la segunda mitad de la queja ("bastante básicas"). La
 *  versión anterior pintaba cuatro fichas iguales con un icono cada una, o
 *  sea un diagrama; una aplicación de verdad tiene UNA cosa grande delante y
 *  el resto alrededor. Esto es esa cosa grande.
 *
 *  DÓNDE SIGUE ESTANDO LA LÍNEA: la figura es FORMA SIN VALORES. Filas,
 *  columnas, casillas y sangrías — ni una cifra, ni un euro, ni un
 *  porcentaje, ni una barra cuya longitud signifique algo. El único texto que
 *  entra es `module`, que es un nombre de módulo real. Todo lo demás va
 *  `aria-hidden` porque no dice nada y no debe fingir que sí. */
export interface PreviewStage {
    /** Qué forma tiene el módulo abierto por dentro:
     *   · `ledger`  — lista de líneas (una caja abierta, un turno).
     *   · `tree`    — desglose jerárquico con sangría (capítulo → partida).
     *   · `compare` — columnas enfrentadas (un comparador).
     *   · `sheet`   — una hoja con casillas (un modelo oficial).
     *  La disposición ENTERA del esquema es consecuencia de esto: no hay un
     *  campo aparte de "layout" porque no hay ninguna decisión que tomar dos
     *  veces — un comparador se dibuja como un comparador. */
    kind: 'ledger' | 'tree' | 'compare' | 'sheet';
    /** Nombre REAL del módulo que está abierto. Sale de la misma regla de oro
     *  que el resto: si no se ha visto en pantalla, no se escribe. */
    module: string;
    icon: ShowcaseIconKey;
    /** Cuántas filas/columnas dibuja la figura. Es densidad, no cantidad: no
     *  significa "la aplicación tiene 5 de algo". Se declara en el dato y no
     *  en el CSS porque una caja de hostelería y un modelo de la AEAT no
     *  tienen la misma pinta de lleno. */
    rows: number;
}

export interface ProductPreview {
    /** La paleta de la aplicación (ver `ProductTheme`). Sustituye al antiguo
     *  `accent: MockAccentKey`, que solo podía elegir entre los tres acentos
     *  de OpsPilot y por eso los cuatro productos salían con la cara de
     *  OpsPilot. */
    theme: ProductTheme;
    /** Cómo navega la aplicación (ver `PreviewNav`). */
    nav: PreviewNav;
    /** Las secciones de primer nivel de la aplicación, tal y como se llaman
     *  dentro. Se pintan como la NAVEGACIÓN del esquema, que es lo que las
     *  distingue de una barra de navegación de web pública.
     *
     *  Tres, no las dieciséis que tiene el ERP: la vista previa no es un mapa
     *  del sitio, es la respuesta a "¿esto es lo mío?" en dos segundos. En la
     *  vista móvil del esquema la tercera se oculta sola por CSS, así que el
     *  orden importa: la más reconocible, primero. */
    tabs: readonly [string, string, string];
    /** Qué hace la aplicación, en UNA frase. Describe; no promete resultados
     *  ni mide nada.
     *
     *  Se pinta FUERA del marco de la maqueta, y esa es la parte importante:
     *  dentro del marco solo entra lo que la aplicación tiene de verdad (sus
     *  pestañas, sus módulos y su nombre), porque cualquier texto puesto ahí
     *  dentro se lee como texto DE la interfaz. Esta frase es nuestra, así que
     *  va donde se ve que es nuestra. Ver ProductPreview.tsx.
     *
     *  UNA sola frase, sin segunda línea, y no por gusto: el panel que la
     *  contiene tiene el alto clavado (500px a partir de 1024px) y cada línea
     *  de texto de más es alto que la maqueta pierde. Si hace falta contar más,
     *  el sitio es la página de Resumen, que para eso existe.
     *
     *  El nombre del producto NO va aquí: lo pone el render desde
     *  `Product.name`, su única fuente (ver el TODO del nombre de
     *  Presupuestador/PresupuesYa en products.ts — si se decide cambiar, esta
     *  vista previa se entera sola). */
    title: string;
    /** El módulo abierto y su forma por dentro (ver `PreviewStage`). */
    stage: PreviewStage;
    /** Los OTROS módulos: los que están ahí al lado, no el que se está
     *  mirando. Antes esto era un `ShowcaseBlock` de cuatro tiles con uno
     *  marcado `active`, y esa rejilla de cuatro iguales es literalmente lo
     *  que el usuario llamó "bastante básicas": cuatro fichas del mismo
     *  tamaño no tienen jerarquía, así que no tienen protagonista, así que no
     *  se parecen a ninguna aplicación.
     *
     *  Ahora el que estaba `active` sube a `stage.module` y estos tres se
     *  quedan como lo que son: el resto del menú. Mismos cuatro nombres
     *  reales de siempre, repartidos en dos niveles en vez de en uno.
     *
     *  Sigue siendo el tipo compartido `ShowcaseModuleItem` (con su icono por
     *  clave, resuelto en mockIcons.ts) y no uno propio: el vocabulario de
     *  iconos es el mismo y duplicarlo solo garantizaba desincronizarlo. Lo
     *  que ya NO se comparte es el RENDER — ver ProductPreview.tsx. */
    modules: readonly ShowcaseModuleItem[];
}

/** Línea de servicio con la que se etiqueta un caso: TIENDA / WEB /
 *  APP A MEDIDA. Hoy el modelo solo conocía los 7 sectores verticales
 *  (`SectorId`), que responden a "de qué sector es el cliente"; esto
 *  responde a algo distinto, "qué le construimos", y por eso es un eje
 *  aparte y no un `SectorId` más.
 *
 *  Es SOLO una etiqueta de presentación: no genera rutas, no filtra, no es
 *  una taxonomía navegable. Decisión de arquitectura tomada — si algún día
 *  hace falta /tienda o /web, será otro trabajo con su propio SEO, no una
 *  consecuencia accidental de este campo. */
export type ServiceLine = 'tienda' | 'web' | 'app';

/** De quién es un caso y cómo se puede nombrar.
 *
 *  Unión discriminada y no un `clientName?: string` suelto: con el string
 *  opcional, "no lo hemos rellenado todavía" y "el cliente pidió no salir"
 *  son el mismo `undefined`, y esa diferencia importa — la primera es una
 *  tarea pendiente, la segunda es un acuerdo con un cliente que nadie debe
 *  revertir sin preguntar. Con la unión, `{ kind: 'anonymous' }` registra
 *  una DECISIÓN y la ausencia del campo registra un HUECO.
 *
 *  Además hace imposible el estado ilegal "nombrable pero sin nombre": si
 *  `kind` es 'named', `name` es obligatorio.
 *
 *  ─── Por qué existe `composite`, que es la variante importante ───
 *  Las dos primeras variantes responden a "¿se puede escribir el nombre?".
 *  `composite` responde a algo anterior y más grave: NO HAY UN CLIENTE. Un
 *  caso compuesto resume varios proyectos del mismo sector y su protagonista
 *  no existe como empresa concreta — no es que se calle el nombre, es que no
 *  hay nombre que callar.
 *
 *  Esto vivía escrito SOLO como copy en CasesDisclaimer ("cada caso resume
 *  varios proyectos..."), o sea como una afirmación de página aplicada a
 *  todos los casos por igual. En cuanto entra UN caso real, con cliente
 *  nombrable y enlace a producción, esa frase global pasa de ser una
 *  advertencia honesta a ser una mentira sobre ese caso: le está diciendo al
 *  visitante que una tienda que puede abrir en otra pestaña es una
 *  composición. Registrarlo POR CASO es lo que permite que el descargo cubra
 *  exactamente a quien le toca (ver CasesDisclaimer.tsx). */
export type ClientDisclosure =
    | { kind: 'named'; name: string }
    | { kind: 'anonymous' }
    | { kind: 'composite' };

export interface Sector {
    id: SectorId;
    iconKey: IconKey;
    label: string;
    title: string;
    who: string;
    solution: string;
    benefits: readonly string[];
    processSteps: readonly ProcessStep[];
    faq: readonly FaqItem[];
    /** Cross-link opcional al producto vertical propio en Recursos (solo los
     *  sectores que tienen uno: energía, reformas, asesorías, hostelería). El
     *  resto de sectores no llevan producto propio, así que se omite. */
    relatedResource?: { label: string; slug: string };
    /** FK → `Product.id` (src/data/products.ts). Solo los 4 sectores con
     *  producto propio. Es un ID y NO una copia del nombre o de la URL: el
     *  render resuelve el producto en products.ts, que es quien sabe si hoy
     *  se puede enlazar (ver `LinkAvailability`).
     *
     *  Convive con `relatedResource` sin solaparse: aquel dice "qué artículo
     *  de /recursos debe leer quien mira ESTE SECTOR" (lo tienen los 7,
     *  incluidos los 3 que no enlazan a ningún producto), esto dice "qué
     *  producto en producción es el de este sector". Que en los 4 sectores
     *  con producto ambos acaben apuntando al mismo artículo es una
     *  coincidencia de dos relaciones distintas, no un dato duplicado. */
    productId?: ProductId;
    /** Capturas reales del producto de este sector. Hoy VACÍO en los 7:
     *  no existe ni una sola captura en el repo (ver el bloque de contexto
     *  más arriba) y no se fabrican placeholders. */
    screenshots?: readonly Screenshot[];
}

// Iconos de la mini-interfaz de CaseMockPanel (mismo componente compartido
// que HeroLeadWidget, ver src/components/marketing/MockPreview.tsx). NO
// viven en `IconKey`: ese tipo es para iconos de IDENTIDAD (sector/caso,
// resueltos vía el registro compartido de components/icons/registry.tsx),
// mientras que estos son decorativos y solo tienen sentido dentro del
// mock — mezclar ambos habría inflado `IconKey` con entradas que ningún
// otro consumidor necesita. Resueltos a componentes lucide-react en
// src/components/marketing/mockIcons.ts (registro compartido: antes esta
// tabla vivía suelta dentro de CaseMockPanel.tsx, pero desde que el embudo
// del hero también describe sus mocks como dato (src/data/leadFunnel.ts)
// hay DOS consumidores del mismo vocabulario y duplicarlo garantizaba que
// se desincronizaran).
//
// El vocabulario creció al rediseñar el embudo: la maqueta ya no es un
// esqueleto gris genérico, sino contenido reconocible del sector (chips de
// servicio, módulos de panel, pasos de automatización), y eso exige iconos
// concretos por oficio. Aun así se mantiene corto a propósito — es una
// paleta cerrada, no un puente abierto a todo lucide.
export type ShowcaseIconKey =
    // — Base original (casos de éxito) —
    | 'chatMessage'
    | 'calendarCheck'
    | 'fileText'
    | 'receipt'
    | 'documentCheck'
    | 'users'
    // — Oficios y servicios (rama "web" del embudo) —
    | 'wrench'
    | 'hammer'
    | 'building'
    | 'truck'
    | 'clipboard'
    | 'settings'
    | 'layoutGrid'
    // — Panel interno (rama "sistema") —
    | 'bell'
    | 'clock'
    | 'calculator'
    | 'badgeCheck'
    // — Automatización (rama "automatizar") —
    | 'keyboard'
    | 'messages'
    // — Vista previa de producto (cuarta página de /soluciones) —
    //
    // Grupo nuevo por el mismo motivo que existieron los dos anteriores: un
    // consumidor nuevo (`Product.preview`, ver products.ts) necesita nombrar
    // cosas que ninguno de los anteriores nombraba. Y aquí el vocabulario
    // importa MÁS que en el embudo, porque estos tiles llevan el nombre real
    // de un módulo que existe en una aplicación en producción: un icono
    // aproximado ("un papel" para VeriFactu) convierte la ilustración en
    // decoración, que es justo lo contrario de lo que esta página promete.
    //
    // OJO con `zap`: existe una clave homónima en `IconKey` (el icono de
    // IDENTIDAD del sector energía). No colisionan —son dos uniones y dos
    // registros distintos, ver el comentario de arriba— pero si algún día se
    // fusionan los registros, esta es la pareja que hay que mirar primero.
    | 'banknote'
    | 'bookOpen'
    | 'zap'
    | 'plug'
    | 'history'
    | 'landmark'
    | 'shieldCheck'
    | 'scanLine'
    // — Comercio electrónico (caso ObraFácil) —
    //
    // Una sola entrada, y entra por la misma regla que el grupo de arriba: el
    // tile lleva el nombre de un módulo que existe de verdad en una tienda en
    // producción, así que un icono aproximado convierte la maqueta en
    // decoración. Para "Carrito" no había NADA en el vocabulario que no
    // mintiera: `receipt` es un ticket (lo que sale DESPUÉS de pagar),
    // `banknote` es dinero y `layoutGrid` ya está ocupado etiquetando el
    // catálogo en la misma maqueta. El carrito de la compra es el único
    // elemento de una tienda que no tiene equivalente en un panel de gestión,
    // que es de lo único que hablaba este vocabulario hasta ahora.
    | 'shoppingCart';

/** Acentos disponibles para el mock. Estructuralmente idéntico a `MockAccent`
 * en MockPreview.tsx y a propósito NO importado de allí: src/data no depende
 * de src/components (los datos son puros, sin React), así que la
 * compatibilidad la garantiza el tipado estructural de TypeScript, no una
 * importación. Si se añade un acento hay que tocar los dos sitios — el coste
 * de mantener la capa de datos libre de dependencias de UI.
 *
 * `info` (#6189c4, ya declarado en variables.css como color de estado) entra
 * como tercer acento porque las ramas "web" y "automatizar" del embudo
 * compartían mint y por tanto producían maquetas indistinguibles de color. */
export type MockAccentKey = 'mint' | 'warm' | 'info';

/** Un módulo/tile del bloque "modules" del mock — ver MockModuleItem en
 * MockPreview.tsx (misma forma, icono por clave en vez de componente). */
export interface ShowcaseModuleItem {
    key: string;
    icon: ShowcaseIconKey;
    label: string;
    active?: boolean;
}

/** Un servicio del bloque "services" del mock — ver MockServiceItem en
 * MockPreview.tsx (misma forma, icono por clave en vez de componente). */
export interface ShowcaseServiceItem {
    key: string;
    icon: ShowcaseIconKey;
    label: string;
}

/** Variante de bloque destacado del mock (ver MockBlock en MockPreview.tsx).
 *
 * `testimonial` ya no existe en ningún lado: era el bloque de 5 estrellas
 * siempre llenas + barras grises de cita + punto-y-barra simulando avatar y
 * nombre que usaba la rama "web" del embudo. Se eliminó porque fabricaba
 * prueba social de clientes que no existen; nada lo sustituye, el hueco lo
 * ocupa ahora `services` con contenido real del sector.
 *
 * `services` es lo que hace que la maqueta se reconozca sin leer el titular:
 * los nombres de servicio que ese oficio usa a diario ("Baños y cocinas",
 * "Envíos y recogida"). No hay imágenes de sector en el repo y no se van a
 * inventar, así que la señal de "esta es la mía" tiene que venir del texto. */
export type ShowcaseBlock =
    | {
          type: 'sequence';
          beforeIcon: ShowcaseIconKey;
          afterIcon: ShowcaseIconKey;
          /** Etiqueta corta bajo cada icono — sin ella el icono queda "suelto",
           *  sin decir qué representa (ver MockPreview SequenceBlock). */
          beforeLabel: string;
          afterLabel: string;
      }
    | { type: 'modules'; items: readonly ShowcaseModuleItem[] }
    | { type: 'services'; items: readonly ShowcaseServiceItem[] };

/* ═══════════════════════════════════════════════════════════════════════
   LA MAQUETA DE UN CASO — la identidad del DESTINO, no la nuestra
   ═══════════════════════════════════════════════════════════════════════
   Contexto de por qué este modelo se reescribió entero. Hasta hoy
   `CaseShowcase` era `{ accent: 'mint' | 'warm'; kicker; title; sub; block }`
   y se lo comía MockPreview: los tres casos salían como la MISMA maqueta
   —barra de navegación gris, titular, cuatro fichas con icono— pintada con
   NUESTROS dos acentos. O sea, tres proyectos de tres negocios distintos con
   la cara de OpsPilot y sin más diferencia entre ellos que las etiquetas.

   Es exactamente la queja que ya se resolvió una vez, en la vista previa de
   producto de /soluciones, y la solución fue la misma que se aplica aquí (ver
   la cabecera de ProductPreview.tsx):

     1. LA PALETA ES SUYA. `CaseSiteTheme` trae los valores leídos de la web de
        destino. Un negocio no se reconoce por su icono, se reconoce por su
        temperatura: el amarillo de señalización de una tienda de material, el
        verde oliva de una empresa de reformas y el azul de un CRM no se
        confunden ni de reojo.
     2. LA FORMA CUENTA DE QUÉ VA. `CaseStage` es una unión de tres, una por
        proyecto, porque una tienda, una web de captación y un CRM NO tienen la
        misma forma. Forzarlos al mismo dibujo con distintos colores es lo que
        hacía la versión anterior.
     3. HAY UN PROTAGONISTA. Cada variante tiene una cosa grande delante y el
        resto apoyando. Cuatro fichas del mismo tamaño no son una interfaz, son
        un diagrama.

   DÓNDE SIGUE ESTANDO LA LÍNEA entre ilustrar y mentir, que aquí aprieta más
   que en /soluciones porque los tres destinos se pueden ABRIR EN OTRA PESTAÑA
   y comprobar:

     · CERO CIFRAS. Ni un precio, ni un euro, ni un porcentaje, ni un contador,
       ni una gráfica con datos. Ojo con la tienda, que es donde más tira la
       mano: un precio inventado en la maqueta de un cliente al que se puede
       entrar a comprar es la mentira exacta que este proyecto vino a quitar.
       Donde iría un importe va un HUECO vacío, igual que en ProductPreview.
     · LOS NOMBRES SON SUYOS. Categorías, secciones, rutas, campos de
       formulario y estados salen de la web de destino, vistos entrando. Si no
       se ha visto, no se escribe.
     · NO SE IMITA UNA CAPTURA. Ni cromo de navegador, ni barra de URL, ni
       bisel de portátil, ni fotos fingidas: donde va una imagen va el HUECO de
       la imagen. Y el render lo dice con todas las letras debajo del marco
       (ver `schematicNote` en CaseMockPanel.tsx).
     · TODO LO DECORATIVO VA `aria-hidden`. Barras, celdas y huecos no dicen
       nada y no deben fingir que sí. */

/** La paleta de la web de destino de un caso.
 *
 *  Hermano de `ProductTheme` y a propósito NO el mismo tipo, aunque compartan
 *  diez campos. La diferencia no es cosmética: `ProductTheme` describe una
 *  APLICACIÓN (una pantalla tras un login, cuya barra superior es una
 *  superficie más), y esto describe un SITIO PÚBLICO, que tiene una CABECERA
 *  con color propio —`chrome`— y que en dos de los tres casos es lo primero
 *  que lo identifica. Fusionarlos habría obligado a meter `chrome` opcional en
 *  las cuatro vistas previas de producto, que no lo tienen ni lo quieren.
 *
 *  FORMATO: cadena CSS completa, tal cual se leyó del sitio. No se normalizan
 *  a hex para que un `grep` del valor encuentre lo mismo aquí que allí. */
export interface CaseSiteTheme {
    /** DE DÓNDE SALE ESTA PALETA, con el mismo papel que `ProductTheme.source`:
     *   · `site`        — leída de la web de destino, con la web delante.
     *   · `provisional` — no se pudo leer y es una identidad nuestra hasta
     *                     poder confirmarla. El render LO DICE (ver
     *                     `schematicNote` en CaseMockPanel.tsx).
     *  Hoy los tres son `site`. */
    source: 'site' | 'provisional';
    /** Claro u oscuro. Los tres destinos de hoy son claros —son webs de venta,
     *  no paneles— y por eso la diferenciación tiene que venir del acento, de
     *  la cabecera y sobre todo de la FORMA. Se declara igual porque el peso de
     *  sombras y filos depende del modo, no de los valores. */
    scheme: 'light' | 'dark';
    /** Fondo de página. */
    bg: string;
    /** Superficie de tarjeta/ficha. */
    surface: string;
    /** Un escalón por encima de `surface` — bandas, cabeceras de tabla,
     *  huecos de imagen. */
    raised: string;
    /** Borde/hairline. */
    line: string;
    /** Texto principal. */
    text: string;
    /** Texto secundario. Tiene que cumplir 4.5:1 sobre `surface` Y sobre
     *  `raised`: aquí no vale "un gris más flojo". Los ratios están medidos y
     *  anotados en cada tema (ver src/data/cases.ts). */
    muted: string;
    /** El color de marca, para uso GRÁFICO: filos, marcadores, tintes,
     *  iconos. Deliberadamente separado del par de acción de abajo, y ese
     *  divorcio es lo que arregla un problema real de contraste — ver
     *  `action`. */
    accent: string;
    /** Relleno tenue del acento (mismo papel que `--color-mint-soft`). Sobre
     *  él SÍ puede ir texto, porque es un tinte: lo que manda es que el texto
     *  cumpla contra el color resultante. */
    accentSoft: string;
    /** Relleno del botón principal, y `actionInk` su texto.
     *
     *  ¿POR QUÉ NO ES SIEMPRE `accent`? Porque en uno de los tres casos el
     *  botón real del cliente NO CUMPLE: el verde oliva de J.R. Rodríguez con
     *  texto blanco encima da 3.86:1, por debajo del 4.5:1 de AA. Reproducir
     *  ese par aquí sería copiar un defecto de accesibilidad ajeno a nuestra
     *  web; inventarle un oliva más oscuro que no usa sería inventarle un
     *  color. La salida es la tercera: usar OTRO color suyo que sí cumple (su
     *  carbón con su crema, 10.6:1) y dejar el oliva para lo gráfico, que es
     *  donde el 3:1 de elementos no textuales sí se cumple.
     *
     *  En los otros dos coincide con el botón real: amarillo con tinta casi
     *  negra (13.6:1) y azul con blanco (5.2:1). */
    action: string;
    /** Texto SOBRE `action`. Va explícito y no calculado: adivinarlo con una
     *  fórmula de luminancia es cómo se acaba con blanco sobre amarillo. */
    actionInk: string;
    /** Color de la CABECERA del sitio, que es lo que un tema de aplicación no
     *  necesita. La de ObraFácil es casi negra y la de las otras dos blanca, y
     *  esa sola banda ya separa una tienda de una web de servicios antes de
     *  leer una palabra. */
    chrome: string;
    /** Texto sobre `chrome`. Mismo criterio que `actionInk`. */
    chromeInk: string;
    /** Sombra/halo del objeto. En `scheme: 'light'` es una sombra gris: un halo
     *  de color sobre blanco se lee como suciedad, no como brillo. */
    glow: string;
}

/** Una página real del sitio, con su ruta. La ruta es el argumento entero del
 *  caso de J.R. Rodríguez —una página por servicio y ciudad— así que se
 *  escribe tal cual responde el servidor, verificada con un 200. */
export interface CaseRoute {
    /** Ruta ABSOLUTA dentro del sitio, con las barras que tenga de verdad
     *  ('/reformas-banos-cordoba/'). No es un enlace: la maqueta no navega a
     *  ninguna parte, es texto de la ilustración. */
    path: string;
    /** Cómo se llama esa página en el menú del sitio. */
    label: string;
}

/**
 * QUÉ SE DIBUJA. Una variante por proyecto, y ese es justo el punto: la forma
 * es la mitad del reconocimiento.
 *
 * No hay un campo aparte de "layout" porque no habría ninguna decisión que
 * tomar dos veces — una tienda se dibuja como una tienda. La disposición
 * ENTERA del esquema es consecuencia de `kind` (ver `data-kind` en
 * CaseMockPanel.module.css).
 *
 * Los números (`moreCategories`, `siblings`, `rows`…) son DENSIDAD, no
 * inventario: dicen cuántas figuras mudas dibujar para que el esquema no
 * parezca vacío, no cuántas cosas tiene el negocio.
 */
export type CaseStage =
    /* ─── TIENDA ────────────────────────────────────────────────────────
       Rejilla de producto con carrito y la herramienta propia de la casa.
       Lo que delata a una tienda no es un icono de carro: es que hay un
       PRODUCTO grande delante, categorías al lado y una fila de destacados
       debajo. */
    | {
          kind: 'storefront';
          /** Categorías REALES del catálogo. La primera es la que está
           *  abierta. Se pintan por su nombre porque el nombre es el dato. */
          categories: readonly string[];
          /** Cuántas categorías MÁS hay, dibujadas como filas sin nombre. Es
           *  la forma honesta de decir "hay más" sin escribir siete nombres
           *  que no caben ni inventarse ninguno — mismo recurso que el
           *  `railRest` de ProductPreview. */
          moreCategories: number;
          /** La ficha grande. Nombre y especificación TAL CUAL los escribe la
           *  tienda. Sin precio, y no por olvido: ver el bloque de arriba. */
          product: { name: string; spec: string };
          /** Cuántas fichas pequeñas acompañan a la grande. Densidad. */
          siblings: number;
          /** La sección destacada de su portada, con su nombre y en sus
           *  versalitas. */
          featured: string;
          /** La herramienta que esta tienda tiene y otra no: la calculadora de
           *  placas. `fields` es cuántos huecos de entrada se dibujan — huecos
           *  VACÍOS, que rellenarlos sería inventar la pared de alguien. */
          tool: { label: string; fields: number };
      }
    /* ─── WEB DE CAPTACIÓN ───────────────────────────────────────────────
       Mapa de páginas. Aquí la arquitectura ES el argumento: una página por
       servicio y ciudad. Dibujarlo como una rejilla de módulos habría tirado
       a la basura lo único que hay que contar. */
    | {
          kind: 'sitemap';
          /** Las rutas reales. La primera es la que está abierta y se dibuja
           *  por dentro; el resto quedan como el mapa alrededor. */
          routes: readonly CaseRoute[];
          /** Los campos del formulario de captación, por su nombre real. Se
           *  dibujan como huecos vacíos con su etiqueta. */
          form: readonly string[];
          /** El canal directo que la web ofrece al lado del formulario. */
          direct: string;
          /** Otras secciones reales del sitio, como cierre. Nombres de
           *  SECCIÓN, nunca su contenido: "Testimonios" queda fuera a
           *  propósito — nombrar una sección de opiniones ajenas dentro de
           *  nuestra prueba de trabajo se lee como prueba social nuestra, que
           *  es de lo que esta web ya se deshizo una vez. */
          sections: readonly string[];
      }
    /* ─── APP A MEDIDA ───────────────────────────────────────────────────
       Consola densa: tabla comparativa delante, cartera jerárquica al lado y
       el ciclo de estados al pie. Es lo contrario de las otras dos —mucha
       información en poco sitio— y esa densidad ya dice "esto es una
       herramienta de trabajo, no un escaparate". */
    | {
          kind: 'console';
          /** Cómo se organiza la cartera, en SU vocabulario: un CIF con sus
           *  CUPS colgando. `children` es densidad. */
          rail: { root: string; child: string; children: number };
          /** El comparador: columnas enfrentadas y filas de condiciones. La
           *  primera columna va marcada, y NO significa "la mejor oferta"
           *  —eso sería un dato— sino la columna sobre la que estarías. */
          compare: { columns: number; rows: number };
          /** Lo que hace único a ese comparador, con su nombre. */
          badge: string;
          /** Los estados REALES del ciclo de comisión, en orden. El primero va
           *  marcado. Son cuatro palabras y son la pieza más reconocible del
           *  producto: ningún CRM genérico tiene "revertida". */
          states: readonly string[];
      };

/** Mini-interfaz FIJA por caso (CaseMockPanel): la web de destino, con su
 *  paleta y con la forma de lo que es. Sustituye a las antiguas stats
 *  numéricas, al panel "antes → después" y a la maqueta genérica de MockPreview
 *  que gastaron las iteraciones anteriores. */
export interface CaseShowcase {
    /** La paleta del destino (ver `CaseSiteTheme`). Sustituye al antiguo
     *  `accent: 'mint' | 'warm'`, que solo sabía elegir entre dos colores
     *  NUESTROS y por eso los tres casos salían con nuestra cara. */
    theme: CaseSiteTheme;
    /** El nombre del sitio tal y como aparece en SU propia cabecera. Va dentro
     *  del marco, que es donde solo entra lo que el sitio tiene de verdad. */
    siteName: string;
    /** Sus secciones de primer nivel, con sus nombres. Tres: la maqueta no es
     *  un mapa del sitio, es la respuesta a "¿qué es esto?" en dos segundos.
     *  En contenedor estrecho la última se pliega sola, así que el orden
     *  importa — la más reconocible, primero. */
    nav: readonly [string, string, string];
    /** La llamada a la acción REAL de su cabecera, con su texto. */
    cta: string;
    /** Qué se dibuja y con qué piezas (ver `CaseStage`). */
    stage: CaseStage;
    /** Qué se construyó, en UNA frase NUESTRA. Se pinta FUERA del marco y esa
     *  es la parte importante: cualquier texto puesto dentro se lee como texto
     *  DE la interfaz del cliente. Mismo criterio que `ProductPreview.title`. */
    title: string;
    /** Segunda línea opcional, también fuera del marco. */
    sub?: string;
}

export interface Case {
    id: string;
    /** FK → Sector.id */
    sectorId: SectorId;
    iconKey: IconKey;
    /** Etiqueta corta (eyebrow en Home, sector en Casos) */
    label: string;
    title: string;
    /** Resumen corto — usado en la tarjeta del carrusel de Home */
    summary: string;
    /** Narrativa larga — usada en la tarjeta de Casos */
    text: string;
    /** Bullets de highlights — usados en la tarjeta del carrusel de Home */
    bullets: readonly string[];
    /** Mini-interfaz fija que representa la web ENTREGADA a este cliente, con
     * su paleta y con la forma de lo que es (ver `CaseShowcase`). La pinta
     * CaseMockPanel, compartido entre Home y Casos. Ya NO pasa por MockPreview:
     * aquel es la maqueta genérica de OpsPilot, con nuestros acentos, y por eso
     * los tres casos salían indistinguibles. */
    showcase: CaseShowcase;
    quote?: string;
    author?: string;
    /** Etiqueta de línea de servicio (TIENDA / WEB / APP A MEDIDA) — ver
     *  `ServiceLine`. Complementa a `label` (que es el SECTOR del cliente),
     *  no lo sustituye: un mismo sector puede llevar tienda o app. */
    serviceLine?: ServiceLine;
    /** De quién es el caso y cómo se nombra (ver `ClientDisclosure`).
     *  Ausente = todavía no se ha decidido, que es distinto de las tres
     *  decisiones que el campo sabe registrar.
     *
     *  Sigue siendo opcional, pero YA NO es decorativo: es el campo que
     *  CasesDisclaimer consulta para saber a qué casos les toca el descargo
     *  de "esto resume varios proyectos". Un caso `composite` lo recibe; uno
     *  `named` —cliente real, con enlace a producción— no puede recibirlo sin
     *  que la web mienta sobre su única prueba comprobable.
     *
     *  Hoy lo llevan los 3 casos y NINGUNO es `composite`: `named` en
     *  ObraFácil y en J.R. Rodríguez, `anonymous` en EnergyDeal. Consecuencia
     *  directa y buscada: CasesDisclaimer no renderiza nada. El descargo se ha
     *  apagado solo porque se quedó sin nadie a quien cubrir, que es
     *  exactamente el comportamiento para el que se escribió. La variante
     *  `composite` se conserva en la unión —no se borra— porque sigue siendo
     *  el registro correcto si algún día vuelve a entrar un caso compuesto, y
     *  porque es lo que mantiene vivo el interruptor. */
    client?: ClientDisclosure;
    /** FK → `Product.id`. Solo si el caso se construyó SOBRE uno de nuestros
     *  productos. NO se deriva de `sectorId`: que un caso sea del sector
     *  "reformas" no demuestra que ese cliente use Presupuestador, y pintar
     *  ese enlace sería afirmarlo. Afirmación explícita o nada. */
    productId?: ProductId;
    /** Enlace a lo entregado a ESTE cliente en producción (su tienda, su web,
     *  su app), para los casos que no son un producto nuestro. Separado de
     *  `productId` porque son cosas distintas: uno apunta a un SaaS que
     *  mantenemos y que tiene su propia ficha, el otro a algo que ya no es
     *  nuestro. Lleva su propio `availability` (ver `ExternalLink`): la web
     *  de un cliente puede caerse o rediseñarse sin avisarnos. */
    productionLink?: ExternalLink;
    /** Capturas del sistema entregado. Mismo estado que en `Sector`: hoy no
     *  hay ninguna imagen de producto en el repo. */
    screenshots?: readonly Screenshot[];
}
