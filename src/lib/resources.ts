export type ResourceCategory = 'Guía' | 'Artículo' | 'Caso práctico' | 'Checklist';

export type ResourceBlock =
    | { type: 'p'; text: string }
    | { type: 'h2'; text: string }
    | { type: 'ul'; items: string[] }
    | { type: 'ol'; items: string[] }
    | { type: 'note'; text: string };

export interface Resource {
    slug: string;
    cat: ResourceCategory;
    title: string;
    desc: string;
    time: string;
    featured?: boolean;
    blocks: ResourceBlock[];
}

export const RESOURCES: Resource[] = [
    {
        slug: 'automatiza-tu-negocio-sin-saber-de-tecnologia',
        cat: 'Guía',
        title: 'Cómo automatizar tu negocio sin saber de tecnología',
        desc: 'Paso a paso para identificar qué procesos te roban tiempo y convertirlos en flujos automáticos. Sin código, sin complicaciones.',
        time: '8 min',
        featured: true,
        blocks: [
            {
                type: 'p',
                text: '"Automatizar" suena a programadores, servidores y proyectos de seis meses. En la práctica, para la mayoría de PYMEs significa algo mucho más aburrido y mucho más rentable: dejar de hacer a mano tareas repetitivas que ya sabes hacer, para poder dedicar ese tiempo a vender, atender clientes o simplemente parar de trabajar a las diez de la noche.',
            },
            {
                type: 'p',
                text: 'No hace falta saber de tecnología para automatizar. Hace falta saber muy bien cómo funciona tu negocio hoy, y eso ya lo sabes tú mejor que nadie.',
            },
            { type: 'h2', text: 'Paso 1 — Encuentra el proceso que más tiempo te roba' },
            {
                type: 'p',
                text: 'Antes de pensar en herramientas, identifica dónde se te va el tiempo sin generar valor. Estas son las señales más habituales:',
            },
            {
                type: 'ul',
                items: [
                    'Copias los mismos datos de un Excel a otro, o de un email a un Excel',
                    'Usas WhatsApp o el email como si fuera un sistema de gestión',
                    'Alguien tiene que estar disponible para "aprobar" algo antes de que el trabajo avance',
                    'Buscas información (un presupuesto, un contrato, una factura) en tu email durante más de 2 minutos',
                    'Hay una tarea que haces literalmente igual cada semana, con los mismos pasos',
                ],
            },
            {
                type: 'note',
                text: 'Si marcaste dos o más, ya tienes tu primer candidato a automatizar.',
            },
            { type: 'h2', text: 'Paso 2 — Dibuja el proceso tal y como es hoy' },
            {
                type: 'p',
                text: 'No hace falta un diagrama profesional. Coge un papel y escribe, paso a paso, qué ocurre desde que algo empieza (llega un lead, se hace un pedido, se cierra una obra) hasta que termina. Anota quién hace cada paso y con qué herramienta. Este ejercicio, que lleva 15 minutos, es el que normalmente revela dónde está el cuello de botella real — casi nunca es donde creías.',
            },
            { type: 'h2', text: 'Paso 3 — Decide qué automatizar primero' },
            {
                type: 'p',
                text: 'No automatices todo a la vez. Ordena tus candidatos por dos ejes: cuánto tiempo ahorra al mes y cuánto esfuerzo cuesta ponerlo en marcha. Empieza siempre por lo que ahorra mucho tiempo y cuesta poco esfuerzo — esa primera victoria es la que te va a dar la confianza (y el presupuesto) para seguir.',
            },
            { type: 'h2', text: 'Paso 4 — Elige el enfoque adecuado' },
            {
                type: 'p',
                text: 'No todo se resuelve igual. Hay tres niveles, de menor a mayor compromiso:',
            },
            {
                type: 'ul',
                items: [
                    'Herramientas no-code (Zapier, Make, automatizaciones de tu CRM actual): válidas para conectar dos apps que ya usas y mover datos entre ellas sin desarrollo.',
                    'Software vertical ya construido: si tu proceso es común en tu sector (facturación, presupuestos de obra, gestión energética), casi seguro que ya existe una herramienta pensada exactamente para ese caso — suele ser más barato y más rápido que construir algo desde cero.',
                    'Desarrollo a medida: cuando el proceso es específico de tu negocio y no encaja en ninguna herramienta genérica, o cuando necesitas conectar varios sistemas entre sí de forma que nadie más ha resuelto.',
                ],
            },
            { type: 'h2', text: 'Paso 5 — Mide antes y después' },
            {
                type: 'p',
                text: 'Antes de automatizar, apunta cuánto tiempo se tarda hoy en ese proceso (aunque sea una estimación). Un mes después de automatizarlo, vuelve a medirlo. Ese número es el que te va a decir si merece la pena seguir invirtiendo en digitalizar el resto del negocio, y es el dato que vas a querer enseñar si alguna vez tienes que justificar la inversión.',
            },
            {
                type: 'p',
                text: 'La automatización no es un proyecto que "se termina": es una forma de trabajar. Empieza por un proceso, mide el resultado, y sigue con el siguiente.',
            },
        ],
    },
    {
        slug: 'senales-pyme-necesita-sistema-de-gestion',
        cat: 'Artículo',
        title: '5 señales de que tu PYME necesita un sistema de gestión',
        desc: 'Si pierdes clientes por falta de seguimiento o tus datos viven en hojas sueltas, sigue leyendo.',
        time: '5 min',
        blocks: [
            {
                type: 'p',
                text: 'La mayoría de negocios no deciden digitalizarse por gusto — lo hacen porque el caos actual ya les está costando dinero o clientes de forma visible. Estas son las cinco señales que vemos con más frecuencia antes de que una PYME dé el paso.',
            },
            { type: 'h2', text: '1. Pierdes clientes por falta de seguimiento' },
            {
                type: 'p',
                text: 'Un cliente pregunta precio, nadie vuelve a escribirle, y se va a la competencia. No porque tu producto fuera peor, sino porque nadie tenía forma de saber que ese seguimiento estaba pendiente. Si el "sistema" para hacer seguimiento comercial es la memoria de una persona, tarde o temprano se te escapan oportunidades.',
            },
            { type: 'h2', text: '2. Tus datos viven en hojas sueltas y nadie los audita' },
            {
                type: 'p',
                text: 'Excel es una herramienta excelente para calcular. Es una herramienta terrible como base de datos de negocio: no hay control de quién cambió qué, las versiones se duplican ("presupuesto_final_v3_DEFINITIVO.xlsx") y un solo error de fórmula puede pasar meses sin detectarse.',
            },
            { type: 'h2', text: '3. No sabes tu margen real hasta cerrar el mes' },
            {
                type: 'p',
                text: 'Si para saber si un proyecto, una obra o un cliente te está siendo rentable tienes que esperar al cierre contable, estás tomando decisiones a ciegas durante semanas. Un sistema de gestión te da esa foto en tiempo real, no un mes después de que ya no puedas hacer nada al respecto.',
            },
            { type: 'h2', text: '4. Cada persona nueva tarda semanas en aprender "cómo hacemos las cosas aquí"' },
            {
                type: 'p',
                text: 'Cuando el conocimiento del negocio vive en la cabeza de dos o tres personas y no en un sistema, cada incorporación es una reconstrucción manual de procesos no escritos. Eso no escala, y hace que el negocio dependa peligrosamente de que esas personas no se vayan nunca.',
            },
            { type: 'h2', text: '5. Creces, pero el caos crece más rápido que la facturación' },
            {
                type: 'p',
                text: 'Es la señal más clara: si duplicar clientes significa triplicar el estrés operativo (más errores, más cosas que se olvidan, más horas extra sin más beneficio), el problema no es de volumen — es de sistema. Un negocio bien montado debería poder crecer sin que el caos crezca en la misma proporción.',
            },
            {
                type: 'note',
                text: 'Si te has visto reflejado en tres o más puntos, probablemente ya estás pagando el coste del "no sistema" — solo que en forma de horas, errores y clientes perdidos en lugar de una factura mensual.',
            },
        ],
    },
    {
        slug: 'caso-reformas-de-excel-a-sistema',
        cat: 'Caso práctico',
        title: 'De Excel a sistema: cómo una empresa de reformas triplicó su capacidad',
        desc: 'El caso real de una empresa familiar que pasó de libretas a un sistema que trabaja solo.',
        time: '6 min',
        blocks: [
            {
                type: 'note',
                text: 'Caso ilustrativo: describe un patrón real y repetido que vemos en empresas de reformas y construcción, compuesto a partir de varios proyectos similares — no corresponde a un cliente concreto identificado.',
            },
            { type: 'h2', text: 'El punto de partida' },
            {
                type: 'p',
                text: 'Empresa familiar de reformas, entre 5 y 10 personas en obra. Los presupuestos se hacían en Excel, uno distinto para cada proyecto, sin plantilla común. Las certificaciones de obra (lo que se factura según avanza el trabajo) se calculaban a mano cada mes, comparando lo presupuestado con lo ejecutado a ojo. El control de costes reales — materiales, subcontratas — vivía en un cajón de albaranes en papel que alguien intentaba cuadrar a final de mes.',
            },
            {
                type: 'p',
                text: 'El síntoma más doloroso no era la lentitud: era que, en varios proyectos, no sabían si estaban ganando o perdiendo dinero hasta que la obra ya había terminado.',
            },
            { type: 'h2', text: 'El primer cambio: presupuestos estructurados' },
            {
                type: 'p',
                text: 'El primer paso fue dejar de escribir cada presupuesto desde cero. Se construyó un catálogo de partidas y "packs" reutilizables (una reforma de baño estándar, una instalación eléctrica tipo) con sus recursos de mano de obra y material ya descompuestos. Hacer un presupuesto nuevo pasó de ser "escribir un documento" a "seleccionar partidas de un catálogo y ajustar cantidades" — de horas a minutos, y con mucho menos margen de error humano.',
            },
            { type: 'h2', text: 'El segundo cambio: certificaciones y firma digital' },
            {
                type: 'p',
                text: 'Las certificaciones de obra pasaron a generarse automáticamente a partir de las partidas ya ejecutadas, con versionado (para poder ver qué cambió entre la certificación 3 y la 4). La aprobación del cliente, que antes era una llamada de teléfono seguida de un email de confirmación, pasó a ser un enlace público donde el cliente firma digitalmente — con validez y trazabilidad, sin imprimir nada.',
            },
            { type: 'h2', text: 'El resultado' },
            {
                type: 'p',
                text: 'Con el catálogo de partidas y la certificación automatizada, el mismo equipo de gestión pudo llevar bastantes más obras en marcha en paralelo sin contratar a nadie más en oficina técnica. Pero el cambio más valorado internamente no fue la velocidad: fue saber, en cualquier momento y sin esperar al cierre, si una obra concreta iba dentro de margen o se estaba comiendo el beneficio — y poder corregirlo mientras la obra seguía abierta, no después.',
            },
        ],
    },
    {
        slug: 'checklist-tu-web-trabaja-para-ti',
        cat: 'Checklist',
        title: '¿Tu web trabaja para ti o contra ti? 10 puntos para saberlo',
        desc: 'Una auditoría rápida y gratuita para saber si tu web está generando clientes o espantándolos.',
        time: '3 min',
        blocks: [
            {
                type: 'p',
                text: 'La mayoría de webs de PYMEs no fallan por diseño — fallan por detalles concretos que espantan al visitante antes de que llegue a contactar. Revisa estos 10 puntos en la tuya, hoy mismo:',
            },
            {
                type: 'ol',
                items: [
                    'Carga en menos de 3 segundos en móvil — compruébalo con la conexión de datos de tu teléfono, no con el wifi de la oficina.',
                    'El teléfono o WhatsApp de contacto está visible sin hacer scroll, en cualquier página, no solo en "Contacto".',
                    'Se ve perfecta en el móvil de gama media que usa tu cliente real, no solo en tu portátil.',
                    'Tiene un objetivo claro por página: cada página lleva a una acción concreta (llamar, escribir, pedir presupuesto), no compite consigo misma con cinco CTA distintos.',
                    'Explica qué haces en la primera pantalla sin que el visitante tenga que hacer scroll para entenderlo.',
                    'No tiene enlaces rotos ni imágenes que no cargan — revísalo trimestralmente, no solo al lanzarla.',
                    'Aparece en Google si buscas tu negocio + tu ciudad (prueba a buscarlo ahora mismo en incógnito).',
                    'Tiene certificado SSL (candado en la barra de direcciones) — sin esto, Google y el navegador ya avisan al visitante de que "no es segura".',
                    'El formulario de contacto funciona de verdad — envíate un mensaje de prueba tú mismo una vez al mes.',
                    'Se actualizó en los últimos 12 meses — una web con precios, fotos o servicios de hace tres años transmite que el negocio también está parado.',
                ],
            },
            {
                type: 'note',
                text: 'Si has fallado en 3 o más puntos, tu web probablemente está perdiendo clientes activamente, no solo dejando de ganarlos.',
            },
        ],
    },
    {
        slug: 'asistentes-ia-productivos',
        cat: 'Artículo',
        title: 'Asistentes IA productivos: lo que nadie te cuenta antes de implementar uno',
        desc: 'Ventajas reales, limitaciones y cuándo tiene sentido invertir en agentes inteligentes.',
        time: '7 min',
        blocks: [
            {
                type: 'p',
                text: 'Entre el discurso de marketing ("la IA lo hace todo") y el escepticismo ("es una moda"), hay una realidad más aburrida y más útil: los asistentes de IA funcionan muy bien para tareas concretas y bien definidas, y bastante mal para todo lo demás. Esto es lo que conviene saber antes de invertir en uno.',
            },
            { type: 'h2', text: 'Lo que sí funciona hoy' },
            {
                type: 'ul',
                items: [
                    'Extraer datos de documentos: leer un ticket, una factura o un albarán y convertirlo en datos estructurados (OCR + IA) — con revisión humana, ahorra muchísimo tiempo administrativo.',
                    'Responder preguntas frecuentes y clasificar consultas entrantes antes de que lleguen a una persona.',
                    'Redactar primeros borradores: emails, descripciones de producto, respuestas tipo — siempre revisados por una persona antes de enviarse.',
                    'Buscar información dentro de tu propio negocio: "¿qué le presupuestamos al cliente X el año pasado?" contestado en segundos en lugar de bucear en el email.',
                ],
            },
            { type: 'h2', text: 'Lo que nadie te cuenta' },
            {
                type: 'ul',
                items: [
                    'Necesita datos limpios: un asistente IA conectado a un Excel desordenado da respuestas desordenadas. La IA no arregla un mal sistema de datos, lo amplifica.',
                    'Se equivoca con confianza: un asistente mal configurado puede dar una respuesta incorrecta con el mismo tono seguro que una correcta. Siempre necesita un punto de revisión humana en decisiones que importan (dinero, contratos, salud, datos legales).',
                    'No sustituye un proceso mal diseñado: si el problema de fondo es que nadie sabe quién aprueba qué, un chatbot no lo arregla — solo automatiza la confusión más rápido.',
                    'El coste no es solo la suscripción: hay que dedicar tiempo a configurarlo, darle contexto de tu negocio y revisar sus respuestas las primeras semanas. Un asistente IA sin ese rodaje inicial rinde muy por debajo de su potencial.',
                ],
            },
            { type: 'h2', text: 'Cuándo tiene sentido invertir' },
            {
                type: 'p',
                text: 'Cuando ya tienes un proceso claro y repetible que hoy hace una persona de forma manual y mecánica (clasificar, extraer, resumir, buscar) y ese proceso tiene datos de entrada razonablemente ordenados. Ahí la IA multiplica la capacidad de tu equipo sin contratar a nadie más.',
            },
            { type: 'h2', text: 'Cuándo no tiene sentido todavía' },
            {
                type: 'p',
                text: 'Cuando el proceso en sí está mal definido, cuando los datos de partida son un caos, o cuando la decisión que quieres automatizar tiene consecuencias legales o económicas serias sin ningún punto de revisión humana. En esos casos, el primer proyecto no es "meter IA" — es ordenar el proceso. La IA viene después, y rinde mucho más cuando lo hace.',
            },
        ],
    },
    {
        slug: 'como-pedir-presupuesto-de-software',
        cat: 'Guía',
        title: 'Cómo pedir un presupuesto de software sin que te timen',
        desc: 'Todo lo que debes preguntar antes de contratar el desarrollo de tu app, sistema o web.',
        time: '10 min',
        blocks: [
            {
                type: 'p',
                text: 'Contratar desarrollo de software es distinto a contratar casi cualquier otro servicio: es difícil de valorar antes de tenerlo, es fácil de vender mal, y los errores se pagan meses después. Esta guía te da las preguntas concretas que debes hacer antes de firmar nada.',
            },
            { type: 'h2', text: 'Antes de pedir presupuesto' },
            {
                type: 'p',
                text: 'Ten claro, aunque sea en un documento de una página, qué problema quieres resolver y qué resultado esperas ver. No hace falta que sepas "cómo" se construye — pero sí qué necesitas que haga. Un proveedor serio te ayuda a afinar esto en la primera conversación; uno que te presupuesta sin preguntar casi nada es la primera señal de alarma.',
            },
            { type: 'h2', text: 'Preguntas que debes hacer a cualquier proveedor' },
            {
                type: 'ul',
                items: [
                    '¿El presupuesto es cerrado o por horas? Si es por horas, ¿qué pasa si se superan las estimadas?',
                    '¿Quién es el dueño del código y de los datos al terminar el proyecto? (La respuesta correcta es siempre: tú.)',
                    '¿Qué pasa si quiero cambiar de proveedor de mantenimiento dentro de un año? ¿Me entregáis el proyecto completo y documentado?',
                    '¿Qué incluye el precio exactamente: diseño, desarrollo, pruebas, despliegue, soporte los primeros meses?',
                    '¿Cuánto cuesta el mantenimiento o las horas de soporte después de la entrega?',
                    '¿Puedo ver ejemplos de proyectos similares que hayáis hecho, aunque sea en una demo?',
                    '¿Cómo se gestionan los cambios de alcance a mitad de proyecto? (Todo proyecto tiene cambios — lo importante es que el proceso para gestionarlos esté claro desde el principio.)',
                ],
            },
            { type: 'h2', text: 'Señales de alarma en una propuesta' },
            {
                type: 'ul',
                items: [
                    'Precio muy por debajo del resto sin explicación de por qué (normalmente significa horas mal estimadas, que acabas pagando después como "extra").',
                    'No hay ningún documento por escrito de qué incluye el precio — todo "de palabra".',
                    'Te piden el pago completo por adelantado antes de empezar nada.',
                    'No preguntan casi nada sobre tu negocio antes de dar un número.',
                    'El contrato no menciona quién es el propietario del código al finalizar.',
                ],
            },
            { type: 'h2', text: 'Cómo comparar presupuestos de forma justa' },
            {
                type: 'p',
                text: 'No compares solo el número final. Pon en una tabla, para cada propuesta: qué incluye exactamente, qué pasa con el mantenimiento después, quién es dueño del resultado, y qué referencias o ejemplos previos tiene el proveedor. Un presupuesto más caro que incluye soporte, documentación y propiedad clara del código casi siempre sale más barato a dos años vista que uno más barato que no incluye nada de eso.',
            },
        ],
    },
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = ['Guía', 'Artículo', 'Caso práctico', 'Checklist'];

export function getResourceBySlug(slug: string): Resource | undefined {
    return RESOURCES.find((r) => r.slug === slug);
}
