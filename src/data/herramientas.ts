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
}

export const HERRAMIENTAS: Herramienta[] = [
  { slug: 'negocio-no-sale-en-google-maps', nombre: '¿Por qué tu negocio no sale en Google Maps?', busqueda: 'Mi negocio no sale en Google Maps', frase: 'Siete preguntas y te decimos qué falla y qué arreglar primero.', icono: 'map-pin' },
  { slug: 'plantilla-presupuesto-obra', nombre: 'Plantilla de presupuesto de obra', busqueda: 'Necesito hacer un presupuesto de obra', frase: 'Rellénala con tus partidas y descárgala en PDF, con tu IVA bien puesto.', icono: 'file-text' },
  { slug: 'calcular-iva-irpf-factura', nombre: 'Calculadora de IVA e IRPF para facturas', busqueda: '¿Cuánto pongo de IVA y de IRPF en la factura?', frase: 'Base, IVA, retención y total, o al revés: lo que quieres cobrar limpio.', icono: 'receipt' },
  { slug: 'calcular-margen-y-precio', nombre: 'Calculadora de margen y precio', busqueda: '¿Cuánto tengo que cobrar?', frase: 'Precio de venta con el margen que quieres, o tu precio por hora sin perder dinero.', icono: 'calculator' },
];

export const herramienta = (slug: string) => HERRAMIENTAS.find((h) => h.slug === slug)!;
