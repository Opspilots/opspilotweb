export type {
    SectorId,
    IconKey,
    Sector,
    Case,
    CaseShowcase,
    MockAccentKey,
    ShowcaseBlock,
    ShowcaseModuleItem,
    ShowcaseServiceItem,
    ShowcaseIconKey,
} from './types';
export { SECTORS, getSector } from './sectors';
export { CASES, getCase } from './cases';

// Contenido editorial del embudo de diagnóstico del hero. Se expone por el
// barril igual que SECTORS y CASES, por coherencia, aunque su único consumidor
// (HeroLeadWidget) importe hoy directamente de './leadFunnel': el barril es lo
// que hace que src/data se lea como "la capa de contenido" y no como una
// carpeta de ficheros sueltos que hay que conocer de memoria.
export type {
    AutomatizarTarea,
    ComboRecipe,
    FunnelLayout,
    FunnelOption,
    FunnelTemplate,
    GuiaFreno,
    Necesidad,
    Objetivo,
    ResolvedCombo,
    ResolvedNecesidad,
    ResolvedSub,
    SistemaFoco,
    Step2Config,
    Sub,
    WebSector,
} from './leadFunnel';
export {
    BRANCH_ACCENT,
    GUIA_REMAP,
    NECESIDAD_LABEL,
    OBJETIVO_ENTREGABLE,
    OBJETIVO_KICKER,
    OBJETIVO_LABEL,
    OBJETIVO_LAYOUT,
    OBJETIVO_PHRASE,
    OBJETIVO_SUB,
    STEP1_OPTIONS,
    STEP1_QUESTION,
    STEP2_CONFIG,
    STEP3_OPTIONS,
    STEP3_QUESTION,
    SUBMIT_LABEL,
    buildDiagnostic,
    getFunnelTemplate,
    getRecipe,
    resolveCombo,
} from './leadFunnel';
