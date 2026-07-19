// Fuente única de los sectores mostrados en /soluciones. Migrado literal
// desde src/pages/Soluciones.tsx (antes `const sectores`). `cta`/`href` se
// eliminaron del dato: eran idénticos en todas las entradas ('Cuéntanos tu caso'
// / ROUTES.contacto) — es presentación, no dato, y ahora está hardcodeado
// en Soluciones.tsx.
import type { Sector, SectorId } from './types';

export const SECTORS: readonly Sector[] = [
    {
        id: 'asesorias',
        iconKey: 'clipboard',
        label: 'Asesorías y despachos',
        title: 'Asesorías y despachos profesionales',
        who: 'Gestorías, asesorías fiscales, laborales y legales',
        solution:
            'Software para asesorías y despachos que automatiza firma, comunicación y archivo documental. Adiós al papeleo.',
        benefits: ['Documentos sin papel', 'Seguimiento en tiempo real', 'Clientes siempre informados'],
        relatedResource: {
            label: 'Prueba Fiscalidad, nuestra plataforma de facturación y contabilidad',
            slug: 'fiscalidad-plataforma-fiscal-contable',
        },
    },
    {
        id: 'energia',
        iconKey: 'zap',
        label: 'Energía y comercializadoras',
        title: 'Empresas de energía y comercializadoras',
        who: 'Comerciales y back-office de energía eléctrica y gas',
        solution:
            'CRM para comercializadoras de energía: comparas tarifas al instante, digitalizas el alta y centralizas la cartera.',
        benefits: ['Análisis en segundos', 'Propuestas sin errores', 'Pipeline de clientes claro'],
        relatedResource: {
            label: 'Descubre EnergyDeal, nuestro CRM especializado para el sector',
            slug: 'energydeal-crm-energetico',
        },
    },
    {
        id: 'reformas',
        iconKey: 'building',
        label: 'Reformas e instalaciones',
        title: 'Reformas, instalaciones y oficios',
        who: 'Empresas de construcción, fontanería, electricidad y climatización',
        solution:
            'Software para reformas e instalaciones: presupuestas en la visita y sigues la obra hasta el cobro. Sin llamadas de más.',
        benefits: ['Presupuestos en 2 minutos', 'Clientes sin llamadas extras', 'Cobros sin perseguir'],
        relatedResource: {
            label: 'Conoce Presupuestador, nuestro software de presupuestos de obra',
            slug: 'presupuestador-obra-bc3',
        },
    },
    {
        id: 'agencias',
        iconKey: 'target',
        label: 'Agencias y servicios',
        title: 'Agencias y negocios de servicios',
        who: 'Agencias de marketing, consultoras y equipos de servicios recurrentes',
        solution:
            'Software de gestión para agencias de servicios: pipeline visual, seguimientos automáticos y cero leads perdidos.',
        benefits: ['Nada se pierde', 'Pipeline siempre actualizado', 'Menos tiempo administrativo'],
    },
    {
        id: 'pymes',
        iconKey: 'globe',
        label: 'PYMEs con operativa dispersa',
        title: 'PYMEs con operativa dispersa',
        who: 'Empresas que gestionan con Excel, llamadas y WhatsApp',
        solution:
            'Digitalización de PYMEs en una sola herramienta: empleados, tareas, proveedores y analítica, todo junto.',
        benefits: ['Control total en un sitio', 'Decisiones con datos reales', 'Menos caos operativo'],
    },
    {
        id: 'medida',
        iconKey: 'settings',
        label: 'Procesos únicos a medida',
        title: 'Procesos únicos sin solución estándar',
        who: 'Cualquier empresa con un flujo específico que el software del mercado no resuelve',
        solution:
            'Software a medida: analizamos tu flujo, lo construimos para ti y lo mantenemos vivo con tu negocio.',
        benefits: ['100% adaptado a ti', 'Integrado con lo que ya tienes', 'Escalable sin límites'],
    },
    {
        id: 'hosteleria',
        iconKey: 'utensils',
        label: 'Hostelería y restauración',
        title: 'Restaurantes, bares y grupos de hostelería',
        who: 'Restaurantes, bares y grupos con uno o varios locales',
        // El TPV/ERP de hostelería es un nicho muy peleado a nivel nacional —
        // en vez de competir de frente por el término genérico, el ángulo es
        // la adaptación a tu operativa real y la ausencia de permanencia, no
        // "somos el TPV más grande de España".
        solution:
            'ERP de hostelería a medida de tu operativa real: TPV, stock, turnos y reservas en un solo sistema, sin permanencia y con soporte cercano.',
        benefits: ['Adaptado a tu operativa, no al revés', 'Sin permanencia ni letra pequeña', 'Soporte cercano, sin call center'],
        relatedResource: {
            label: 'Descubre nuestro ERP de hostelería completo',
            slug: 'erp-hosteleria-tpv-restaurantes',
        },
    },
];

export function getSector(id: SectorId): Sector | undefined {
    return SECTORS.find((s) => s.id === id);
}
