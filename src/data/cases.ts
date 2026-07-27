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
import type { Case, ServiceLine } from './types';

/** Cómo se pinta cada línea de servicio en la tarjeta de un caso. Vive junto
 *  a los datos (mismo patrón que `NECESIDAD_LABEL`/`OBJETIVO_LABEL` en
 *  leadFunnel.ts) y no en types.ts, que es solo tipos: es una tabla de
 *  PRESENTACIÓN de 3 entradas atada 1:1 a la unión `ServiceLine`. `Record`
 *  y no un objeto suelto para que añadir una línea de servicio a la unión
 *  sin darle etiqueta no compile. */
export const SERVICE_LINE_LABEL: Record<ServiceLine, string> = {
    tienda: 'TIENDA',
    web: 'WEB',
    app: 'APP A MEDIDA',
};

/* ═══════════════════════════════════════════════════════════════════════
   DOS TIPOS DE CASO CONVIVIENDO AQUÍ, y hay que saber cuál se está leyendo
   ═══════════════════════════════════════════════════════════════════════
   Hasta ahora este fichero tenía 3 entradas y las 3 eran lo mismo:
   COMPOSICIONES. Cada una resume varios proyectos del mismo sector, su
   protagonista no es una empresa concreta y su testimonio va firmado por un
   cargo genérico. Eso no es una mentira mientras se diga —y se dice, ver
   CasesDisclaimer—, pero tampoco es una prueba: un visitante no puede
   comprobar ni una sola palabra.

   ObraFácil, la primera entrada de abajo, es de la otra clase: un cliente
   real, con su nombre, con su tienda publicada y con un enlace que se puede
   pulsar. Todo lo que cuenta su ficha está a un clic de contrastarse.

   Qué marca la diferencia EN EL DATO, y no en la prosa:
     · `client` — `{ kind: 'composite' }` en los 3 antiguos (no hay un
       cliente: hay varios proyectos resumidos) frente a `{ kind: 'named' }`
       en ObraFácil. Este campo es el que decide a quién cubre el descargo de
       CasesDisclaimer; ver el comentario de `ClientDisclosure` en types.ts.
     · `productionLink` — solo lo puede tener un caso real. Una composición
       no tiene URL porque no tiene proyecto único al que apuntar.
     · `serviceLine` — TIENDA / WEB / APP A MEDIDA.

   REGLA PARA AÑADIR EL SIGUIENTE: si es un cliente real, se nombra y se
   enlaza; y si no se puede enlazar, no se inventa nada para compensar. Las
   cifras de resultado (ventas, pedidos, facturación) NO entran aquí mientras
   no haya un dato de negocio verificado — es la misma regla que ya gobierna
   las maquetas (`CaseShowcase` en types.ts: ni un porcentaje, ni una
   gráfica, ni un contador).

   TODO(negocio) que sigue abierto, ahora solo para los 3 compuestos:
     · `serviceLine` — la narrativa de los tres habla de "sistema a medida",
       que sugiere `app`, pero sugerir no es confirmar.
     · `productId` — si el caso se construyó sobre uno de nuestros productos.
       Es tentador deducirlo de `sectorId` (reformas → Presupuestador,
       asesorías → Fiscalidad), pero sería inventar: que un cliente sea del
       sector reformas no demuestra que use Presupuestador, y pintar el
       enlace lo estaría AFIRMANDO delante de un visitante.
   Mientras estén vacíos, esos bloques simplemente no se renderizan: no hay
   hueco, ni placeholder, ni "próximamente". */

