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
// src/components/cases/CaseMockPanel.tsx.
export type ShowcaseIconKey =
    | 'chatMessage'
    | 'calendarCheck'
    | 'fileText'
    | 'receipt'
    | 'documentCheck'
    | 'users';

/** Un módulo/tile del bloque "modules" del mock — ver MockModuleItem en
 * MockPreview.tsx (misma forma, icono por clave en vez de componente). */
export interface ShowcaseModuleItem {
    key: string;
    icon: ShowcaseIconKey;
    label: string;
    active?: boolean;
}

/** Variante de bloque destacado del mock (ver MockBlock en MockPreview.tsx).
 * `testimonial` no se usa hoy por ningún caso pero se deja fuera a
 * propósito: el tipo de datos solo modela lo que realmente se usa. */
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
    | { type: 'modules'; items: readonly ShowcaseModuleItem[] };

/** Mini-interfaz FIJA por caso (CaseMockPanel), que representa la mejora de
 * ese sector concreto — sustituye a las antiguas stats numéricas y al panel
 * de iconos "antes → después" (CaseTransition) de iteraciones previas. */
export interface CaseShowcase {
    accent: 'mint' | 'warm';
    /** Etiqueta mono sobre el titular del mock (ver MockPreview `kicker`). */
    kicker?: string;
    title: string;
    sub?: string;
    /** Nota secundaria de bajo peso visual — contexto, no protagonista. */
    beforeTag: string;
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
