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
    | 'medida';

export type IconKey =
    | 'clipboard'
    | 'zap'
    | 'building'
    | 'target'
    | 'globe'
    | 'settings'
    | 'calculator';

export interface Sector {
    id: SectorId;
    iconKey: IconKey;
    label: string;
    title: string;
    who: string;
    solution: string;
    benefits: readonly string[];
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
    stats?: readonly { value: string; label: string }[];
    quote?: string;
    author?: string;
}
