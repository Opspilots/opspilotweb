// Datos y ayudas comunes a todas las páginas. La fuente única de datos de empresa sigue siendo
// src/lib/company.ts; aquí solo se construye lo que el HTML necesita (navegación y JSON-LD).
import { BRAND_NAME, CONTACT_EMAIL, PHONE, SITE_URL, ADDRESS, LEGAL_NAME, TAX_ID } from './company';

export { BRAND_NAME, CONTACT_EMAIL, PHONE, SITE_URL, ADDRESS, LEGAL_NAME, TAX_ID };

export const WA = (texto: string) => `https://wa.me/${PHONE.wa}?text=${encodeURIComponent(texto)}`;

export const NAV = [
  { href: '/soluciones/', label: 'Soluciones' },
  { href: '/casos/', label: 'Casos' },
  { href: '/productos/', label: 'Productos' },
  { href: '/recursos/', label: 'Recursos' },
] as const;

export const LINEAS = [
  { href: '/soluciones/webs-y-tiendas/', label: 'Webs y tiendas', corto: 'Webs y tiendas', icono: 'globe' },
  { href: '/soluciones/software-a-medida/', label: 'Software a medida', corto: 'Software a medida', icono: 'layout-dashboard' },
  { href: '/soluciones/automatizacion/', label: 'Automatización', corto: 'Automatización', icono: 'zap' },
] as const;

export const ORG_ID = `${SITE_URL}/#organization`;

/** Organization + WebSite: van en todas las páginas (el @graph se completa con lo propio de cada una). */
export function grafoBase() {
  const org: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BRAND_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/images/logo-opspilot.png`,
    slogan: 'Tecnología que encaja con cómo trabajas.',
    foundingDate: '2024',
    email: CONTACT_EMAIL,
    telephone: PHONE.e164,
    address: { '@type': 'PostalAddress', addressLocality: ADDRESS.locality, addressRegion: ADDRESS.region, addressCountry: ADDRESS.countryCode },
    areaServed: [
      { '@type': 'City', name: 'Córdoba' },
      { '@type': 'AdministrativeArea', name: 'Provincia de Córdoba' },
      { '@type': 'AdministrativeArea', name: 'Andalucía' },
      { '@type': 'Country', name: 'España' },
    ],
  };
  // Solo se declaran si existen: un dato inventado en el schema envenena la coherencia NAP.
  if (LEGAL_NAME) org.legalName = LEGAL_NAME;
  if (TAX_ID) org.taxID = TAX_ID;
  return [
    org,
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: BRAND_NAME, url: `${SITE_URL}/`, inLanguage: 'es-ES', publisher: { '@id': ORG_ID } },
  ];
}

export function migas(items: { nombre: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.nombre, item: `${SITE_URL}${it.path}` })),
  };
}

export const SERVICIO_LOCAL = {
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#service`,
  name: `${BRAND_NAME} · Desarrollo de software a medida en Córdoba`,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/images/og-horizonte.png`,
  telephone: PHONE.e164,
  priceRange: '€€',
  address: { '@type': 'PostalAddress', addressLocality: ADDRESS.locality, addressRegion: ADDRESS.region, addressCountry: ADDRESS.countryCode },
  geo: { '@type': 'GeoCoordinates', latitude: 37.8882, longitude: -4.7794 },
  areaServed: [
    { '@type': 'City', name: 'Córdoba' },
    { '@type': 'AdministrativeArea', name: 'Andalucía' },
    { '@type': 'Country', name: 'España' },
  ],
  serviceType: ['Desarrollo de software a medida', 'Diseño web', 'Tiendas online', 'Automatización de procesos', 'Integraciones', 'Agentes IA'],
  provider: { '@id': ORG_ID },
};

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
  };
}
