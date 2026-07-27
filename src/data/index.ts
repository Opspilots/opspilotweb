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
    // — Productos, capturas y enlaces a producción —
    ClientDisclosure,
    ExternalLink,
    LinkAvailability,
    ProductId,
    ProductPreview,
    // Paleta real de cada aplicación + forma del módulo protagonista: es lo
    // que hace que las 4 vistas previas se vean como 4 aplicaciones y no como
    // 4 copias de la nuestra. Ver `ProductTheme` en types.ts.
    ProductTheme,
    PreviewNav,
    PreviewStage,
    Screenshot,
    ScreenshotFrame,
    ServiceLine,
} from './types';
export { SECTORS, getSector } from './sectors';
export { CASES, SERVICE_LINE_LABEL, getCase } from './cases';

// Registro de los 4 productos propios en producción. `isLinkable` es el
// único punto donde se decide si un destino externo se pinta o no — ver
// src/data/products.ts.
export type { Product } from './products';
export { PRODUCTS, getProduct, getProductByUrl, isLinkable } from './products';

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
