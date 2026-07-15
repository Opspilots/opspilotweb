// Único puente entre los datos puros (src/data) y lucide-react. Los módulos
// de datos referencian iconos por `IconKey`; los componentes resuelven el
// componente real aquí, en lugar de recibir JSX embebido en los datos.
import type { LucideIcon } from 'lucide-react';
import {
    ClipboardList,
    Zap,
    Building2,
    Target,
    Globe,
    Settings,
    Calculator,
} from 'lucide-react';
import type { IconKey } from '../../data/types';

export const ICONS: Record<IconKey, LucideIcon> = {
    clipboard: ClipboardList,
    zap: Zap,
    building: Building2,
    target: Target,
    globe: Globe,
    settings: Settings,
    calculator: Calculator,
};
