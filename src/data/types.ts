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
}