export const CASES: readonly Case[] = [
    /* ─── PRIMERO, y no por orden de llegada ────────────────────────────
       Los carruseles de la portada y de /casos enseñan UNA tarjeta a la vez
       (`flex: 0 0 100%`, sin asomo de la siguiente): la primera posición no
       es "la primera de la lista", es la única que ve quien no desliza. El
       único caso que un visitante puede verificar por su cuenta tiene que
       estar ahí. Mover esta entrada más abajo es una línea; que el 01/04 lo
       ocupe una composición cuando hay un cliente real disponible, no.

       Datos verificados entrando en obrafacil2025.es. La regla de este
       fichero es la de siempre: si no se ha visto, no se escribe. */
    {
        id: 'obrafacil',
        // FK al sector `reformas` (el de "Reformas, instalaciones y oficios").
        // Es el encaje honesto: ObraFácil no ejecuta reformas, vende el
        // material con el que se hacen — y su cliente final es exactamente
        // quien busca reformar sin obra. `pymes` habría sido el cajón de
        // sastre y no habría dicho nada.
        sectorId: 'reformas',
        // `globe` y no `building`: `building` ya identifica al caso de la
        // empresa de reformas y aquí el hecho diferencial no es el ladrillo,
        // es que la venta ocurre en internet.
        iconKey: 'globe',
        // `label` es el SECTOR del cliente y `serviceLine` es lo que le
        // construimos: por eso aquí no pone "Tienda" (eso ya lo dice la
        // etiqueta TIENDA de al lado) sino de qué vive el negocio.
        label: 'Material de reforma',
        title: 'Una tienda que vende placas y te dice cuántas necesitas',
        summary:
            'Tienda online de placas decorativas de PVC en Andalucía, con carrito, calculadora y WhatsApp.',
        text:
            'ObraFácil vende placas y paneles decorativos de PVC que se colocan sobre el azulejo existente, sin obra, además de palillería y suelo SPC, desde su almacén en la carretera de Puente Genil a Herrera. Vender eso por internet tiene dos frenos concretos: el catálogo es grande —más de cien imágenes de producto— y el particular que mira una placa no sabe cuántas le entran en su pared. Construimos la tienda entera alrededor de esos dos frenos: catálogo con carrito de compra, una calculadora de placas que traduce los metros de la pared a unidades, una galería de «antes y después» que enseña el resultado sobre azulejo real, página de servicios, preguntas frecuentes y un botón de WhatsApp para las dudas que no cierra una ficha de producto. La propia tienda anuncia más de 200 diseños en stock y respuesta por WhatsApp en 24 horas. Está publicada: se puede entrar y comprobarlo entero.',
        bullets: [
            'Catálogo con carrito de compra y más de cien imágenes de producto: placas de PVC, palillería y suelo SPC',
            'Calculadora de placas: el cliente sabe cuántas necesita para su pared sin echar cuentas',
            'Galería de «antes y después» sobre azulejo real, preguntas frecuentes y WhatsApp para las dudas',
        ],
        showcase: {
            // `warm` con esta entrada en cabeza deja la serie alternando
            // ámbar / mint / ámbar / mint al deslizar. Dos maquetas seguidas
            // del mismo acento se leen como la misma maqueta repetida.
            accent: 'warm',
            // NO 'Tienda online': la etiqueta TIENDA de la cabecera de la
            // tarjeta queda a dos centímetros de aquí y repetir la palabra
            // gasta el único renglón que tiene la maqueta para decir algo que
            // no se sepa ya. Esto dice de qué va el producto.
            kicker: 'Comprar sin obra',
            // Los cuatro tiles son módulos que la tienda TIENE, vistos en su
            // menú y en su portada. La rejilla de `modules` es de 4 columnas
            // en escritorio y 2×2 en móvil (MockPreview.module.css), así que
            // cuatro es el número que cuadra: un quinto se quedaría solo en
            // una fila. La galería de «antes y después» es el que se queda
            // fuera y por eso se cuenta en el texto, no se dibuja a medias.
            title: 'De la placa al pedido, sin salir de la tienda',
            sub: 'Catálogo, carrito, calculadora y WhatsApp para lo que no cabe en una ficha.',
            block: {
                type: 'modules',
                items: [
                    { key: 'catalogo', icon: 'layoutGrid', label: 'Catálogo', active: true },
                    { key: 'carrito', icon: 'shoppingCart', label: 'Carrito', active: true },
                    { key: 'calculadora', icon: 'calculator', label: 'Calculadora', active: true },
                    { key: 'whatsapp', icon: 'chatMessage', label: 'WhatsApp', active: true },
                ],
            },
        },
        // SIN `quote` ni `author`, y es una decisión, no un hueco. Los dos
        // campos son opcionales en `Case` justamente para esto: el cliente no
        // nos ha dado ninguna cita y escribirle una en la boca a una empresa
        // que se puede llamar por teléfono es peor que no tener testimonio.
        // El render de /casos ya no pinta el bloque cuando faltan (ver
        // Cases.tsx) — no queda ni el filete superior de la cita.
        serviceLine: 'tienda',
        client: { kind: 'named', name: 'ObraFácil' },
        // `productId` va FUERA: ObraFácil no está construida sobre ninguno de
        // los 4 SaaS del registro (products.ts), es un desarrollo entregado al
        // cliente. El campo es opcional en `Case` precisamente para poder
        // distinguir "es uno de los nuestros" de "es suyo", así que omitirlo
        // es la respuesta correcta y no una carencia.
        productionLink: {
            url: 'https://obrafacil2025.es',
            // La etiqueta dice a dónde va ANTES de pulsar, misma regla que las
            // de products.ts: esto es una tienda abierta al público, no una
            // aplicación con pantalla de acceso.
            label: 'Entrar en la tienda de ObraFácil',
            // Verificado en vivo. Si la tienda se cae o se rediseña, esto pasa
            // a 'down' y el enlace desaparece de las dos superficies sin tocar
            // ni un render (ver `isLinkable` en products.ts).
            availability: 'live',
        },
        // `screenshots` fuera: no hay ni una captura de la tienda en el repo y
        // no se fabrican placeholders. Cuando existan, se añaden aquí y el
        // modelo ya las admite.
    },
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
        // Composición de varios proyectos del sector, no un cliente concreto.
        // Único campo AÑADIDO a los 3 casos antiguos, y no aporta información
        // nueva: es exactamente lo que la web ya publicaba en el descargo de
        // CasesDisclaimer, movido de una frase de página a un dato por caso.
        // Ese movimiento es todo el arreglo — mientras fuera copy, la frase se
        // aplicaba a los 4 por igual y le decía a ObraFácil que es una
        // composición. Ahora el descargo pregunta al dato.
        client: { kind: 'composite' },
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
        client: { kind: 'composite' },
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
        client: { kind: 'composite' },
    },
];

export function getCase(id: string): Case | undefined {
    return CASES.find((c) => c.id === id);
}
