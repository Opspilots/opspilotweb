// Conversión `ShowcaseBlock` (dato puro, iconos por clave — src/data/types.ts)
// → `MockBlock` (lo que consume MockPreview, iconos ya resueltos a componentes
// lucide). Es el único punto donde el dato se convierte en UI.
//
// POR QUÉ ES COMPARTIDO: esta función existía duplicada, una copia dentro de
// CaseMockPanel.tsx y otra dentro de HeroLeadWidget.tsx (esta última además
// traduciendo desde un tipo propio del hero, no desde el dato). Con las dos
// fuentes de maquetas descritas ya como dato —cases.ts y leadFunnel.ts—, dos
// copias solo garantizaban que añadir una variante de bloque compilase en un
// sitio y reventase en el otro.
//
// Es un `switch` sin `default` a propósito, no un descuido: sobre una unión
// discriminada TypeScript comprueba la exhaustividad y, si falta una rama, el
// tipo de retorno pasa a incluir `undefined` y la función no compila. Así,
// añadir mañana una variante a `ShowcaseBlock` falla AQUÍ, en el sitio que hay
// que tocar, en vez de pintar una maqueta a medias en tiempo de ejecución. La
// cadena de `if` que había antes no daba esa garantía.
import type { MockBlock } from './MockPreview';
import { MOCK_ICONS } from './mockIcons';
import type { ShowcaseBlock } from '../../data/types';

export function toMockBlock(block: ShowcaseBlock): MockBlock {
    switch (block.type) {
        case 'sequence':
            return {
                type: 'sequence',
                beforeIcon: MOCK_ICONS[block.beforeIcon],
                afterIcon: MOCK_ICONS[block.afterIcon],
                beforeLabel: block.beforeLabel,
                afterLabel: block.afterLabel,
            };
        case 'modules':
            return {
                type: 'modules',
                items: block.items.map((item) => ({
                    key: item.key,
                    icon: MOCK_ICONS[item.icon],
                    label: item.label,
                    active: item.active,
                })),
            };
        case 'services':
            return {
                type: 'services',
                items: block.items.map((item) => ({
                    key: item.key,
                    icon: MOCK_ICONS[item.icon],
                    label: item.label,
                })),
            };
    }
}
