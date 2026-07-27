// Único puente entre las claves de icono del mock (`ShowcaseIconKey`, dato
// puro en src/data/types.ts) y los componentes reales de lucide-react.
//
// POR QUÉ AQUÍ Y NO EN CaseMockPanel: esta tabla vivía dentro de
// CaseMockPanel.tsx cuando el único consumidor eran los casos de éxito. Al
// mover el contenido editorial del embudo del hero a src/data/leadFunnel.ts,
// sus maquetas también describen iconos por clave — dos consumidores del
// mismo vocabulario. Duplicar la tabla habría significado que añadir un
// icono nuevo compilara en un sitio y reventara en el otro (`Record` es
// exhaustivo), o peor, que alguien copiara solo la mitad.
//
// Es el mismo patrón que components/icons/registry.tsx para `IconKey`, pero
// deliberadamente SEPARADO: aquel resuelve iconos de IDENTIDAD (sector,
// caso) y este iconos decorativos que solo tienen sentido dentro de una
// maqueta. Fusionarlos obligaría a cada consumidor a cargar un registro con
// el doble de entradas de las que usa.
import type { LucideIcon } from 'lucide-react';
import {
    BadgeCheck,
    Banknote,
    Bell,
    BookOpen,
    Building2,
    Calculator,
    CalendarCheck2,
    ClipboardList,
    Clock,
    FileCheck2,
    FileText,
    Hammer,
    History,
    Keyboard,
    Landmark,
    LayoutGrid,
    MessageSquare,
    MessagesSquare,
    Plug,
    Receipt,
    ScanLine,
    Settings,
    ShieldCheck,
    Truck,
    Users,
    Wrench,
    Zap,
} from 'lucide-react';
import type { ShowcaseIconKey } from '../../data/types';

export const MOCK_ICONS: Record<ShowcaseIconKey, LucideIcon> = {
    // Base original (casos de éxito)
    chatMessage: MessageSquare,
    calendarCheck: CalendarCheck2,
    fileText: FileText,
    receipt: Receipt,
    documentCheck: FileCheck2,
    users: Users,
    // Oficios y servicios
    wrench: Wrench,
    hammer: Hammer,
    building: Building2,
    truck: Truck,
    clipboard: ClipboardList,
    settings: Settings,
    layoutGrid: LayoutGrid,
    // Panel interno
    bell: Bell,
    clock: Clock,
    calculator: Calculator,
    badgeCheck: BadgeCheck,
    // Automatización
    keyboard: Keyboard,
    messages: MessagesSquare,
    // Vista previa de producto (/soluciones, cuarta página). Cada uno se
    // eligió contra el módulo CONCRETO que va a etiquetar, no por parecido
    // temático: `Plug` es el punto de suministro (CUPS) y no "algo eléctrico",
    // `Landmark` es la Administración y no "un edificio", `History` es el log
    // de auditoría y no "el tiempo". Ver el comentario del grupo en
    // src/data/types.ts sobre por qué aquí un icono aproximado hace daño.
    banknote: Banknote,
    bookOpen: BookOpen,
    zap: Zap,
    plug: Plug,
    history: History,
    landmark: Landmark,
    shieldCheck: ShieldCheck,
    scanLine: ScanLine,
};
