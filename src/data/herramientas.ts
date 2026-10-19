// Herramientas gratis para pequeños negocios (v12, 18-oct-2026). Cada una responde a una búsqueda real
// (autocompletado de Google, España) y lleva de forma natural a lo que hacemos. El texto que explica cada
// herramienta vive en su página; aquí solo lo que comparten el índice y los enlaces cruzados.
export interface Herramienta {
  slug: string;
  nombre: string;
  /** La búsqueda que resuelve, con las palabras del dueño */
  busqueda: string;
  frase: string;
  icono: string;
  grupo: 'google' | 'dinero' | 'antes';
}

export const GRUPOS = [
  { id: 'google', titulo: 'Que te encuentren y te elijan' },
  { id: 'dinero', titulo: 'Papeles, precios y facturas' },
  { id: 'antes', titulo: 'Antes de contratar a nadie' },
] as const;

export const HERRAMIENTAS: Herramienta[] = [
  { slug: 'negocio-no-sale-en-google-maps', nombre: '¿Por qué tu negocio no sale en Google Maps?', busqueda: 'Mi negocio no sale en Google Maps', frase: 'Siete preguntas y te decimos qué falla y qué arreglar primero.', icono: 'map-pin', grupo: 'google' },
  { slug: 'plantilla-presupuesto-obra', nombre: 'Plantilla de presupuesto de obra', busqueda: 'Necesito hacer un presupuesto de obra', frase: 'Rellénala con tus partidas y descárgala en PDF, con tu IVA bien puesto.', icono: 'file-text', grupo: 'dinero' },
  { slug: 'calcular-iva-irpf-factura', nombre: 'Calculadora de IVA e IRPF para facturas', busqueda: '¿Cuánto pongo de IVA y de IRPF en la factura?', frase: 'Base, IVA, retención y total, o al revés: lo que quieres cobrar limpio.', icono: 'receipt', grupo: 'dinero' },
  { slug: 'calcular-margen-y-precio', nombre: 'Calculadora de margen y precio', busqueda: '¿Cuánto tengo que cobrar?', frase: 'Precio de venta con el margen que quieres, o tu precio por hora sin perder dinero.', icono: 'calculator', grupo: 'dinero' },
  { slug: 'poner-negocio-en-google-maps', nombre: 'Poner tu negocio en Google Maps, paso a paso', busqueda: '¿Cómo pongo mi negocio en Google Maps?', frase: 'Doce pasos que puedes ir marcando, en el orden en que se hacen.', icono: 'map', grupo: 'google' },
  { slug: 'pedir-resenas-google', nombre: 'Enlace y QR para pedir reseñas en Google', busqueda: '¿Cómo consigo reseñas en Google?', frase: 'Tu enlace directo, un QR para el mostrador y el mensaje listo para WhatsApp.', icono: 'badge-check', grupo: 'google' },
  { slug: 'responder-resenas', nombre: 'Respuestas a reseñas de Google', busqueda: '¿Cómo respondo a una reseña negativa?', frase: 'Elige el caso y te sale una respuesta con tu nombre, lista para copiar.', icono: 'messages-square', grupo: 'google' },
  { slug: 'enlace-whatsapp', nombre: 'Enlace de WhatsApp con mensaje y QR', busqueda: '¿Cómo hago que me escriban por WhatsApp desde la web?', frase: 'Tu enlace wa.me con el mensaje escrito, su QR y el botón para tu web.', icono: 'message-circle', grupo: 'google' },
  { slug: 'verifactu-me-afecta', nombre: '¿Te afecta Verifactu?', busqueda: '¿Verifactu me afecta? ¿Cuándo?', frase: 'Cuatro preguntas y te decimos si te afecta, desde cuándo y qué hacer.', icono: 'shield-check', grupo: 'dinero' },
  { slug: 'cuanto-cuesta-una-pagina-web', nombre: '¿Cuánto cuesta una página web en España?', busqueda: '¿Cuánto cuesta una página web?', frase: 'Precios publicados por agencias y un comparador de presupuestos a tres años.', icono: 'globe', grupo: 'antes' },
];

export const herramienta = (slug: string) => HERRAMIENTAS.find((h) => h.slug === slug)!;
