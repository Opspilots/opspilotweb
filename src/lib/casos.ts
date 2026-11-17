// Casos reales con nombre (permiso del fundador, 16-nov-2026). Fuente única del recorrido de casos (Recorrido.astro):
// la portada enseña uno por promesa, y cada página de solución, el suyo.
// Solo datos medidos, con fuente y fecha. Si se refrescan las cifras, se cambia aquí la fecha de la fuente.
// Las capturas (public/img/casos/) son de la web pública de cada cliente: si se vuelven a tomar, OTRO nombre de fichero
// (nginx las sirve inmutables).
// Córdoba Soluciona se enseña como web NUESTRA (ejemplo propio, no servicio de pasar obras), por pedido del fundador (16-nov).

export interface Caso {
  id: string;
  nombre: string;
  donde: string;
  /** colores medidos en su web: fondo, texto y acento */
  bg: string;
  fg: string;
  ac: string;
  titulo: string;
  texto: string;
  datos: { cifra: string; que: string; fuente: string }[];
  url: string;
  dominio: string;
  img: string;
  imgMovil: string;
  imgMovilAlto: number;
}

export const CASOS: readonly Caso[] = [
  {
    id: 'cordoba-soluciona', nombre: 'Córdoba Soluciona', donde: 'Web de reformas en Córdoba y provincia · nuestra',
    bg: '#2F5E3B', fg: '#FBFAF5', ac: '#FFC9A8',
    titulo: 'Una web de reformas que la gente encuentra cuando busca en Google',
    texto: 'Es nuestra. La montamos para comprobar en casa lo que luego hacemos en la tuya: una página por cada barrio y pueblo, y guías con precios, ayudas y licencias, que es lo que se busca antes de llamar a nadie.',
    datos: [{ cifra: '92', que: 'visitas desde Google en 28 días; las guías de ayudas y de licencias, las que más', fuente: 'Search Console, 13-sep a 10-oct-2026' }],
    url: 'https://cordobasoluciona.es/', dominio: 'cordobasoluciona.es', img: '/img/casos/cordoba-tall.webp', imgMovil: '/img/casos/cordoba-movil.webp', imgMovilAlto: 3759,
  },
  {
    id: 'jr-rodriguez', nombre: 'J.R. Rodríguez e Hijos', donde: 'Empresa de reformas en Córdoba',
    bg: '#2F3130', fg: '#F3F4EE', ac: '#9CA67B',
    titulo: 'Web nueva para una empresa de reformas, con sus obras de verdad',
    texto: 'Pasamos su web de WordPress a una más rápida, con sus obras reales y una página por tipo de reforma, y cuidamos su ficha de Google.',
    datos: [
      { cifra: '22 → 17,8', que: 'posición media en Google, en un mes', fuente: 'Search Console, 13-sep a 10-oct-2026 frente al mes anterior' },
      { cifra: '5,0', que: 'en Google, con 4 reseñas, todas respondidas', fuente: 'Su ficha de Google, 13-oct-2026' },
    ],
    url: 'https://rodriguezreformas.es/', dominio: 'rodriguezreformas.es', img: '/img/casos/jr-tall.webp', imgMovil: '/img/casos/jr-movil.webp', imgMovilAlto: 3798,
  },
  {
    id: 'maderas-yeadel', nombre: 'Maderas Yeadel', donde: 'Carpintería en Córdoba · marca nuestra',
    bg: '#302D2A', fg: '#FAF8F5', ac: '#C49A72',
    titulo: 'Una carpintería que empezó sin nombre y a las dos semanas ya salía en Google',
    texto: 'Es una marca que montamos desde cero con un carpintero de Córdoba: el nombre, el logo y una web con una página por servicio y por barrio, que da un precio orientativo antes de ir a medir.',
    datos: [{ cifra: '276', que: 'veces que salió en Google en sus dos primeras semanas, por carpintería, armarios a medida y montaje de muebles', fuente: 'Search Console, 29-sep a 10-oct-2026' }],
    url: 'https://maderasyeadel.es/', dominio: 'maderasyeadel.es', img: '/img/casos/yeadel-tall.webp', imgMovil: '/img/casos/yeadel-movil.webp', imgMovilAlto: 3686,
  },
  {
    id: 'obrafacil', nombre: 'ObraFácil', donde: 'Almacén de placas decorativas con reparto propio',
    bg: '#111111', fg: '#FFFFFF', ac: '#F5D800',
    titulo: 'Pedidos, reparto, facturas y stock en un solo panel',
    texto: 'Antes vendían por TikTok, WhatsApp y teléfono, y cada pedido vivía en un sitio. Ahora la tienda calcula cuántas placas lleva cada pared, y los pedidos, el reparto, las facturas y el stock están en un solo panel.',
    datos: [
      { cifra: '958', que: 'visitas desde Google en 28 días; el mes anterior, 485', fuente: 'Search Console, 13-sep a 10-oct-2026' },
      { cifra: '5,0', que: 'en Google, con 4 reseñas', fuente: 'Su ficha de Google, 13-oct-2026' },
    ],
    url: 'https://obrafacil2025.es/', dominio: 'obrafacil2025.es', img: '/img/casos/obrafacil-tall.webp', imgMovil: '/img/casos/obrafacil-movil.webp', imgMovilAlto: 3638,
  },
];
