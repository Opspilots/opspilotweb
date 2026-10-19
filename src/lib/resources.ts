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
                href: '/soluciones#asesorias',
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
                href: '/soluciones#energia',
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
                href: '/soluciones#reformas',
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
                href: '/soluciones#hosteleria',
            },
            { type: 'link', text: 'Ver ERP Hostelería', href: 'https://erp.mcpopspilot.org' },
        ],
    },
    {
        slug: 'gestion-leads-agencia-sin-crm',
        cat: 'Artículo',
        title: 'Cómo gestionar leads en tu agencia sin perderlos: pipeline visual sin software',
        desc: 'Por qué se pierden leads en una agencia, los primeros cambios para arreglarlo sin software y en qué momento sí compensa un CRM.',
        time: '6 min',
        date: '2026-07-25',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Cuántos leads se pierden realmente por no tener un CRM?',
                a: 'No hay una cifra universal — depende del volumen y de cuántas personas tocan el mismo lead. El patrón sí es constante: sin un sitio único donde quede registrado quién debe hacer el siguiente contacto, alguien asume que ya llamó otra persona y el lead se enfría sin que nadie lo decida. El problema no es la falta de software, es la falta de un sitio único.',
            },
            {
                q: '¿Qué datos mínimos hay que rastrear por cada lead?',
                a: 'Con poco alcanza al principio: de dónde vino, quién habló con él primero, qué necesita, cuándo toca el siguiente contacto y en qué fase está. Cinco campos, no cincuenta — añadir más campos de los que realmente se usan es la forma más rápida de que nadie los actualice.',
            },
            {
                q: '¿Puede un Excel bien montado sustituir a un CRM?',
                a: 'Durante un tiempo, sí, si tiene una fila por lead, columnas fijas y alguien revisándolo cada día. Deja de aguantar en cuanto dos personas lo editan a la vez sin control de versiones, o el volumen de leads supera lo que una persona puede repasar de un vistazo.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Respuesta rápida: los leads no se pierden por falta de un CRM. Se pierden porque nadie tiene un sitio único donde quede registrado quién debe hacer el siguiente contacto y cuándo. Eso se arregla antes de comprar ningún software — y conviene hacerlo antes.',
            },
            {
                type: 'p',
                text: 'En una agencia pequeña los leads entran por todas partes: un formulario web, un email suelto, un WhatsApp de un contacto, una recomendación en una comida. Cada canal tiene su propia lógica, y cuando nadie centraliza esa entrada, el seguimiento depende de la memoria de quien atendió primero. Funciona, hasta que esa persona tiene una semana mala o hasta que el volumen crece un poco.',
            },
            { type: 'h2', text: '¿Cómo se pierden los leads en una agencia?' },
            {
                type: 'p',
                text: 'El patrón se repite casi siempre igual: alguien contesta al primer contacto y queda en "le escribo la semana que viene". Esa nota vive solo en su cabeza o en un hilo de email que nadie más ve. Llega un lead nuevo, más urgente, y el primero se queda ahí, sin que nadie decida activamente abandonarlo. Nadie lo mató. Simplemente nadie lo siguió sosteniendo.',
            },
            {
                type: 'ul',
                items: [
                    'El lead vive en la bandeja de entrada de una sola persona, no en un sitio compartido.',
                    'No hay fecha de "próximo contacto" en ningún sitio visible para el resto del equipo.',
                    'Dos personas contactan al mismo lead sin saberlo, o nadie lo contacta y ambas creen que lo hizo la otra.',
                    'El estado del lead — interesado, en espera, descartado — solo lo sabe quien habló con él la última vez.',
                ],
            },
            { type: 'h2', text: 'La diferencia entre un CRM y una lista de contactos' },
            {
                type: 'p',
                text: 'Una lista de contactos guarda nombres. Un pipeline de verdad guarda estado: en qué fase está cada lead, quién es el responsable de moverlo y cuándo toca el siguiente paso. Esa diferencia no depende de qué herramienta uses. Puedes tenerla en un Excel bien pensado, y puedes no tenerla en un CRM carísimo mal configurado que nadie actualiza.',
            },
            {
                type: 'p',
                text: 'Lo que hace funcionar un pipeline no es el software: es que cada lead tenga siempre tres cosas claras — quién lo lleva, en qué fase está y cuándo toca volver a tocarlo. Sin esas tres cosas, da igual la herramienta.',
            },
            { type: 'h2', text: '5 señales de que tu pipeline está roto' },
            {
                type: 'ul',
                items: [
                    '"¿Qué pasó con aquel lead de hace tres semanas?" y nadie sabe responder sin rebuscar en el email.',
                    'Dos comerciales contactan al mismo cliente el mismo día, sin haberlo coordinado.',
                    'No sabes, sin preguntar a nadie, cuántos leads activos tienes ahora mismo.',
                    'Los leads calientes de esta semana y los descartados hace seis meses viven en el mismo sitio, sin distinguir.',
                    'Cuando alguien del equipo se va, su cartera de seguimientos se va con él.',
                ],
            },
            {
                type: 'note',
                text: 'Si te reconoces en dos o más señales, el problema no es (todavía) de herramienta. Es de proceso. Arregla el proceso primero.',
            },
            { type: 'h2', text: 'Por dónde empezar: primeros cambios sin software' },
            {
                type: 'p',
                text: 'Antes de mirar ningún software, hay cambios que no cuestan nada y arreglan la mayor parte del problema.',
            },
            {
                type: 'ol',
                items: [
                    'Un sitio único donde entra todo lead, sea cual sea el canal — aunque al principio sea copiar y pegar a mano en una hoja compartida.',
                    'Cinco columnas fijas y nada más: origen, responsable, fase, próximo contacto, notas.',
                    'Una revisión semanal de diez minutos donde el equipo repasa junto qué lead lleva más de una semana sin moverse.',
                ],
            },
            {
                type: 'p',
                text: 'Ese ritual semanal pesa más que la herramienta. Un Excel compartido con una revisión semanal disciplinada rinde más que un CRM caro que nadie mira. El software ordena el proceso; no lo sustituye.',
            },
            { type: 'h2', text: 'Cuándo sí vale la pena un CRM (y cuándo es prematuro)' },
            {
                type: 'p',
                text: 'Un CRM empieza a compensar cuando la hoja compartida y la revisión semanal ya no dan abasto: cuando hay tantos leads que nadie los repasa enteros de un vistazo, cuando necesitas que los recordatorios salgan solos en lugar de depender de que alguien mire el Excel, o cuando el equipo ya es lo bastante grande como para necesitar reportes automáticos de en qué fase está cada oportunidad.',
            },
            {
                type: 'p',
                text: 'Es prematuro cuando el volumen todavía cabe en una pantalla y el problema real es que nadie revisa el Excel que ya tienes. Ahí, comprar un CRM no arregla nada — solo cambia el nombre del archivo que nadie mira.',
            },
            {
                type: 'link',
                text: 'Es nuestro servicio de software a medida para agencias — descúbrelo en Soluciones',
                href: '/soluciones#agencias',
            },
        ],
    },
    {
        slug: 'migrar-de-excel-a-sistema-pyme',
        cat: 'Guía',
        title: 'De Excel a sistema: cómo migrar tu PYME sin perder datos ni parar el negocio',
        desc: 'Plan por fases para migrar tu PYME de Excel a un sistema de gestión sin parar la operativa, sin perder histórico y sin que el equipo se pierda en el cambio.',
        time: '8 min',
        date: '2026-07-25',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Hay que parar el negocio durante la migración?',
                a: 'No, si se hace por fases. El sistema antiguo puede seguir funcionando en paralelo mientras el nuevo se valida con datos reales, y solo se apaga Excel cuando el sistema nuevo ya demostró que funciona con tu operativa real — no antes.',
            },
            {
                q: '¿Cuánto tarda una PYME de 5-10 personas en migrar?',
                a: 'En rangos razonables, entre 4 y 10 semanas para un caso estándar de facturación, clientes e inventario básico, según cuántos años de histórico haya que limpiar y cuántas hojas distintas convivan hoy. Lo que alarga el plazo son las reglas particulares del proceso, no el tamaño del equipo.',
            },
            {
                q: '¿Se pierden los datos antiguos al cambiar de sistema?',
                a: 'Solo si la migración de histórico no se trata como una fase propia. Con un audit previo y una prueba con una muestra de datos antes de migrar todo, el histórico se conserva. Lo que sí suele perderse — y conviene aceptarlo — es el detalle de errores que Excel nunca detectó.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Respuesta directa: se puede migrar de Excel a un sistema de gestión sin parar el negocio ni perder datos, si se hace por fases y con el sistema antiguo funcionando en paralelo hasta que el nuevo esté probado. Lo que rompe negocios es intentar hacerlo todo de golpe.',
            },
            {
                type: 'p',
                text: 'Cambiar de Excel a un sistema de gestión da miedo por buenas razones. Parar la operativa unos días cuesta dinero real. Perder años de histórico es irrecuperable. Y un equipo que no adopta la herramienta nueva vuelve a Excel en la primera semana difícil. Ninguno de esos tres miedos se resuelve con un salto de fe. Se resuelve con un plan por fases.',
            },
            { type: 'h2', text: '¿Realmente necesitas cambiar, o solo organizarte mejor en Excel?' },
            {
                type: 'p',
                text: 'Antes de migrar, vale la pena preguntarse si el problema es Excel o es la disciplina con la que se usa. Si el caos viene de cinco copias del mismo archivo circulando por email, un Excel compartido, bien protegido y con una única versión válida puede aguantar bastante más de lo que parece. La migración empieza a tener sentido cuando el límite ya no es de orden, sino estructural: varias personas editando a la vez sin control de versiones, ningún registro de quién cambió qué, o un volumen de filas que ya nadie repasa entero.',
            },
            { type: 'h2', text: 'Cuáles son tus datos hoy: el audit previo' },
            {
                type: 'p',
                text: 'El primer paso real no es elegir el sistema nuevo. Es hacer inventario del caos actual: cuántas hojas de cálculo se usan de verdad (no las que existen "por si acaso"), quién las edita, qué campos se repiten entre ellas con nombres distintos, y qué parte de ese histórico arrastra errores conocidos que no conviene llevar sin más al sistema nuevo. Este ejercicio lleva un par de días y ahorra semanas de sorpresas después.',
            },
            { type: 'h2', text: 'Cómo preparar Excel para una migración sin errores' },
            {
                type: 'p',
                text: 'Los datos casi nunca están tan limpios como cree quien los usa a diario. Antes de exportar nada, conviene ordenar lo básico:',
            },
            {
                type: 'ul',
                items: [
                    'Unifica formatos de fecha y de campos de texto libre — el mismo cliente escrito de tres formas distintas cuenta como tres clientes para el sistema nuevo.',
                    'Elimina o marca las filas duplicadas antes de exportar, no después.',
                    'Decide con el equipo qué histórico merece migrarse completo y qué queda archivado como consulta puntual.',
                    'Haz una copia de seguridad del Excel original antes de tocar nada. Siempre.',
                ],
            },
            { type: 'h2', text: 'Fases de migración: no todo a la vez' },
            {
                type: 'p',
                text: 'La migración que sale mal casi siempre es la que intenta mover toda la operativa el mismo fin de semana. La que funciona empieza por un solo proceso — facturación, por ejemplo — y lo corre en paralelo con Excel durante unas semanas, comparando resultados entre los dos sistemas. Cuando ese proceso ya es fiable en el sistema nuevo, se apaga esa parte de Excel y se pasa al siguiente proceso. El negocio no se para en ningún momento porque siempre hay un sistema funcionando, viejo o nuevo, mientras el otro se valida.',
            },
            { type: 'h2', text: 'Cómo entrenar al equipo sin que todo explote' },
            {
                type: 'p',
                text: 'La formación que falla es la sesión única de dos horas donde se explica todo el sistema de golpe. La que funciona reparte el aprendizaje por fases, igual que la migración: cada persona aprende primero la parte del sistema que usa a diario, no el sistema completo. Y conviene aceptar de entrada que las dos primeras semanas van a ser más lentas que con Excel. Es el coste de aprender algo nuevo, no una señal de que el sistema esté mal elegido.',
            },
            {
                type: 'note',
                text: 'Nombra a una persona de referencia por equipo durante la transición — alguien a quien preguntar dudas del día a día sin depender de un ticket de soporte. Suele ser la diferencia entre una adopción que cuaja y una que se abandona a la primera semana difícil.',
            },
            {
                type: 'link',
                text: 'Es nuestro servicio de software a medida para PYMEs — descúbrelo en Soluciones',
                href: '/soluciones#pymes',
            },
        ],
    },
    {
        slug: 'cuando-pedir-software-a-medida-vs-estandar',
        cat: 'Guía',
        title: '¿Software a medida o estándar? Cómo decidir sin que te la cuelen',
        desc: 'Criterios objetivos para elegir entre software estándar y a medida, las preguntas clave antes de pedir presupuesto y las señales de que te están vendiendo de más.',
        time: '8 min',
        date: '2026-07-25',
        author: 'Equipo OpsPilot',
        faq: [
            {
                q: '¿Cuál es la complejidad mínima para que compense el software a medida?',
                a: 'Cuando tu proceso tiene reglas propias que ningún software estándar del mercado cubre, ni configurándolo, y esas reglas son el motivo real por el que ganas o pierdes dinero. Si un estándar resuelve el 80% con una configuración razonable, ese 20% restante rara vez justifica construir desde cero.',
            },
            {
                q: '¿Cuánto tarda y cuánto cuesta un desarrollo a medida?',
                a: 'En rangos orientativos: un proceso simple puede resolverse en 6-8 semanas, uno con varias integraciones en 3-4 meses, y un proyecto con múltiples módulos conectados puede llevar más. El coste varía mucho según el alcance real — desconfía de cualquier cifra cerrada antes de que alguien conozca tu proceso.',
            },
            {
                q: '¿Qué pasa si mis procesos cambian después de tener el software a medida?',
                a: 'Es la pregunta más importante y la que menos se hace. Un desarrollo bien planteado incluye un margen razonable de evolución, no solo la foto del proceso del día de la firma. Pregúntalo antes de firmar, no cuando ya necesites el cambio.',
            },
        ],
        blocks: [
            {
                type: 'p',
                text: 'Respuesta directa: no hay una opción mejor entre software estándar y a medida. Hay una pregunta mejor: ¿tu proceso tiene reglas propias que ningún software genérico resuelve, o solo necesitas configurar bien lo que ya existe? Esa respuesta decide — no la palabra "medida", que suena mejor en una reunión de ventas.',
            },
            {
                type: 'p',
                text: 'Un proveedor honesto es el que te ayuda a responder esa pregunta, no el que empuja siempre hacia "medida" porque es lo que más factura, ni el que empuja siempre hacia estándar porque es lo único que sabe vender. Puede ser OpsPilot o puede ser cualquier otro proveedor — lo que importa es que el criterio venga antes que el presupuesto.',
            },
            { type: 'h2', text: 'La diferencia: qué es estándar, qué es medida, y qué es lo que confunde a todos' },
            {
                type: 'p',
                text: 'Estándar es un software pensado para muchas empresas parecidas a la tuya, con opciones de configuración para ajustarlo a tu caso. A medida es un software construido específicamente para tu proceso, sin más usuarios tirando de esa misma lógica que tú. La confusión más habitual — y la que más dinero cuesta — es la venta de una configuración muy profunda de un estándar disfrazada de "medida", cuando en realidad sigues dentro de las costuras del producto genérico y pagando como si no lo estuvieras.',
            },
            { type: 'h2', text: '5 preguntas antes de pedir presupuesto de medida' },
            {
                type: 'ul',
                items: [
                    '¿Qué parte exacta de mi proceso no resuelve ningún software estándar del mercado, ni configurándolo?',
                    '¿Esa parte es el motivo real por el que gano o pierdo dinero, o es solo una preferencia?',
                    '¿Ya he probado a configurar un estándar antes de asumir que necesito medida?',
                    '¿Qué pasa con el mantenimiento y la evolución del software dentro de dos o tres años?',
                    '¿El proveedor me ha hecho estas mismas preguntas antes de proponerme "medida"?',
                ],
            },
            { type: 'h2', text: 'Cuándo estándar + configuración es más sabio que medida' },
            {
                type: 'p',
                text: 'La mayoría de procesos de negocio no son tan únicos como parecen desde dentro. Facturar, gestionar clientes, programar tareas, llevar inventario — son procesos que miles de empresas ya resolvieron, y el software estándar de ese sector suele llevar años puliendo justo esos casos. Configurar bien un estándar es casi siempre más barato, más rápido de poner en marcha, y viene con actualizaciones y soporte que un desarrollo a medida tiene que reinventar por su cuenta.',
            },
            { type: 'h2', text: 'Las fases donde todo puede salir mal (y cómo evitarlo)' },
            {
                type: 'ul',
                items: [
                    'Alcance impreciso al empezar — sin un documento claro de qué hace y qué no hace el software, cualquier ambigüedad se resuelve a tu costa.',
                    'Cambios de alcance sin proceso definido — todo proyecto los tiene; el problema es no saber de antemano cómo se valoran.',
                    'Entrega sin documentación ni propiedad clara del código — te deja atado a un único proveedor para siempre.',
                    'Falta de plan de mantenimiento — el software que no se actualiza envejece rápido, sobre todo si depende de integraciones externas.',
                ],
            },
            { type: 'h2', text: 'Cómo hablar con un proveedor sin que te vendan "medida" cuando es mantenimiento' },
            {
                type: 'p',
                text: 'Un proveedor honesto empieza la conversación intentando resolver tu problema con lo más simple posible, no vendiéndote lo más caro que tiene en catálogo. Si la primera propuesta que recibes es "medida" sin que nadie te haya preguntado antes si ya probaste opciones estándar, es una señal a tener en cuenta. Y lo mismo aplica al revés: un proveedor que solo vende estándar y nunca reconoce que tu caso podría necesitar algo distinto tampoco te está ayudando a decidir. Te está vendiendo lo que ya tiene construido.',
            },
            {
                type: 'note',
                text: 'La pregunta que mejor separa a un proveedor honesto de uno que solo quiere cerrar venta: pídele que te explique por qué NO deberías pedirle software a medida en tu caso. Si no tiene respuesta, sigue buscando.',
            },
            {
                type: 'link',
                text: 'Es nuestro servicio de software a medida para procesos únicos — descúbrelo en Soluciones',
                href: '/soluciones#medida',
            },
        ],
    },
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = ['Guía', 'Artículo', 'Caso práctico', 'Checklist', 'Producto'];

export function getResourceBySlug(slug: string): Resource | undefined {
    return RESOURCES.find((r) => r.slug === slug);
}
