// Qué lleva la cabecera de cada página interior (16-nov-2026, «el aro con la solución dentro»).
// La firma de OpsPilot es su logo, el aro (horizonte de un instrumento: arco blanco arriba, verde abajo). En cada página
// interior el aro va en grande y, dentro, un móvil con la solución de esa página funcionando: el mapa, la web real de
// un cliente (J.R.), la de Córdoba Soluciona, la de PresupuesYa (nuestro programa), el panel de pedidos, el chat o la calculadora.
// Sustituye a «La mesa» (tira de pizarra con un objeto dibujado), que no era de la paleta de la marca\n// y se veía de juguete al lado de la tienda 3D de la portada.
//   · 'aro'     → solo el aro grande, sin móvil (guías, listado de recursos, 404)
//   · 'ninguno' → sin aro (legales)
// Una ruta que no esté en la tabla rompe la construcción (y `astro dev`): nada de cabeceras por defecto sin querer.

export type ClaveObjeto = 'maps' | 'web' | 'cordoba' | 'presupuesya' | 'panel' | 'chat' | 'calc' | 'aro' | 'ninguno';

export const OBJETO_POR_RUTA: Record<string, ClaveObjeto> = {
  '/posicionamiento-google-maps-cordoba/': 'maps',
  '/webs/': 'cordoba',             // la web de Córdoba Soluciona, web nuestra (pedido del fundador, 16-nov)
  '/soluciones/': 'presupuesya',   // la web de PresupuesYa, nuestro programa de presupuestos (pedido del fundador, 16-nov)
  '/contacto/': 'chat',
  '/herramientas/': 'calc',
  '/recursos/': 'aro',
  '/herramientas/calcular-iva-irpf-factura/': 'calc',
  '/herramientas/calcular-margen-y-precio/': 'calc',
  '/herramientas/plantilla-presupuesto-obra/': 'panel',
  '/herramientas/verifactu-me-afecta/': 'panel',
  '/herramientas/enlace-whatsapp/': 'chat',
  '/herramientas/negocio-no-sale-en-google-maps/': 'maps',
  '/herramientas/pedir-resenas-google/': 'maps',
  '/herramientas/poner-negocio-en-google-maps/': 'maps',
  '/herramientas/responder-resenas/': 'maps',
  '/aviso-legal/': 'ninguno',
  '/privacidad/': 'ninguno',
  '/cookies/': 'ninguno',
  '/404/': 'aro',
};
/** Todas las guías (/recursos/<slug>/) llevan el aro solo. */
const PREFIJOS: [string, ClaveObjeto][] = [['/recursos/', 'aro']];

/** Objeto de una ruta. Una ruta que no esté en la tabla rompe la construcción. */
export function objetoDeRuta(ruta: string): ClaveObjeto {
  const r = ruta.endsWith('/') ? ruta : ruta + '/';
  if (OBJETO_POR_RUTA[r]) return OBJETO_POR_RUTA[r];
  const p = PREFIJOS.find(([pre]) => r.startsWith(pre));
  if (p) return p[1];
  throw new Error(`CabeceraPagina: la ruta ${r} no tiene objeto. Añádela a OBJETO_POR_RUTA (src/lib/objetos-pagina.ts).`);
}
