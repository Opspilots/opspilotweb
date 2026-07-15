// Fuente única de los 3 casos de éxito, consumidos por el carrusel de Home
// (resumen corto + bullets) y por la página /casos (narrativa larga + cita).
// Antes vivían duplicados en src/pages/Home.tsx (`const CASES`) y
// src/pages/Cases.tsx (`const CASES`), con prosa que había divergido entre
// ambos. `summary`/`bullets` (Home) y `text` (Casos) NO son una divergencia:
// son contenido distinto para usos de render distintos (resumen+lista vs.
// párrafo narrativo) y se conservan ambos tal cual, sin tocar el render de
// ninguna de las dos páginas.
//
// Donde SÍ había la misma información contada dos veces con distinta
// redacción (las etiquetas de las estadísticas, y en el caso 3 también el
// valor "5 → 1" vs "5→1"), se resolvió a favor de la versión de Home.tsx por
// ser la más descriptiva/completa; ambas cajas de stats (Home y Casos)
// permiten el ajuste de línea del texto (sin truncado/ellipsis), así que no
// hay riesgo de overflow visual al aplicar la versión larga en /casos.
// REVISAR: confirmar que la redacción elegida es la deseada en ambas páginas.
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
        // DIVERGENCIA resuelta: labels — Home tenía "Capacidad de atención en
        // tres meses" / "Tiempo dedicado a gestión administrativa" /
        // "Inversión adicional en personal"; Casos tenía versiones más cortas
        // ("Capacidad de atención" / "Tiempo en gestión" / "Personal extra").
        // Me quedo con la versión de Home (más descriptiva).
        stats: [
            { value: '3×', label: 'Capacidad de atención en tres meses' },
            { value: '−70%', label: 'Tiempo dedicado a gestión administrativa' },
            { value: '0 €', label: 'Inversión adicional en personal' },
        ],
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
        // DIVERGENCIA resuelta: labels 1 y 2 — Home: "Cierre mensual
        // automatizado" / "En tareas repetitivas del equipo"; Casos: "Cierre
        // automático" / "En tareas repetitivas". El label 3 ya era idéntico.
        // Me quedo con la versión de Home (más completa).
        stats: [
            { value: '80%', label: 'Cierre mensual automatizado' },
            { value: '−5h/día', label: 'En tareas repetitivas del equipo' },
            { value: '+45%', label: 'Más capacidad sin contratar' },
        ],
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
        // DIVERGENCIA resuelta: los 3 labels y el valor del segundo stat —
        // Home: "5 → 1" (con espacios) + labels largos; Casos: "5→1" (sin
        // espacios) + labels cortos. Me quedo con la versión de Home (valor
        // con espacios, más legible; labels más completos).
        stats: [
            { value: '20h', label: 'Ahorradas a la semana en todo el equipo' },
            { value: '5 → 1', label: 'Apps reemplazadas por un solo sistema' },
            { value: '100%', label: 'Información centralizada y siempre al día' },
        ],
        quote:
            'Dejamos de pagar cinco herramientas y ganamos visibilidad real de cada cliente.',
        author: 'Directora de operaciones',
    },
];

export function getCase(id: string): Case | undefined {
    return CASES.find((c) => c.id === id);
}
