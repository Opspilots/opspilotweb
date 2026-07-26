// Fuente única de los 3 casos de éxito, consumidos por el carrusel de Home
// (resumen corto + bullets) y por la página /casos (narrativa larga + cita).
// Antes vivían duplicados en src/pages/Home.tsx (`const CASES`) y
// src/pages/Cases.tsx (`const CASES`), con prosa que había divergido entre
// ambos. `summary`/`bullets` (Home) y `text` (Casos) NO son una divergencia:
// son contenido distinto para usos de render distintos (resumen+lista vs.
// párrafo narrativo) y se conservan ambos tal cual, sin tocar el render de
// ninguna de las dos páginas.
//
// `showcase` alimenta CaseMockPanel (componente compartido en
// src/components/cases/CaseMockPanel.tsx), usado tanto en la tarjeta de Home
// como en la de Casos — reutiliza MockPreview (el mismo lenguaje visual del
// Paso 4 de HeroLeadWidget, ver src/components/marketing/MockPreview.tsx)
// para mostrar una mini-interfaz FIJA por caso que representa la mejora de
// ese sector.
import type { Case } from './types';

export const CASES: readonly Case[] = [
    {
        id: 'reformas',
        sectorId: 'reformas',
        iconKey: 'building',
        label: 'Reformas',
        title: 'De la libreta al sistema que trabaja solo',
        summary:
            'Empresa familiar de reformas que triplicó su capacidad sin contratar a nadie más.',
        text:
            'Una empresa familiar de reformas lo llevaba todo con Excel y llamadas sueltas. Perdían presupuestos por falta de seguimiento. Les construimos un software a medida: presupuestos asistidos por IA y citas automatizadas por WhatsApp. En tres meses triplicaron su capacidad sin contratar a nadie.',
        bullets: [
            'Marca, identidad y presupuestos con IA generando imágenes realistas de la reforma antes de empezar',
            'WhatsApp automatizado para citas y visitas — cero llamadas para confirmar',
            'Sistema a medida que centraliza clientes, obras y facturación en un solo lugar',
        ],
        showcase: {
            accent: 'mint',
            kicker: 'Automático',
            title: 'Visita confirmada, sin mover un dedo',
            sub: 'Directo del chat al calendario, sin llamadas de por medio.',
            block: {
                type: 'sequence',
                beforeIcon: 'chatMessage',
                afterIcon: 'calendarCheck',
                beforeLabel: 'WhatsApp',
                afterLabel: 'Agenda',
            },
        },
        quote:
            'Pasamos de perder presupuestos por falta de seguimiento a tener un sistema que trabaja solo.',
        author: 'CEO',
    },
    {
        id: 'asesoria-fiscal',
        sectorId: 'asesorias',
        iconKey: 'calculator',
        label: 'Asesoría fiscal',
        title: 'Una asesoría que cierra cuentas mientras duerme',
        summary:
            'Despacho con cientos de clientes que automatizó el cierre mensual sin perder calidad.',
        text:
            'Un despacho con cientos de clientes se ahogaba en tareas repetitivas. Digitalizamos el flujo de trabajo con lectura inteligente de documentos, conciliación bancaria automática y un asistente de IA que prepara los modelos antes de la revisión humana. Hoy el cierre mensual sale al 80% solo.',
        bullets: [
            'Conciliación bancaria automática y lectura inteligente de documentos',
            'Asistente IA que prepara los modelos antes de la revisión humana',
            'Portal de cliente para firmar documentos sin emails de ida y vuelta',
        ],
        showcase: {
            accent: 'warm',
            kicker: 'Cierre al día',
            title: 'El cierre mensual, ya resuelto',
            sub: 'Conciliación, modelos y firma, sin tocarlos a mano.',
            block: {
                type: 'modules',
                items: [
                    { key: 'conciliacion', icon: 'receipt', label: 'Conciliación', active: true },
                    { key: 'modelos', icon: 'fileText', label: 'Modelos', active: true },
                    { key: 'firma', icon: 'documentCheck', label: 'Firma', active: true },
                ],
            },
        },
        quote:
            'Antes era imposible escalar sin contratar; ahora podemos crecer sin que el equipo reviente.',
        author: 'Socio director',
    },
    {
        id: 'agencia-servicios',
        sectorId: 'agencias',
        iconKey: 'target',
        label: 'Agencia de servicios',
        title: 'Una agencia que recupera 20 horas a la semana',
        summary:
            'Agencia que reemplazó cinco herramientas distintas por un solo sistema hecho a medida.',
        text:
            'Una agencia de marketing usaba cinco herramientas que no se hablaban entre sí. Lo unificamos todo en un solo software a medida: CRM, gestión, facturación y comunicación interna, con reporting en tiempo real para dirección y un asistente de IA para dudas del equipo. Recuperaron 20 horas cada semana.',
        bullets: [
            'Sistema único que sustituyó CRM, gestión, facturación y comunicación interna',
            'Reporting en tiempo real para dirección, sin tener que pedir nada',
            'Asistente IA que responde dudas internas de proceso al instante',
        ],
        showcase: {
            accent: 'mint',
            kicker: 'Todo en uno',
            title: 'Cinco herramientas, un solo sistema',
            sub: 'Clientes, facturación, agenda y comunicación, unificados.',
            block: {
                type: 'modules',
                items: [
                    { key: 'clientes', icon: 'users', label: 'Clientes', active: true },
                    { key: 'facturacion', icon: 'receipt', label: 'Facturas', active: true },
                    { key: 'agenda', icon: 'calendarCheck', label: 'Agenda', active: true },
                    { key: 'comunicacion', icon: 'chatMessage', label: 'Mensajes', active: true },
                ],
            },
        },
        quote:
            'Dejamos de pagar cinco herramientas y ganamos visibilidad real de cada cliente.',
        author: 'Directora de operaciones',
    },
];

export function getCase(id: string): Case | undefined {
    return CASES.find((c) => c.id === id);
}
