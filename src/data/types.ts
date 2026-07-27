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
   ni una sola captura en el repo y no se van a inventar, así que las 7
   fichas de sectors.ts y las 3 de cases.ts tienen que seguir siendo válidas
   sin tocar ni un campo. El modelo abre la puerta; llenarla es trabajo de
   negocio, no de tipos. */

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

/** Si el cliente de un caso se puede nombrar o va anonimizado.
 *
 *  Unión discriminada y no un `clientName?: string` suelto: con el string
 *  opcional, "no lo hemos rellenado todavía" y "el cliente pidió no salir"
 *  son el mismo `undefined`, y esa diferencia importa — la primera es una
 *  tarea pendiente, la segunda es un acuerdo con un cliente que nadie debe
 *  revertir sin preguntar. Con la unión, `{ kind: 'anonymous' }` registra
 *  una DECISIÓN y la ausencia del campo registra un HUECO.
 *
 *  Además hace imposible el estado ilegal "nombrable pero sin nombre": si
 *  `kind` es 'named', `name` es obligatorio. */
export type ClientDisclosure =
    | { kind: 'named'; name: string }
    | { kind: 'anonymous' };

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
    | 'messages';

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

/** Mini-interfaz FIJA por caso (CaseMockPanel), que representa la mejora de
 * ese sector concreto — sustituye a las antiguas stats numéricas y al panel
 * de iconos "antes → después" (CaseTransition) de iteraciones previas. */
export interface CaseShowcase {
    /** Deliberadamente MÁS ESTRECHO que `MockAccentKey`: los tres casos de
     *  éxito llevan acento elegido a mano y ninguno usa el azul `info`, que
     *  entró en el sistema para separar la rama "automatizar" del embudo. Que
     *  el tipo de datos no ofrezca una opción que nadie ha diseñado evita
     *  elegirla por descarte. Si algún día un caso la necesita, se amplía. */
    accent: 'mint' | 'warm';
    /** Etiqueta mono sobre el titular del mock (ver MockPreview `kicker`). */
    kicker?: string;
    title: string;
    sub?: string;
    block: ShowcaseBlock;
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
    /** Mini-interfaz fija que representa la mejora del sector, usada por
     * CaseMockPanel (compartido entre Home y Casos, reutiliza MockPreview —
     * el mismo componente del Paso 4 del hero). */
    showcase: CaseShowcase;
    quote?: string;
    author?: string;
    /** Etiqueta de línea de servicio (TIENDA / WEB / APP A MEDIDA) — ver
     *  `ServiceLine`. Complementa a `label` (que es el SECTOR del cliente),
     *  no lo sustituye: un mismo sector puede llevar tienda o app. */
    serviceLine?: ServiceLine;
    /** Si el cliente se puede nombrar. Ausente = todavía no se ha decidido;
     *  `{ kind: 'anonymous' }` = decidido que va anonimizado (ver
     *  `ClientDisclosure`). Los 3 casos actuales van sin campo porque el
     *  acuerdo con cada cliente no está registrado en ningún sitio del repo
     *  — la nota de `.caseDisclaimer` en Cases.tsx dice que se omiten
     *  nombres, pero eso es copy de página, no un dato por caso. */
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
