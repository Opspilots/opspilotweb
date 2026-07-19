export type ResourceCategory = 'Guía' | 'Artículo' | 'Caso práctico' | 'Checklist' | 'Producto';

export type ResourceBlock =
    | { type: 'p'; text: string }
    | { type: 'h2'; text: string }
    | { type: 'ul'; items: string[] }
    | { type: 'ol'; items: string[] }
    | { type: 'note'; text: string }
    | { type: 'link'; text: string; href: string };

export interface Resource {
    slug: string;
    cat: ResourceCategory;
    title: string;
    desc: string;
    time: string;
    featured?: boolean;
    /** Ruta pública de la imagen de portada 16:9 (webp). Opcional: sin ella se usa el placeholder CSS. */
    cover?: string;
    /** Fecha de publicación en ISO 8601 (p.ej. '2026-06-15'). Alimenta datePublished del Article JSON-LD. */
    date?: string;
    /** Fecha de última actualización en ISO 8601. Alimenta dateModified; si falta, se usa `date`. */
    updated?: string;
    /** Autor visible y del structured data. Por defecto 'Equipo OpsPilot'. */
    author?: string;
    /** Pares pregunta/respuesta para el bloque FAQ y el FAQPage JSON-LD. */
    faq?: { q: string; a: string }[];
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
        cover: '/images/resources/automatiza-tu-negocio-sin-saber-de-tecnologia.webp',
        date: '2026-06-18',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Se puede automatizar un negocio sin saber programar?',
                a: 'Sí. La mayoría de automatizaciones útiles para una PYME se montan con herramientas no-code (Zapier, Make, el propio CRM) o con software ya construido para tu sector. No necesitas escribir código: necesitas conocer bien tu proceso actual.',
            },
            {
                q: '¿Por dónde empiezo a automatizar mi negocio?',
                a: 'Por el proceso repetitivo que más tiempo te roba y menos criterio exige: copiar datos entre Excel, hacer seguimientos, generar el mismo documento cada semana. Mide cuánto tiempo se va hoy, automatiza ese, y mide de nuevo un mes después.',
            },
            {
                q: '¿Cuánto se tarda en ver resultados de una automatización?',
                a: 'Una primera automatización bien elegida (mucho tiempo ahorrado, poco esfuerzo de montaje) suele dar resultado en semanas, no en meses. Esa primera victoria es la que justifica seguir digitalizando el resto.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Respuesta corta: automatizar tu negocio no exige saber de tecnología. Exige conocer tu proceso actual y elegir bien qué tarea repetitiva quitas de encima primero. El resto son herramientas.',
            },
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
        title: '5 señales de que tu PYME necesita un sistema de gestión (ERP/CRM)',
        desc: 'Pierdes clientes por falta de seguimiento, tus datos viven en Excel sueltos y no sabes tu margen real. 5 señales de que necesitas un sistema.',
        time: '5 min',
        date: '2025-11-12',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Cuándo necesita una PYME un sistema de gestión?',
                a: 'Cuando el caos operativo ya cuesta dinero o clientes: se escapan seguimientos comerciales, los datos viven en Excels duplicados, no sabes tu margen hasta cerrar el mes y cada persona nueva tarda semanas en aprender los procesos. Con tres o más señales, el "no sistema" ya te está costando más que el software.',
            },
            {
                q: '¿Qué diferencia hay entre un ERP y un CRM?',
                a: 'Un CRM gestiona la relación comercial (leads, seguimientos, ventas). Un ERP gestiona la operación interna (facturación, inventario, costes, personal). Muchas PYMEs empiezan por el dolor más agudo y amplían después; algunas plataformas cubren ambos.',
            },
            {
                q: '¿Excel sirve como sistema de gestión?',
                a: 'Excel es excelente para calcular y terrible como base de datos de negocio: no controla quién cambió qué, las versiones se duplican y un error de fórmula puede pasar meses sin detectarse. Sirve para arrancar, no para escalar.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Respuesta rápida: tu PYME necesita un sistema de gestión cuando el desorden ya te cuesta clientes, horas o margen — no cuando "toca digitalizarse". Estas cinco señales lo confirman.',
            },
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
        title: 'De Excel a sistema: cómo una empresa de reformas multiplicó su capacidad de obra',
        desc: 'Caso ilustrativo: cómo una empresa de reformas pasó de Excel y albaranes en papel a un sistema con certificaciones automáticas y coste real.',
        time: '6 min',
        date: '2026-02-20',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Cómo se digitaliza una empresa de reformas que trabaja con Excel?',
                a: 'Por fases: primero un catálogo de partidas y packs reutilizables para dejar de escribir cada presupuesto desde cero; después certificaciones de obra automáticas con firma digital del cliente; y por último control de coste real (materiales y subcontratas) imputado a cada obra para saber el margen en tiempo real.',
            },
            {
                q: '¿Qué es una certificación de obra y por qué automatizarla?',
                a: 'Es lo que se factura según avanza el trabajo, comparando lo presupuestado con lo ejecutado. Hecha a mano cada mes es lenta y propensa a error; generada desde las partidas ya ejecutadas y versionada, es trazable y ocupa minutos.',
            },
        ],
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
        title: '¿Tu web trabaja para ti o contra ti? Checklist de 10 puntos',
        desc: 'Auditoría web gratuita en 10 puntos: velocidad en móvil, contacto visible, SSL y objetivo claro. Comprueba si tu web capta clientes o los espanta.',
        time: '3 min',
        date: '2025-09-30',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Cómo sé si mi web está funcionando bien?',
                a: 'Revisa 10 puntos clave: carga en menos de 3 segundos en móvil con datos, teléfono o WhatsApp visible sin scroll, se ve bien en móvil, un objetivo claro por página, explica qué haces en la primera pantalla, sin enlaces rotos, aparece en Google por tu negocio + ciudad, tiene certificado SSL, el formulario funciona y se actualizó en el último año. Fallar en tres o más significa que pierde clientes.',
            },
            {
                q: '¿Por qué es tan importante que la web cargue rápido en el móvil?',
                a: 'Porque la mayoría de tus visitantes entran desde el móvil con datos, no con wifi. Si tarda más de 3 segundos, muchos se van antes de ver nada. Compruébalo con la conexión de tu teléfono, no con el wifi de la oficina.',
            },
            {
                q: '¿Qué es el certificado SSL y por qué lo necesita mi web?',
                a: 'Es lo que activa el candado en la barra de direcciones y cifra la conexión. Sin él, Google y el navegador avisan al visitante de que la web "no es segura", lo que espanta antes de que llegue a contactar.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Respuesta rápida: tu web trabaja para ti si carga rápido en móvil, deja el contacto a la vista, tiene un objetivo claro por página y transmite confianza (SSL, contenido actual). Si falla en tres o más de los 10 puntos de abajo, está perdiendo clientes.',
            },
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
        title: 'Asistentes IA para empresas: ventajas, límites y cuándo implementar uno',
        desc: 'Qué hace bien hoy un asistente de IA en una empresa, qué no, y cuándo compensa invertir. Ventajas reales, límites y errores a evitar.',
        time: '7 min',
        date: '2026-05-08',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Para qué sirve un asistente de IA en una empresa?',
                a: 'Funciona muy bien en tareas concretas y repetibles: extraer datos de facturas y tickets con OCR, responder preguntas frecuentes, clasificar consultas entrantes, redactar primeros borradores y buscar información dentro de tu propio negocio. Siempre con revisión humana en decisiones que importan.',
            },
            {
                q: '¿Cuándo NO tiene sentido invertir en IA todavía?',
                a: 'Cuando el proceso está mal definido, los datos de partida son un caos, o la decisión tiene consecuencias legales o económicas serias sin ningún punto de revisión humana. Ahí el primer proyecto no es "meter IA": es ordenar el proceso.',
            },
            {
                q: '¿La IA se equivoca?',
                a: 'Sí, y lo hace con confianza: un asistente mal configurado puede dar una respuesta incorrecta con el mismo tono seguro que una correcta. Por eso necesita un punto de revisión humana en todo lo que afecte a dinero, contratos, salud o datos legales.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Respuesta directa: un asistente de IA rinde muy bien en tareas concretas y repetibles (extraer, clasificar, resumir, buscar) y mal en todo lo demás. Compensa cuando ya tienes un proceso claro y datos ordenados; no compensa para tapar un proceso roto.',
            },
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
        title: 'Cómo pedir un presupuesto de software sin que te timen: guía y preguntas',
        desc: 'Las preguntas que debes hacer antes de contratar desarrollo de software: propiedad del código, mantenimiento, alcance y señales de alarma en una propuesta.',
        time: '10 min',
        date: '2026-01-15',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Qué preguntar antes de contratar el desarrollo de software?',
                a: 'Pregunta si el presupuesto es cerrado o por horas, quién es el dueño del código y de los datos al terminar (la respuesta correcta es siempre: tú), qué incluye exactamente el precio, cuánto cuesta el mantenimiento después, si puedes ver proyectos similares y cómo se gestionan los cambios de alcance a mitad de proyecto.',
            },
            {
                q: '¿Cuáles son las señales de alarma en un presupuesto de software?',
                a: 'Precio muy por debajo del resto sin explicación, nada por escrito de qué incluye, pago completo por adelantado, que no pregunten casi nada sobre tu negocio antes de dar un número, y un contrato que no menciona quién es el dueño del código al finalizar.',
            },
            {
                q: '¿Es mejor un presupuesto cerrado o por horas?',
                a: 'Un presupuesto cerrado da certeza de coste pero exige un alcance bien definido. Por horas es más flexible, pero solo si acuerdas por escrito qué pasa cuando se superan las estimadas. Lo importante no es la modalidad: es que el proceso para gestionar cambios esté claro desde el principio.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Respuesta directa: para no equivocarte, exige por escrito qué incluye el precio, quién es el dueño del código al terminar (tú), y cuánto cuesta el mantenimiento después. Un proveedor que no pregunta por tu negocio antes de dar un número es la primera señal de alarma.',
            },
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
    {
        slug: 'fiscalidad-plataforma-fiscal-contable',
        cat: 'Producto',
        title: 'Fiscalidad: facturación, contabilidad PGC y modelos AEAT en una sola plataforma',
        desc: 'Plataforma fiscal y contable española completa, con SII y VeriFactu nativos, OCR de tickets y asistente IA. Para autónomos, PYMEs y asesorías.',
        time: '6 min',
        cover: '/images/resources/fiscalidad-plataforma-fiscal-contable.webp',
        date: '2026-07-02',
        updated: '2026-07-10',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Qué es VeriFactu y a quién obliga?',
                a: 'VeriFactu es el sistema de facturación verificable de la AEAT: cada factura deja de ser un documento que se imprime y pasa a ser un registro firmado y encadenado que se comunica a Hacienda. Fiscalidad genera ese XML firmado y gestiona el encadenamiento de forma nativa, sin módulos de pago aparte.',
            },
            {
                q: '¿Sirve Fiscalidad para autónomos y también para asesorías?',
                a: 'Sí. Autónomos que quieren facturar y presentar sus modelos sin hojas de cálculo, PYMEs que necesitan contabilidad completa según el PGC, y asesorías que gestionan varios clientes desde una cuenta con consolidación de grupos.',
            },
            {
                q: '¿Qué modelos de la AEAT calcula?',
                a: 'Modelos 303, 111, 115, 130, 190, 202, 347 y 390, calculados a partir de la contabilidad ya registrada, además del envío al SII.',
            },
            {
                q: '¿Las actualizaciones normativas tienen coste extra?',
                a: 'No. Las normas fiscales cambian (VeriFactu, nuevos modelos, cambios de tipos) y las actualizaciones están incluidas en la suscripción mensual fija, sin coste por documento.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Fiscalidad es nuestra plataforma fiscal y contable pensada desde cero para el contexto español. No es un software genérico traducido: la contabilidad sigue el Plan General Contable, los modelos son los de la AEAT, y el envío al SII y VeriFactu están integrados de forma nativa — no como un módulo de pago aparte.',
            },
            { type: 'h2', text: 'Para quién es' },
            {
                type: 'ul',
                items: [
                    'Autónomos que quieren facturar, llevar sus gastos y presentar sus modelos sin depender de una hoja de cálculo.',
                    'PYMEs que necesitan contabilidad completa (asientos, PGC, cierre) sin la complejidad de un ERP tradicional.',
                    'Asesorías y gestorías que gestionan múltiples clientes desde una misma cuenta, con consolidación de grupos.',
                ],
            },
            { type: 'h2', text: 'Qué problemas resuelve' },
            {
                type: 'p',
                text: 'El día a día fiscal de un negocio español está lleno de tareas mecánicas con riesgo real si se hacen mal: contabilizar cada factura, cuadrar el banco, calcular el 303 trimestral, no olvidar el 347 anual. Fiscalidad automatiza la parte mecánica — los asientos se generan solos a partir de las facturas, la conciliación bancaria sugiere los cruces, los modelos se calculan a partir de los datos ya contabilizados — y deja a la persona la parte de criterio.',
            },
            {
                type: 'p',
                text: 'Con la llegada de VeriFactu, además, la facturación deja de ser un documento que se imprime y pasa a ser un registro firmado y encadenado que se comunica a la AEAT. Fiscalidad genera ese XML firmado y gestiona el encadenamiento sin que el usuario tenga que saber qué hay debajo.',
            },
            { type: 'h2', text: 'Funcionalidades clave' },
            {
                type: 'ul',
                items: [
                    'Facturación, cobros y pagos, y contabilidad completa según el PGC con asientos automáticos.',
                    'Modelos AEAT 303, 111, 115, 130, 190, 202, 347 y 390 calculados desde la contabilidad.',
                    'Envío SII y VeriFactu nativos, con XML firmado y encadenado.',
                    'App móvil con acceso por biometría y captura de tickets con OCR — el gasto queda contabilizado desde el móvil.',
                    'Asistente IA fiscal para resolver dudas sobre tus propios datos, y consolidación de grupos de empresas.',
                ],
            },
            {
                type: 'note',
                text: 'Las normas fiscales cambian (VeriFactu, nuevos modelos, cambios de tipos). Las actualizaciones normativas están incluidas en la suscripción mensual fija — sin coste por documento ni sorpresas a fin de mes.',
            },
            {
                type: 'link',
                text: 'Es nuestro servicio de software a medida para asesorías — descúbrelo en Soluciones',
                href: '/soluciones',
            },
            { type: 'link', text: 'Ver Fiscalidad en acción', href: 'https://fiscalidad.mcpopspilot.org' },
        ],
    },
    {
        slug: 'energydeal-crm-energetico',
        cat: 'Producto',
        title: 'EnergyDeal: CRM vertical para agentes y comercializadoras energéticas',
        desc: 'Comparador multi-proveedor con snapshots inmutables, gestión por CIF con CUPS y liquidación de comisiones con trazabilidad completa.',
        time: '5 min',
        cover: '/images/resources/energydeal-crm-energetico.webp',
        date: '2026-03-11',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Qué es un CRM vertical para el sector energético?',
                a: 'Un CRM construido alrededor de los conceptos del sector: CUPS, puntos de suministro, tarifas de luz y gas por comercializadora y liquidación de comisiones. Un CRM genérico no sabe qué es un CUPS ni cómo se comisiona una venta energética; EnergyDeal sí.',
            },
            {
                q: '¿Para qué sirven los snapshots inmutables de una comparativa?',
                a: 'Congelan cada comparativa tal y como se generó. Aunque las tarifas cambien semanas después, puedes reproducir exactamente qué condiciones se ofrecieron al cliente, ante una reclamación o una auditoría.',
            },
            {
                q: '¿Cómo gestiona EnergyDeal las comisiones de los agentes?',
                a: 'Modela el ciclo completo con estados explícitos (pending, validated, paid, reverted) y log de auditoría: quién vendió qué, cuándo se activó el contrato, cuánto se debe y si ya se pagó. La conversación de fin de mes es sobre datos, no sobre memoria.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'EnergyDeal es un CRM B2B construido específicamente para el sector energético español: agentes comerciales que comparan y venden tarifas de luz y gas, y comercializadoras que gestionan carteras de puntos de suministro. Un CRM genérico no sabe qué es un CUPS ni cómo se liquida una comisión energética — EnergyDeal está construido alrededor de exactamente eso.',
            },
            { type: 'h2', text: 'Para quién es' },
            {
                type: 'ul',
                items: [
                    'Agentes y agencias comerciales del sector energético que trabajan con varias comercializadoras a la vez.',
                    'Comercializadoras que necesitan gestionar su canal de agentes con comisiones trazables.',
                    'Consultoras energéticas que hacen comparativas para clientes empresa con múltiples puntos de suministro.',
                ],
            },
            { type: 'h2', text: 'Qué problemas resuelve' },
            {
                type: 'p',
                text: 'El problema clásico del sector: se hace una comparativa para un cliente, pasan tres semanas, las tarifas cambian, y nadie puede demostrar qué condiciones se ofrecieron en su momento. EnergyDeal resuelve esto con snapshots inmutables — cada comparativa queda congelada tal y como se generó, reproducible meses después ante el cliente o ante una reclamación.',
            },
            {
                type: 'p',
                text: 'El segundo dolor es la liquidación de comisiones: quién vendió qué, cuándo se activó el contrato, cuánto se debe y si ya se pagó. EnergyDeal modela ese ciclo completo con estados explícitos y log de auditoría, para que la conversación de fin de mes sea sobre datos y no sobre memoria.',
            },
            { type: 'h2', text: 'Funcionalidades clave' },
            {
                type: 'ul',
                items: [
                    'Comparador multi-proveedor con snapshots históricos inmutables y reproducibles.',
                    'CRM B2B organizado por CIF, con sus CUPS y puntos de suministro asociados.',
                    'Pipeline de carga masiva de tarifas: PDF de la comercializadora → parseo → validación.',
                    'Comisiones con estados pending / validated / paid / reverted y trazabilidad completa.',
                    'Exportes fiscales (IVA y pagos) y log de auditoría de toda la actividad.',
                ],
            },
            {
                type: 'link',
                text: 'Es nuestro servicio de software a medida para el sector energético — descúbrelo en Soluciones',
                href: '/soluciones',
            },
            { type: 'link', text: 'Conocer EnergyDeal', href: 'https://energydeal.es' },
        ],
    },
    {
        slug: 'presupuestador-obra-bc3',
        cat: 'Producto',
        title: 'Presupuestador: presupuestos y certificaciones de obra con BC3 nativo',
        desc: 'SaaS para construcción y reformas: partidas con descomposición, firma digital del cliente, certificaciones versionadas y control de coste real con OCR.',
        time: '6 min',
        cover: '/images/resources/presupuestador-obra-bc3.webp',
        date: '2026-04-22',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Qué es el formato BC3/FIEBDC y por qué importa?',
                a: 'BC3 (estándar FIEBDC) es el formato español para intercambiar presupuestos de obra entre programas y agentes: constructoras, arquitectos y aparejadores. Presupuestador lo importa y exporta de forma nativa, así que puedes intercambiar mediciones sin rehacer nada a mano.',
            },
            {
                q: '¿Cómo ayuda a saber si una obra es rentable?',
                a: 'Con el control de coste real por OCR de albaranes: cada compra de material queda imputada a su obra en el momento y la comparación presupuestado-vs-real está disponible mientras la obra sigue abierta, cuando todavía se puede corregir el margen.',
            },
            {
                q: '¿Puede firmar el cliente los presupuestos y certificaciones?',
                a: 'Sí, mediante un enlace público donde firma digitalmente, con trazabilidad y sin imprimir nada. Las certificaciones se generan desde las partidas ejecutadas y quedan versionadas.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Presupuestador es un SaaS para empresas de construcción, reformas y estudios de arquitectura que siguen haciendo presupuestos en Excel y certificaciones a mano. Habla el idioma del sector — partidas, descompuestos, mediciones, certificaciones — y el formato estándar español BC3/FIEBDC de forma nativa, tanto para importar como para exportar.',
            },
            { type: 'h2', text: 'Para quién es' },
            {
                type: 'ul',
                items: [
                    'Empresas de reformas y constructoras pequeñas y medianas que presupuestan cada obra desde cero.',
                    'Estudios de arquitectura y aparejadores que intercambian presupuestos en BC3 con otros agentes.',
                    'Cualquier negocio de obra que factura por certificaciones y necesita saber si cada obra va en margen.',
                ],
            },
            { type: 'h2', text: 'Qué problemas resuelve' },
            {
                type: 'p',
                text: 'Hacer un presupuesto de obra en Excel lleva horas y cada uno es un documento distinto, sin catálogo común ni control de versiones. Presupuestador convierte ese trabajo en seleccionar partidas de un catálogo propio — con packs reutilizables ya descompuestos en mano de obra y materiales — y ajustar cantidades. De horas a minutos, con mucho menos error.',
            },
            {
                type: 'p',
                text: 'Y el problema que más dinero cuesta: no saber si una obra está siendo rentable hasta que termina. Con el control de coste real por OCR de albaranes, cada compra de material queda imputada a su obra en el momento, y la comparación presupuestado-vs-real está disponible mientras la obra sigue abierta — cuando todavía se puede corregir.',
            },
            { type: 'h2', text: 'Funcionalidades clave' },
            {
                type: 'ul',
                items: [
                    'Importación y exportación BC3/FIEBDC nativa.',
                    'Partidas estructuradas con descomposición en recursos, packs reutilizables y catálogo propio.',
                    'Firma digital del cliente vía enlace público — sin imprimir, con trazabilidad.',
                    'Certificaciones de obra con asistente y versionado (qué cambió entre la certificación 3 y la 4).',
                    'Control de rentabilidad por obra con OCR de albaranes.',
                ],
            },
            {
                type: 'note',
                text: '¿Quieres ver este flujo aplicado a un caso concreto? Lee el caso práctico "De Excel a sistema: cómo una empresa de reformas triplicó su capacidad" en esta misma sección de recursos.',
            },
            {
                type: 'link',
                text: 'Es nuestro servicio de software a medida para reformas e instalaciones — descúbrelo en Soluciones',
                href: '/soluciones',
            },
            { type: 'link', text: 'Probar Presupuestador', href: 'https://presupuestador.mcpopspilot.org' },
        ],
    },
    {
        slug: 'erp-hosteleria-tpv-restaurantes',
        cat: 'Producto',
        title: 'ERP Hostelería: TPV, inventario, reservas y personal para restaurantes y bares',
        desc: 'ERP todo-en-uno para el día a día de un negocio de hostelería: mesas y comandas, stock y proveedores, turnos, reservas y cierre de caja con analítica.',
        time: '5 min',
        cover: '/images/resources/erp-hosteleria-tpv-restaurantes.webp',
        date: '2026-06-30',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Qué incluye un ERP de hostelería?',
                a: 'Reúne en un solo sistema el TPV de sala (mesas y comandas), el inventario y los pedidos a proveedores, la gestión de personal y turnos, las reservas y el cierre de caja con analítica. Todo conectado: lo que se vende descuenta stock y la analítica se alimenta sola.',
            },
            {
                q: '¿Sirve para un grupo con varios locales?',
                a: 'Sí. Los grupos pequeños con más de un local pueden ver ventas y consumo por local en tiempo real, en lugar de sumar Excels de cada sitio a final de mes.',
            },
            {
                q: '¿Tiene permanencia o coste por terminal?',
                a: 'Funciona con suscripción mensual fija, sin permanencia y con soporte humano en español incluido, como el resto de productos de OpsPilot.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'ERP Hostelería reúne en un solo sistema todo lo que un restaurante o bar gestiona hoy con varias herramientas sueltas (o con libreta y pizarra): el TPV de sala, el inventario y los pedidos a proveedores, los turnos del personal, las reservas y el cierre de caja. Todo conectado: lo que se vende en sala descuenta stock, y la analítica se alimenta sola.',
            },
            { type: 'h2', text: 'Para quién es' },
            {
                type: 'ul',
                items: [
                    'Restaurantes y bares que quieren un único sistema en lugar de un TPV por un lado, un Excel de compras por otro y un grupo de WhatsApp para los turnos.',
                    'Negocios de hostelería con reservas (comidas de grupo, eventos) que necesitan un calendario fiable.',
                    'Grupos pequeños con más de un local que quieren ver ventas y consumo por local en tiempo real.',
                ],
            },
            { type: 'h2', text: 'Qué problemas resuelve' },
            {
                type: 'p',
                text: 'En hostelería el margen se pierde en los huecos entre herramientas: el stock que nadie descontó, el pedido al proveedor que se hizo a ojo, el cierre de caja que no cuadra y nadie sabe por qué. Al unificar venta, inventario y caja en el mismo sistema, esos huecos desaparecen — cada comanda descuenta ingredientes, cada cierre queda registrado, y las alertas de stock avisan antes de quedarse sin producto un sábado noche.',
            },
            { type: 'h2', text: 'Funcionalidades clave' },
            {
                type: 'ul',
                items: [
                    'TPV con gestión de mesas y comandas en tiempo real.',
                    'Inventario, catálogo de productos y pedidos a proveedores.',
                    'Calendario de reservas y citas.',
                    'Gestión de personal, turnos y permisos por rol.',
                    'Cierre de caja, analítica de ventas y consumo, y alertas de stock.',
                ],
            },
            {
                type: 'note',
                text: 'Como todos nuestros productos, ERP Hostelería funciona con suscripción mensual fija, sin permanencia y con soporte humano en español incluido.',
            },
            {
                type: 'link',
                text: 'Es nuestro servicio de software a medida para hostelería — descúbrelo en Soluciones',
                href: '/soluciones',
            },
            { type: 'link', text: 'Ver ERP Hostelería', href: 'https://erp.mcpopspilot.org' },
        ],
    },
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = ['Guía', 'Artículo', 'Caso práctico', 'Checklist', 'Producto'];

export function getResourceBySlug(slug: string): Resource | undefined {
    return RESOURCES.find((r) => r.slug === slug);
}
