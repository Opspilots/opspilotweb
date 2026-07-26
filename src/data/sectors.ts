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
        processSteps: [
            {
                title: 'Cliente sube documentación online',
                description: 'Gestoría, factura, nómina — entra directamente sin papeleos ni escaneos.',
            },
            {
                title: 'Flujo automático según tipo de documento',
                description: 'Cada documento sigue su carril: facturación, fiscal, laboral. Sin decisiones manuales.',
            },
            {
                title: 'Archivo centralizado y versionado',
                description: 'Todos tus documentos en un lugar. Históricos. Buscar en 2 segundos.',
            },
            {
                title: 'Cliente ve el estado en tiempo real',
                description: 'Deja de llamar preguntando "¿Dónde está?". El cliente accede, ve qué falta.',
            },
        ],
        faq: [
            {
                question: '¿Se integra con mi software fiscal o de nóminas?',
                answer: 'Sí. Conectamos con lo que ya usas — automatizamos entrada y archivo, no reemplazamos.',
            },
            {
                question: '¿Qué pasa si se pierde un documento?',
                answer: 'Todo respaldado. Historial de cambios: quién lo tocó y cuándo. Auditoría total.',
            },
            {
                question: '¿Es más caro que gestionar papeleos a mano?',
                answer: 'No. Ahorras escaneo, búsqueda y llamadas de clientes. Pagan solos en 2-3 meses.',
            },
        ],
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
        processSteps: [
            {
                title: 'Base de tarifas actualizada en tiempo real',
                description: 'Cargas energéticas del cliente, sistema trae tarifas reales del mercado.',
            },
            {
                title: 'Comparativa de ofertas al instante',
                description: 'Ves cuál es la mejor tarifa PARA ESE CLIENTE EN ESE MOMENTO. No genéricas.',
            },
            {
                title: 'Propuesta generada sin errores',
                description: 'Comercial firma, cliente obtiene PDF con cálculos y ahorro — todo revisado.',
            },
            {
                title: 'Seguimiento automático de la gestión',
                description: 'Alta tramitada, cambio de titular, vencimiento — sin llamadas de seguimiento.',
            },
        ],
        faq: [
            {
                question: '¿Cómo actualiza la base de tarifas?',
                answer: 'Conectamos con mercado mayorista y proveedores — se actualiza cada cambio, sin que hagas nada.',
            },
            {
                question: '¿Cuánto tarda hasta que el primer cliente está en el sistema?',
                answer: 'Carga inicial: un día. Después, cada cliente nuevo se integra en 5 minutos.',
            },
            {
                question: '¿Si un cliente cambia su consumo, la propuesta sigue válida?',
                answer: 'No. El sistema te avisa y regenera la propuesta automáticamente.',
            },
        ],
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
        processSteps: [
            {
                title: 'Visita en obra, presupuesto en 2 minutos',
                description: 'Mides, marcas problemas, app genera propuesta. Cliente la ve en móvil antes de irte.',
            },
            {
                title: 'Cliente firma digital, obra entra en carril',
                description: 'Sin papeles. Firma en tablet, presupuesto confirmado inmediatamente.',
            },
            {
                title: 'Obra rastreada paso a paso',
                description: 'Cada fase documenta cambios, compras, fotos. Cliente ve en vivo — sin llamar.',
            },
            {
                title: 'Factura automática, seguimiento de cobro',
                description: 'Obra termina, factura se emite, recordatorio automático — sin que llames.',
            },
        ],
        faq: [
            {
                question: '¿Qué pasa si durante la obra pido un cambio?',
                answer: 'Cliente solicita en app, tú presupuestas el cambio, él aprueba — todo documentado.',
            },
            {
                question: '¿El cliente ve las fotos y el avance en tiempo real?',
                answer: 'Sí. Cada foto que subas aparece en su app — no hay sorpresas al final.',
            },
            {
                question: '¿Cómo registro los "extras" que salen en la obra?',
                answer: 'Los vas acumulando en una lista y se genera un presupuesto adicional que aprueba en la app.',
            },
        ],
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
        processSteps: [
            {
                title: 'Lead capturado automáticamente',
                description: 'Formulario web, email, WhatsApp — todo en un lugar, sin duplicados.',
            },
            {
                title: 'Se asigna automáticamente al comercial correcto',
                description: 'Por sector, experiencia, carga de trabajo — sin decisiones manuales.',
            },
            {
                title: 'Seguimientos programados sin que lo recuerdes',
                description: 'Primer contacto, propuesta, follow-up — sistema te avisa cuándo tocar.',
            },
            {
                title: 'Pipeline siempre en verde',
                description: 'Ves qué leads se estancan, cuál está listo y cuál necesita que llames hoy.',
            },
        ],
        faq: [
            {
                question: '¿Se integra con Gmail, Outlook o WhatsApp?',
                answer: 'Email: sí, conexión directa. WhatsApp: entra por formulario o anotación manual (rápido).',
            },
            {
                question: '¿Si se va un comercial, pierdo su cartera de leads?',
                answer: 'No. Los leads viven en el sistema de la agencia, no en su móvil. Cuando alguien se va, su cartera y su histórico se quedan.',
            },
            {
                question: '¿Cómo automatizo los primeros emails?',
                answer: 'Plantillas por tipo de lead, se envían automáticas en X horas. Personalización con un clic.',
            },
        ],
        relatedResource: {
            label: 'Lee cómo gestionar leads sin perder ninguno',
            slug: 'gestion-leads-agencia-sin-crm',
        },
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
        processSteps: [
            {
                title: 'Importa datos desde Excel (tuyo o nuestro)',
                description: 'Clientes, facturas, tareas, inventario — sin retype, desde tu Excel anterior.',
            },
            {
                title: 'Cada rol ve lo que le toca',
                description: 'Ventas ve oportunidades, Almacén ve stock, Finanzas ve flujo — información clara.',
            },
            {
                title: 'Tareas y proyectos con dueño único',
                description: 'Nada flotante. Cada cosa tiene responsable, fecha, estado — se ve quién no cumple.',
            },
            {
                title: 'Reportes automáticos cada lunes',
                description: 'Resumen de semana, métricas clave, alertas — en email o app.',
            },
        ],
        faq: [
            {
                question: '¿Es difícil migrar de Excel y WhatsApp?',
                answer: 'No. Importas datos, ajustas campos, enseñas equipo en una tarde — el resto es costumbre.',
            },
            {
                question: '¿Mis empleados aprenden rápido?',
                answer: 'Sí. Interfaz intuitiva — si usan WhatsApp, usan esto. Videos cortos si hay dudas.',
            },
            {
                question: '¿Qué datos puedo ver en tiempo real?',
                answer: 'Ingresos del mes, facturas pendientes, tareas vencidas, stock crítico — dashboard personalizable.',
            },
        ],
        relatedResource: {
            label: 'Descubre cómo migrar de Excel a un sistema sin parar el negocio',
            slug: 'migrar-de-excel-a-sistema-pyme',
        },
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
        processSteps: [
            {
                title: 'Análisis profundo de tu flujo real',
                description: 'Sesiones con tu equipo, mapeo de procesos, detectamos lo que otros no resuelven.',
            },
            {
                title: 'Construcción iterativa con feedback tuyo',
                description: 'No entregamos en 6 meses a ciegas. Primeras fases funcionales, pruebas, ajustes.',
            },
            {
                title: 'Integración con sistemas que ya tienes',
                description: 'ERP antiguo, CRM, facturación — conectamos todo sin duplicar datos.',
            },
            {
                title: 'Escalas sin migración',
                description: 'Más usuarios, más datos, más complejidad — el software crece contigo.',
            },
        ],
        faq: [
            {
                question: '¿Cuánto tarda un software a medida?',
                answer: 'Procesos simples: 6-8 semanas. Complejos con integraciones: 3-4 meses. Versión funcional antes.',
            },
            {
                question: '¿Qué pasa si mis procesos cambian después?',
                answer: 'Lo ajustamos — contrato incluye soporte de cambios los primeros 6 meses.',
            },
            {
                question: '¿Quién mantiene el software si algo falla?',
                answer: 'Nosotros. Mantenimiento, backups, actualizaciones incluidas. Soporte en horario acordado.',
            },
        ],
        relatedResource: {
            label: '¿Medida o estándar? Aprende a decidir antes de pedir presupuesto',
            slug: 'cuando-pedir-software-a-medida-vs-estandar',
        },
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
        processSteps: [
            {
                title: 'Conocemos tu operativa: turnos, zonas, clientes VIP',
                description: 'Barra, comedor, terraza, delivery — ajustamos menú, mesas, permisos por rol.',
            },
            {
                title: 'TPV montado a tu carta y tu forma de trabajar',
                description: 'No botones al azar. Extras por plato, descuentos que aplicas de verdad, atajos para la cocina.',
            },
            {
                title: 'Stock conectado en vivo',
                description: 'Cada plato que vendes descuenta ingrediente. Alertas si falta, históricos de consumo.',
            },
            {
                title: 'Reportes de lo que importa',
                description: 'Platos estrella, horas punta, rentabilidad por zona — datos que mejoran el negocio.',
            },
        ],
        faq: [
            {
                question: '¿Puedo cancelar si el TPV no me gusta?',
                answer: 'Sí. Sin permanencia. Si no es lo tuyo, nos devuelves el hardware — nada de letra pequeña.',
            },
            {
                question: '¿Cuántos días tarda el setup completo?',
                answer: 'Importas productos, configuras mesas/zonas en 2-3 horas. Test, luego en vivo.',
            },
            {
                question: '¿Y si tengo 3 locales con operativas distintas?',
                answer: 'Cada local tiene su configuración independiente — misma plataforma, adaptada a cada uno.',
            },
        ],
        relatedResource: {
            label: 'Descubre nuestro ERP de hostelería completo',
            slug: 'erp-hosteleria-tpv-restaurantes',
        },
    },
];

export function getSector(id: SectorId): Sector | undefined {
    return SECTORS.find((s) => s.id === id);
}
