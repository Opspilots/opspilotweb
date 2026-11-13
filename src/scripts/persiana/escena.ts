// «La persiana» · la escena 3D de la cabecera de la home (three.js, importado bajo demanda desde arranque.ts).
// Una fachada de comercio de Córdoba a última hora de la tarde: la parte alta y la ventana con reja al sol, la tienda
// en la sombra de la casa de enfrente. La persiana sube (al cargar, un poco; con el scroll, del todo) y dentro aparece
// el negocio ya digitalizado: el cartel de «Abierto», la web en la pantalla, el móvil del mostrador que se enciende con
// un WhatsApp y el plano con el pin pegado al cristal.
//
// Rendimiento: se pinta solo cuando algo cambia (no hay bucle continuo), se para fuera de pantalla y con la pestaña
// oculta, DPR limitado, las sombras del sol se calculan una vez y la del interior solo mientras se mueve la persiana.
import {
  ACESFilmicToneMapping, AdditiveBlending, AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color, CylinderGeometry, TubeGeometry,
  DirectionalLight, DoubleSide, Group, HemisphereLight, IcosahedronGeometry, LatheGeometry,
  Material, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PCFShadowMap, PerspectiveCamera, PlaneGeometry, PointLight,
  RepeatWrapping, Scene, Shape, Path, ShapeGeometry, SpotLight, SRGBColorSpace, Texture, TorusGeometry, Vector2, Vector3, WebGLRenderer,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as P from './fachada';
import { pintar } from './pintura';

const { muro: MU, hueco: HU, ventana: VE } = P.MED;

/** Estados de la persiana: 0 bajada del todo, 1 subida. */
export const INICIO = 0.12;     // el póster y el primer fotograma: una rendija de luz por debajo
export const INTRO = 0.42;      // la subida breve al cargar
const FOV = 36;

/**
 * Encuadres. «ancho»: escritorio y apaisado ancho (la escena es la columna derecha, algo más alta que ancha). «alto»: el
 * móvil y la tableta en vertical (la escena va entre el titular y los botones, bastante más alta que ancha). Cada uno
 * tiene su proporción de referencia (el póster se genera con ella y el canvas recorta igual que object-fit: cover) y sus
 * dos poses de cámara: A, la fachada entera (de la reja al azulejo); B, la tienda abierta, más cerca.
 */
export type Encuadre = 'ancho' | 'alto';
export const ASPECTOS: Record<Encuadre, number> = { ancho: 0.82, alto: 0.7 };

type Pose = { pos: Vector3; mira: Vector3 };
const POSES: Record<Encuadre, { a: Pose; b: Pose }> = {
  ancho: {
    a: { pos: new Vector3(-0.05, 2.2, 10.6), mira: new Vector3(-0.05, 2.05, 0) },
    b: { pos: new Vector3(0.72, 1.5, 4.8), mira: new Vector3(0.74, 1.36, -1) },
  },
  alto: {
    a: { pos: new Vector3(0.02, 2.05, 11.8), mira: new Vector3(0.02, 1.95, 0) },
    b: { pos: new Vector3(0.75, 1.75, 5.1), mira: new Vector3(0.75, 1.1, -1) },
  },
};

export interface Opciones {
  poster?: boolean;      // genera el póster: sin animación, buffer conservado, DPR 1
  movil?: boolean;       // sombras más pequeñas y DPR hasta 2
  encuadre?: Encuadre;
}

// El interior de la tienda (metros): fondo, ancho, baldas, mostrador, pantalla y lámpara. Lo usan la geometría y las
// texturas con la luz pintada (P.paredFondo, P.contactoSuelo).
const FONDO = -2.8;
const IX0 = HU.x0 - 0.5, IX1 = HU.x1 + 0.5;
const BALDAS = { x0: IX0 + 0.15, x1: IX0 + 1.2, ys: [1.0, 1.42, 1.84] };
const MOSTRADOR = { x0: 0.95, x1: 2.05, z0: -2.0, z1: -1.45 };
const LAMP_X = HU.x0 + 0.45;
const PANT = { x: 1.32, y: 1.86, w: 1.55, h: (1.55 * 576) / 1024 };
const ASPECTO_INICIAL = ASPECTOS.ancho;
const LAMPARA_MOSTRADOR = { x: 1.5, z: -1.68 };
/** El muelle de la persiana (rigidez, en 1/s²), cuánto se pasa la meta del tope arriba y cuánto rebota al llegar. */
const MUELLE = 30, REBASE = 0.06, REBOTE = 0.32;
/** A partir de qué apertura se enciende el móvil del mostrador. */
const AVISO = 0.9;
/** La pantalla del móvil apagada: casi negra (el cristal), y encendida, blanca (la textura tal cual). */
const PANTALLA_APAGADA = new Color(0.025, 0.027, 0.03);
const PANTALLA_ENCENDIDA = new Color(0.9, 0.9, 0.9);

/** Anisotropía de las texturas: la máxima de la GPU hasta 8 (se fija al crear el renderer). Es lo que mantiene nítidos
 *  los suelos y la pantalla vistos en ángulo. */
let aniso = 4;

/** Textura de un <canvas> pintado en fachada.ts. */
const tex = (c: HTMLCanvasElement, color = true) => {
  const t = new CanvasTexture(c);
  if (color) t.colorSpace = SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
};

/**
 * UV «de caja» en metros, para la madera: cada cara toma las dos coordenadas de su plano, con la veta siempre a lo
 * largo de x (o de z en los costados). Así una balda larga no estira la textura y la veta tiene la misma escala en todo.
 */
function uvCaja(g: BufferGeometry, escala: number) {
  const p = g.getAttribute('position') as BufferAttribute;
  const n = g.getAttribute('normal') as BufferAttribute;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u: number, v: number;
    if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); } else if (ax >= az) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u / escala;
    uv[i * 2 + 1] = v / escala;
  }
  g.setAttribute('uv', new BufferAttribute(uv, 2));
  return g;
}

/** Color por vértice (para juntar en una sola malla objetos de colores distintos). */
function colorear(g: BufferGeometry, hex: string) {
  const col = new Color(hex);
  const n = (g.getAttribute('position') as BufferAttribute).count;
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = col.r; a[i * 3 + 1] = col.g; a[i * 3 + 2] = col.b; }
  g.setAttribute('color', new BufferAttribute(a, 3));
  return g;
}

/** Plano horizontal (mirando arriba) de w × d con centro en (x, y, z): para las sombras de contacto. */
function planoSuelo(x: number, y: number, z: number, w: number, d: number) {
  const g = new PlaneGeometry(w, d);
  g.rotateX(-Math.PI / 2);
  g.translate(x, y, z);
  return g;
}

/** UV en metros de fachada: u, v de 0 a 1 sobre todo el muro, y la profundidad (z) se suma como si el muro se doblara. */
function uvFachada(g: BufferGeometry, modo: 'xy' | 'izq' | 'der' | 'techo' | 'suelo') {
  const p = g.getAttribute('position') as BufferAttribute;
  const uv = new Float32Array(p.count * 2);
  const W = MU.x1 - MU.x0;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i);
    const z = p.getZ(i);
    if (modo === 'izq') x = x + z;       // la jamba izquierda se «despliega» hacia la izquierda
    if (modo === 'der') x = x - z;
    if (modo === 'techo') y = y - z;
    uv[i * 2] = (x - MU.x0) / W;
    uv[i * 2 + 1] = y / MU.alto;
  }
  g.setAttribute('uv', new BufferAttribute(uv, 2));
  return g;
}

/** Caja colocada por sus extremos (en metros), no por su centro: así se lee igual que las medidas de la fachada. */
function caja(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const g = new BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return g;
}

/** Plano vertical de una jamba (hacia +x o -x), del borde del muro (z = 0) al fondo. */
function jamba(x: number, y0: number, y1: number, fondo: number, haciaDerecha: boolean) {
  const g = new PlaneGeometry(fondo, y1 - y0);
  g.rotateY(haciaDerecha ? Math.PI / 2 : -Math.PI / 2);
  g.translate(x, (y0 + y1) / 2, -fondo / 2);
  return g;
}

/** Perfil de la lama de la persiana (curva en S cada `paso` metros): da los brillos y sombras de la chapa ondulada. */
function persianaGeo(ancho: number, alto: number) {
  const paso = 0.078;
  const lamas = Math.ceil(alto / paso);
  const seg = lamas * 16;
  const g = new PlaneGeometry(ancho, alto, 1, seg);
  const p = g.getAttribute('position') as BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) + alto / 2;
    const f = (y % paso) / paso;
    // la S de la lama: una cresta redonda, el valle y la junta (el pliegue donde engancha la siguiente)
    // cara de la lama apenas abombada y, entre lama y lama, la junta: un surco estrecho y hondo (la raya oscura)
    let z = Math.sin((f / 0.88) * Math.PI) * 0.006;
    if (f >= 0.88) z = -0.01;
    p.setZ(i, z);
  }
  g.translate(0, alto / 2, 0);        // el origen, en el canto de abajo
  g.computeVertexNormals();
  return g;
}

/** Reja de forja voladiza: frente y costados de barrotes cuadrados, pletinas, y una corona de volutas. */
function rejaGeo() {
  const piezas: BufferGeometry[] = [];
  const vuelo = 0.2;
  const x0 = VE.x0 - 0.06, x1 = VE.x1 + 0.06, y0 = VE.y0 - 0.04, y1 = VE.y1 + 0.08;
  const b = 0.015;
  // barrotes del frente
  const n = Math.round((x1 - x0) / 0.105);
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    piezas.push(caja(x - b / 2, x + b / 2, y0, y1, vuelo - b / 2, vuelo + b / 2));
  }
  // barrotes de los costados
  for (const x of [x0, x1]) for (let k = 1; k <= 2; k++) {
    const z = (vuelo * k) / 3;
    piezas.push(caja(x - b / 2, x + b / 2, y0, y1, z - b / 2, z + b / 2));
  }
  // pletinas horizontales (marco y dos intermedias), en el frente y los costados
  for (const y of [y0, y0 + 0.36, y1 - 0.4, y1]) {
    piezas.push(caja(x0 - 0.01, x1 + 0.01, y - 0.018, y + 0.018, vuelo - 0.006, vuelo + 0.006));
    piezas.push(caja(x0 - 0.006, x0 + 0.006, y - 0.018, y + 0.018, 0, vuelo));
    piezas.push(caja(x1 - 0.006, x1 + 0.006, y - 0.018, y + 0.018, 0, vuelo));
  }
  // la bandeja de abajo (para las macetas) y el techo de la reja
  piezas.push(caja(x0, x1, y0 - 0.012, y0 + 0.004, 0, vuelo));
  // volutas: ces enfrentadas sobre la pletina de arriba
  const m = Math.round((x1 - x0) / 0.21);
  for (let i = 0; i < m; i++) {
    const cx = x0 + ((x1 - x0) * (i + 0.5)) / m;
    for (const s of [-1, 1]) {
      const t = new TorusGeometry(0.045, 0.006, 5, 14, Math.PI * 1.5);
      t.rotateZ(s > 0 ? -Math.PI / 4 : Math.PI * 0.75);
      t.translate(cx + s * 0.05, y1 + 0.05, vuelo);
      piezas.push(t);
    }
  }
  return mergeGeometries(piezas.map((g) => g.toNonIndexed()))!;
}

/** Maceta de barro con geranios: un torno para el tiesto y racimos de bolitas para hojas y flores. */
function maceta(rnd: () => number) {
  const grupo = new Group();
  const perfil = [new Vector2(0, 0), new Vector2(0.07, 0), new Vector2(0.095, 0.14), new Vector2(0.105, 0.15), new Vector2(0.105, 0.165), new Vector2(0.09, 0.165)];
  const barro = new MeshStandardMaterial({ color: '#B4643C', roughness: 0.85 });
  const tiesto = new Mesh(new LatheGeometry(perfil, 18), barro);
  tiesto.castShadow = tiesto.receiveShadow = true;
  grupo.add(tiesto);
  const hojas: BufferGeometry[] = [];
  const flores: BufferGeometry[] = [];
  for (let i = 0; i < 22; i++) {
    const g = new IcosahedronGeometry(0.035 + rnd() * 0.03, 0);
    const a = rnd() * Math.PI * 2, r = rnd() * 0.12;
    g.scale(1, 0.6, 1);
    g.translate(Math.cos(a) * r, 0.19 + rnd() * 0.12, Math.sin(a) * r * 0.7);
    hojas.push(g);
  }
  for (let i = 0; i < 7; i++) {
    const a = rnd() * Math.PI * 2, r = 0.03 + rnd() * 0.1;
    for (let k = 0; k < 5; k++) {
      const g = new IcosahedronGeometry(0.017, 0);
      g.translate(Math.cos(a) * r + (rnd() - 0.5) * 0.04, 0.3 + rnd() * 0.08 + (rnd() - 0.5) * 0.03, Math.sin(a) * r * 0.7 + (rnd() - 0.5) * 0.04);
      flores.push(g);
    }
  }
  const mh = new Mesh(mergeGeometries(hojas)!, new MeshStandardMaterial({ color: '#3F6B2E', roughness: 0.7, flatShading: true }));
  const mf = new Mesh(mergeGeometries(flores)!, new MeshStandardMaterial({ color: '#D2283A', roughness: 0.6, flatShading: true }));
  mh.castShadow = mf.castShadow = true;
  mh.receiveShadow = true;
  grupo.add(mh, mf);
  return grupo;
}

const pausa = () => new Promise<void>((r) => setTimeout(() => { marca = performance.now(); r(); }, 0));
// ?persiana-medir: escribe en la consola cuánto tarda cada paso del arranque (para buscar tareas largas)
const MEDIR = typeof location !== 'undefined' && new URLSearchParams(location.search).has('persiana-medir');
let marca = 0;
const cronometro = (paso: string) => { if (!MEDIR) return; const t = performance.now(); console.log(`[persiana] ${paso}: ${Math.round(t - marca)} ms (a los ${Math.round(t)})`); marca = t; };

export class Persiana {
  renderer: WebGLRenderer;
  scene = new Scene();
  camara = new PerspectiveCamera(FOV, ASPECTO_INICIAL, 0.1, 60);
  private persiana = new Group();
  private cartel = new Group();
  /** La pantalla del móvil del mostrador (se enciende con el aviso al abrir) y el brillo que deja en la madera. */
  private pantallaMovil!: MeshBasicMaterial;
  private brilloMovil!: MeshBasicMaterial;
  private foco!: SpotLight;
  private sol!: DirectionalLight;
  private interior!: PointLight;
  private encuadre: Encuadre;
  private ancho = 1;
  private alto = 1;
  // estado: lo que se ve (abierto) persigue al objetivo con un muelle con masa (ver paso())
  abierto = INICIO;
  objetivo = INICIO;
  private vAbierto = 0;
  private giro = Math.PI;      // el cartel: π enseña «Cerrado» a la calle; 0, «Abierto»
  private vGiro = 0;
  private avisoT = 0;
  private puntero = new Vector2();
  private punteroSuave = new Vector2();
  private ultimo = 0;
  private pidiendo = false;
  private rafId = 0;
  private liberado = false;
  /** Cuelga de aquí todo lo que se escucha en el canvas: liberar() lo quita de una vez. */
  private fin = new AbortController();
  activo = true;
  onFrame?: () => void;

  constructor(public canvas: HTMLCanvasElement, private op: Opciones = {}) {
    this.encuadre = op.encuadre ?? 'ancho';
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'default',
      preserveDrawingBuffer: !!op.poster,
      failIfMajorPerformanceCaveat: !op.poster && !new URLSearchParams(location.search).has('persiana-forzar'),
    });
    // sin comprobar errores de los programas: cada comprobación es una consulta síncrona a la GPU (con ?persiana-depurar, sí)
    this.renderer.debug.checkShaderErrors = new URLSearchParams(location.search).has('persiana-depurar');
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    aniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    this.ajustarDpr();
    // three recupera el render solo tras perder el contexto, pero las sombras tienen autoUpdate=false:
    // hay que pedir que se recalculen o la pared se queda sin la sombra proyectada
    canvas.addEventListener('webglcontextrestored', () => {
      if (this.sol) this.sol.shadow.needsUpdate = true;
      if (this.foco) this.foco.shadow.needsUpdate = true;
      this.pedir();
    }, { signal: this.fin.signal });
  }

  /** DPR del momento (puede cambiar al mover la ventana a otra pantalla o con el zoom), con tope: 1,75 en escritorio
   *  (lienzos grandes) y 2 en el móvil, donde el lienzo es pequeño (390 × 570 a DPR 2 son 0,9 Mpx) y a 1,75 se veía blando. */
  private ajustarDpr() {
    this.renderer.setPixelRatio(this.op.poster ? 1 : Math.min(window.devicePixelRatio || 1, this.op.movil ? 2 : 1.75));
  }

  /** Construye la escena por partes, cediendo el hilo entre ellas (sin tareas largas en móviles lentos). */
  async construir() {
    const movil = !!this.op.movil;
    marca = performance.now();
    // las texturas pesadas, una por tarea (pintura.ts)
    const img = await pintar({
      cal: () => P.calColor(1024), relieve: () => P.calRelieve(512), zocalo: () => P.zocalo(1024), acera: () => P.acera(1024),
      empedrado: () => P.empedrado(512), chapa: () => P.chapa(512), hidraulica: () => P.hidraulica(512), estuco: () => P.estuco(256),
      // en el móvil, los lienzos del interior a la mitad: ahí se ven pequeños, y así ninguno es una tarea larga
      madera: () => P.madera(movil ? 256 : 512), maderaRug: () => P.maderaRugosidad(movil ? 128 : 256), encimera: () => P.encimera(movil ? 512 : 1024),
      frente: () => P.frenteMostrador(MOSTRADOR.x1 - MOSTRADOR.x0, 0.86, movil ? 256 : 512),
      fondo: () => P.paredFondo(IX0, IX1, 3.0, BALDAS, PANT, LAMP_X),
      contacto: () => P.contactoSuelo(IX0, IX1, FONDO, MOSTRADOR),
      web: () => P.web(), movil: () => P.pantallaMovil(movil ? 0.6 : 1), plano: () => P.plano(), reflejo: () => P.reflejo(),
      abierto: () => P.cartel(true, movil ? 512 : 1024), cerrado: () => P.cartel(false, movil ? 512 : 1024), etiquetas: () => P.etiquetas(),
      blando: () => P.contactoBlando(), degradado: () => P.degradado(), azulejo: () => P.azulejo(),
    });

    cronometro('pintura');
    const s = this.scene;
    s.background = new Color('#1A2330');

    // ─── entorno para los reflejos (chapa, cristal, cerámica) ───
    // Sin mapa de entorno a propósito: three lo prepara con PMREM, y el sombreador de su desenfoque tarda SEGUNDOS en
    // compilar en Windows (ANGLE sobre D3D11) y en muchos móviles. Los brillos de la chapa salen de las luces.
    cronometro("paso 1");
    await pausa();

    // ─── materiales de la fachada ───
    const calMap = tex(img.cal);
    cronometro("paso 2");
    await pausa();
    const relieve = tex(img.relieve, false);
    relieve.wrapS = relieve.wrapT = RepeatWrapping;
    relieve.repeat.set((MU.x1 - MU.x0) / 1.4, MU.alto / 1.4);
    const cal = new MeshStandardMaterial({ map: calMap, bumpMap: relieve, bumpScale: 4, roughness: 0.94 });
    cronometro("paso 3");
    await pausa();

    const fachada = new Group();
    // la cara del muro: un contorno con la muesca de la tienda y el agujero de la ventana
    const sh = new Shape();
    const z = P.MED.zocalo;
    sh.moveTo(MU.x0, z - 0.02); sh.lineTo(HU.x0, z - 0.02); sh.lineTo(HU.x0, HU.y1); sh.lineTo(HU.x1, HU.y1);
    sh.lineTo(HU.x1, z - 0.02); sh.lineTo(MU.x1, z - 0.02); sh.lineTo(MU.x1, MU.alto); sh.lineTo(MU.x0, MU.alto); sh.closePath();
    const hv = new Path();
    hv.moveTo(VE.x0, VE.y0); hv.lineTo(VE.x0, VE.y1); hv.lineTo(VE.x1, VE.y1); hv.lineTo(VE.x1, VE.y0); hv.closePath();
    sh.holes.push(hv);
    const cara = new Mesh(uvFachada(new ShapeGeometry(sh), 'xy'), cal);
    cara.receiveShadow = true;
    fachada.add(cara);
    // jambas y techo del hueco de la tienda y de la ventana (con la cal «doblada» desde la cara)
    const G = MU.grosor, FV = 0.26;
    const jambas = [
      uvFachada(jamba(HU.x0, 0, HU.y1, G, true), 'izq'),
      uvFachada(jamba(HU.x1, 0, HU.y1, G, false), 'der'),
      uvFachada(jamba(VE.x0, VE.y0, VE.y1, FV, true), 'izq'),
      uvFachada(jamba(VE.x1, VE.y0, VE.y1, FV, false), 'der'),
    ];
    const techo = (x0: number, x1: number, y: number, f: number) => {
      const g = new PlaneGeometry(x1 - x0, f);
      g.rotateX(Math.PI / 2);
      g.translate((x0 + x1) / 2, y, -f / 2);
      return uvFachada(g, 'techo');
    };
    jambas.push(techo(HU.x0, HU.x1, HU.y1, G), techo(VE.x0, VE.x1, VE.y1, FV));
    const mJ = new Mesh(mergeGeometries(jambas)!, cal);
    mJ.receiveShadow = mJ.castShadow = true;
    fachada.add(mJ);
    // un muro «macizo» detrás de la cara, solo para que proyecte sombra (el foco del interior no atraviesa la pared)
    const macizo = new Mesh(mergeGeometries([
      caja(MU.x0, HU.x0, 0, MU.alto, -G, -0.02), caja(HU.x1, MU.x1, 0, MU.alto, -G, -0.02), caja(HU.x0, HU.x1, HU.y1, MU.alto, -G, -0.02),
    ])!, new MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
    macizo.castShadow = true;
    fachada.add(macizo);

    // zócalo de albero, a los dos lados del hueco y en las jambas
    const zMap = tex(img.zocalo);
    const zMat = new MeshStandardMaterial({ map: zMap, bumpMap: relieve, bumpScale: 0.8, roughness: 0.8 });
    const zGeos = [caja(MU.x0, HU.x0, 0, z, -0.02, 0.022), caja(HU.x1, MU.x1, 0, z, -0.02, 0.022)];
    const zg = mergeGeometries(zGeos.map((g) => g.toNonIndexed()))!;
    // UV del zócalo: x en todo el ancho del muro, y en su alto
    const zp = zg.getAttribute('position') as BufferAttribute;
    const zuv = new Float32Array(zp.count * 2);
    for (let i = 0; i < zp.count; i++) {
      zuv[i * 2] = (zp.getX(i) - MU.x0 + zp.getZ(i)) / (MU.x1 - MU.x0);
      zuv[i * 2 + 1] = zp.getY(i) / z;
    }
    zg.setAttribute('uv', new BufferAttribute(zuv, 2));
    const zm = new Mesh(zg, zMat);
    zm.receiveShadow = zm.castShadow = true;
    fachada.add(zm);
    s.add(fachada);
    cronometro("paso 4");
    await pausa();

    // ─── la ventana: postigos verdes cerrados, alféizar de piedra, reja con macetas y el farol ───
    const verdeMadera = new MeshStandardMaterial({ color: '#2C4A3B', roughness: 0.55 });
    const postigos = new Group();
    const anchoP = (VE.x1 - VE.x0) / 2;
    for (let i = 0; i < 2; i++) {
      const x0 = VE.x0 + i * anchoP;
      const piezas = [caja(x0 + 0.005, x0 + anchoP - 0.005, VE.y0, VE.y1, -FV - 0.04, -FV)];
      // cuarterones en relieve
      for (const [a, b] of [[0.08, 0.62], [0.72, 1.32]]) piezas.push(caja(x0 + 0.07, x0 + anchoP - 0.07, VE.y0 + a, VE.y0 + b, -FV, -FV + 0.015));
      const m = new Mesh(mergeGeometries(piezas)!, verdeMadera);
      m.receiveShadow = m.castShadow = true;
      postigos.add(m);
    }
    s.add(postigos);
    const piedra = new MeshStandardMaterial({ color: '#CFC6B5', roughness: 0.75, bumpMap: relieve, bumpScale: 1 });
    const alfeizar = new Mesh(caja(VE.x0 - 0.1, VE.x1 + 0.1, VE.y0 - 0.06, VE.y0, -FV, 0.22), piedra);
    alfeizar.castShadow = alfeizar.receiveShadow = true;
    s.add(alfeizar);
    cronometro('postigos');
    await pausa();
    const hierro = new MeshStandardMaterial({ color: '#1C1D1F', roughness: 0.55, metalness: 0.35 });
    const reja = new Mesh(rejaGeo(), hierro);
    reja.castShadow = true;
    reja.receiveShadow = true;
    s.add(reja);
    cronometro('reja');
    await pausa();
    const r = (() => { let a = 7; return () => ((a = (a * 16807) % 2147483647) / 2147483647); })();
    for (const x of [VE.x0 + 0.22, VE.x1 - 0.24]) {
      const m = maceta(r);
      m.position.set(x, VE.y0 + 0.004, 0.11);
      s.add(m);
    }
    cronometro('macetas');
    await pausa();
    // farol de forja sobre la ventana
    const farol = new Group();
    const brazo = new Mesh(mergeGeometries([caja(-0.012, 0.012, -0.012, 0.012, 0, 0.42), caja(-0.008, 0.008, -0.2, 0, 0.02, 0.03), caja(-0.06, 0.06, -0.1, 0.1, 0, 0.012)])!, hierro);
    brazo.castShadow = true;
    farol.add(brazo);
    const cuerpo = new Mesh(mergeGeometries([
      caja(-0.09, 0.09, -0.02, 0, -0.09, 0.09), caja(-0.06, 0.06, -0.36, -0.33, -0.06, 0.06),
      caja(-0.012, 0.012, 0, 0.06, -0.012, 0.012),
      ...[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([a, b]) => caja(a * 0.075 - 0.008, a * 0.075 + 0.008, -0.33, -0.02, b * 0.075 - 0.008, b * 0.075 + 0.008)),
    ])!, hierro);
    cuerpo.castShadow = true;
    const cristalF = new Mesh(caja(-0.07, 0.07, -0.32, -0.03, -0.07, 0.07), new MeshStandardMaterial({ color: '#3A3024', emissive: '#FFA040', emissiveIntensity: 0.35, roughness: 0.2, metalness: 0.3 }));
    const lampara = new Group();
    lampara.add(cuerpo, cristalF);
    lampara.position.set(0, -0.06, 0.42);
    farol.add(lampara);
    farol.position.set((VE.x0 + VE.x1) / 2, VE.y1 + 0.62, 0);
    s.add(farol);

    cronometro('farol');
    await pausa();
    // los cables de la luz cosidos a la fachada con grapas, combándose un poco entre una y otra (en Córdoba, en casi todas)
    const cables: BufferGeometry[] = [];
    for (const [y, zc, comba] of [[3.42, 0.025, 0.035], [3.5, 0.035, 0.05]]) {
      const puntos: Vector3[] = [];
      for (let x = MU.x0; x <= MU.x1 + 0.01; x += 0.1) {
        const tramo = ((x - MU.x0) % 1.5) / 1.5;
        puntos.push(new Vector3(x, y - Math.sin(tramo * Math.PI) * comba, zc));
      }
      cables.push(new TubeGeometry(new CatmullRomCurve3(puntos), 180, 0.007, 5, false));
      for (let x = MU.x0; x <= MU.x1; x += 1.5) cables.push(caja(x - 0.01, x + 0.01, y - 0.014, y + 0.014, 0, zc + 0.01));
    }
    const mCables = new Mesh(mergeGeometries(cables.map((g) => (g.index ? g.toNonIndexed() : g)))!, new MeshStandardMaterial({ color: '#151515', roughness: 0.5 }));
    mCables.castShadow = true;
    s.add(mCables);

    // placa de azulejo con el número, a la derecha de la tienda
    const azu = new Mesh(new BoxGeometry(0.4, 0.2, 0.012), [
      ...Array(4).fill(piedra), new MeshStandardMaterial({ map: tex(img.azulejo), roughness: 0.18 }), piedra,
    ]);
    azu.position.set(HU.x1 + 0.36, 2.05, 0.006);
    azu.castShadow = true;
    s.add(azu);
    cronometro("paso 5");
    await pausa();

    // ─── suelo: acera de granito, bordillo y empedrado ───
    const aMap = tex(img.acera);
    const suelo = new Mesh(new PlaneGeometry(MU.x1 - MU.x0, P.MED.acera), new MeshStandardMaterial({ map: aMap, roughness: 0.85, bumpMap: aMap, bumpScale: 1.2 }));
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.set((MU.x0 + MU.x1) / 2, 0, P.MED.acera / 2);
    suelo.receiveShadow = true;
    s.add(suelo);
    const bordillo = new Mesh(caja(MU.x0, MU.x1, -0.13, 0, P.MED.acera, P.MED.acera + 0.16), new MeshStandardMaterial({ color: '#A8A49C', roughness: 0.8, bumpMap: relieve, bumpScale: 1 }));
    bordillo.receiveShadow = true;
    s.add(bordillo);
    const eMap = tex(img.empedrado);
    eMap.wrapS = eMap.wrapT = RepeatWrapping;
    eMap.repeat.set((MU.x1 - MU.x0) / 3.2, 6 / 3.2);
    const calle = new Mesh(new PlaneGeometry(MU.x1 - MU.x0, 6), new MeshStandardMaterial({ map: eMap, bumpMap: eMap, bumpScale: 2.5, roughness: 0.8 }));
    calle.rotation.x = -Math.PI / 2;
    calle.position.set((MU.x0 + MU.x1) / 2, -0.13, P.MED.acera + 0.16 + 3);
    calle.receiveShadow = true;
    s.add(calle);
    cronometro("paso 6");
    await pausa();

    // ─── la persiana: chapa ondulada galvanizada, guías y la barra de abajo con su cerradura ───
    const chapa = tex(img.chapa);
    const ancho = HU.x1 - HU.x0 + 0.06;
    const altoP = HU.y1 + 0.02;
    const metal = new MeshStandardMaterial({ map: chapa, color: '#E2E5E7', metalness: 0.15, roughness: 0.5 });
    const lamas = new Mesh(persianaGeo(ancho, altoP), metal);
    lamas.castShadow = lamas.receiveShadow = true;
    const barra = new Mesh(caja(-ancho / 2, ancho / 2, 0, 0.07, -0.02, 0.024), new MeshStandardMaterial({ color: '#9A9FA2', metalness: 0.3, roughness: 0.42 }));
    barra.castShadow = true;
    const cerradura = new Mesh(mergeGeometries([caja(-0.05, 0.05, 0.012, 0.058, 0.024, 0.04), caja(-0.012, 0.012, 0.02, 0.05, 0.04, 0.05)])!, new MeshStandardMaterial({ color: '#7A6E5D', metalness: 0.4, roughness: 0.4 }));
    this.persiana.add(lamas, barra, cerradura);
    this.persiana.position.set((HU.x0 + HU.x1) / 2, 0, -0.1);
    s.add(this.persiana);
    const guia = new MeshStandardMaterial({ color: '#8A8F92', metalness: 0.3, roughness: 0.5 });
    const guias = new Mesh(mergeGeometries([caja(HU.x0, HU.x0 + 0.045, 0, HU.y1, -0.15, -0.05), caja(HU.x1 - 0.045, HU.x1, 0, HU.y1, -0.15, -0.05)])!, guia);
    guias.castShadow = guias.receiveShadow = true;
    s.add(guias);
    cronometro("paso 7");
    await pausa();

    // ─── el interior: escaparate, plano, cartel, mostrador con el móvil, baldas, lámparas y la pantalla con la web ───
    const fondo = FONDO, ix0 = IX0, ix1 = IX1;
    const hid = tex(img.hidraulica);
    hid.wrapS = hid.wrapT = RepeatWrapping;
    hid.repeat.set((ix1 - ix0) / 0.8, -fondo / 0.8);
    const sueloI = new Mesh(new PlaneGeometry(ix1 - ix0, -fondo), new MeshStandardMaterial({ map: hid, color: '#C4BBAA', roughness: 0.5 }));
    sueloI.rotation.x = -Math.PI / 2;
    sueloI.position.set((ix0 + ix1) / 2, 0.003, fondo / 2);
    sueloI.receiveShadow = true;
    s.add(sueloI);
    const est = tex(img.estuco);
    est.wrapS = est.wrapT = RepeatWrapping;
    est.repeat.set(3, 2);
    const pared = new MeshStandardMaterial({ map: est, color: '#B9A486', roughness: 0.9 });
    // la pared del fondo, con la luz y la oclusión pintadas (ver P.paredFondo)
    const lampX = LAMP_X;
    const pantW = PANT.w, pantH = PANT.h;
    const pc = new Vector3(PANT.x, PANT.y, fondo + 0.04);
    const fondoTex = tex(img.fondo);
    const pFondo = new Mesh(new PlaneGeometry(ix1 - ix0, 3.0), new MeshStandardMaterial({ map: fondoTex, roughness: 0.92 }));
    pFondo.position.set((ix0 + ix1) / 2, 1.5, fondo);
    pFondo.receiveShadow = true;
    s.add(pFondo);
    const contacto = new Mesh(new PlaneGeometry(ix1 - ix0, -fondo), new MeshBasicMaterial({ map: tex(img.contacto), transparent: true, depthWrite: false }));
    contacto.rotation.x = -Math.PI / 2;
    contacto.position.set((ix0 + ix1) / 2, 0.006, fondo / 2);
    s.add(contacto);
    const paredes = new Mesh(mergeGeometries([
      caja(ix0 - 0.05, ix0, 0, 3.1, fondo, -G), caja(ix1, ix1 + 0.05, 0, 3.1, fondo, -G),
      caja(ix0, ix1, 3.0, 3.05, fondo, -G),
    ])!, pared);
    paredes.receiveShadow = true;
    s.add(paredes);
    cronometro('paredes');
    await pausa();
    // el escaparate: marco de aluminio bronce, puerta a la izquierda y fijo a la derecha
    const zV = -0.4;
    const marco = new MeshStandardMaterial({ color: '#3B342C', metalness: 0.25, roughness: 0.45 });
    const xm = HU.x0 + 1.0;
    const mMarco = new Mesh(mergeGeometries([
      caja(HU.x0, HU.x1, 0, 0.1, zV - 0.05, zV), caja(HU.x0, HU.x1, HU.y1 - 0.06, HU.y1, zV - 0.05, zV),
      caja(HU.x0, HU.x0 + 0.06, 0, HU.y1, zV - 0.05, zV), caja(HU.x1 - 0.06, HU.x1, 0, HU.y1, zV - 0.05, zV),
      caja(xm - 0.03, xm + 0.03, 0, HU.y1, zV - 0.05, zV), caja(HU.x0, xm, 2.12, 2.17, zV - 0.05, zV),
      caja(HU.x0 + 0.88, HU.x0 + 0.91, 0.95, 1.12, zV - 0.08, zV - 0.05), // tirador
    ])!, marco);
    mMarco.castShadow = mMarco.receiveShadow = true;
    s.add(mMarco);
    // el cristal: casi no se ve, pero suma un reflejo tenue de la calle en diagonal (si no, el hueco parece vacío)
    const vidrio = new Mesh(new PlaneGeometry(HU.x1 - HU.x0, HU.y1), new MeshBasicMaterial({
      map: tex(img.reflejo), transparent: true, opacity: 0.28, blending: AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    vidrio.position.set((HU.x0 + HU.x1) / 2, HU.y1 / 2, zV - 0.025);
    s.add(vidrio);
    cronometro('marco');
    await pausa();
    // el plano impreso, pegado con celo por dentro del fijo de la derecha y mirando a la calle. La luz de la tienda lo
    // atraviesa un poco (el papel se trasluce): un emisivo tenue y cálido.
    const planoTex = tex(img.plano);
    const papel = new Mesh(new PlaneGeometry(0.3, 0.42), new MeshStandardMaterial({
      map: planoTex, emissive: '#5A4630', emissiveIntensity: 0.35, roughness: 0.85,
    }));
    papel.position.set(xm + 0.32, 1.13, zV - 0.032);
    papel.rotation.z = 0.014;
    s.add(papel);
    cronometro('plano');
    await pausa();
    // el cartel de la puerta, colgado de un cordel: gira de «Cerrado» a «Abierto»
    const cMat = (c: HTMLCanvasElement) => new MeshStandardMaterial({ map: tex(c), roughness: 0.6 });
    const cGeo = new BoxGeometry(0.42, 0.184, 0.008);
    const borde = new MeshStandardMaterial({ color: '#E6E2D8', roughness: 0.6 });
    const placa = new Mesh(cGeo, [borde, borde, borde, borde, cMat(img.abierto), cMat(img.cerrado)]);
    placa.position.y = -0.2;
    placa.castShadow = true;
    const cordel = new Mesh(mergeGeometries([caja(-0.004, 0.004, -0.11, 0, -0.002, 0.002).rotateZ(0.6), caja(-0.004, 0.004, -0.11, 0, -0.002, 0.002).rotateZ(-0.6)])!, new MeshBasicMaterial({ color: '#2A2A2A' }));
    cordel.position.y = 0;
    this.cartel.add(placa, cordel);
    this.cartel.position.set(HU.x0 + 0.5, 1.82, zV - 0.08);
    s.add(this.cartel);

    cronometro('cartel');
    await pausa();
    // ─── madera: la misma veta para baldas y costados del mostrador, con su mapa de rugosidad (las vetas, más ásperas,
    // brillan menos con la luz de las lámparas) ───
    const mad = tex(img.madera);
    mad.wrapS = mad.wrapT = RepeatWrapping;
    const rug = tex(img.maderaRug, false);
    rug.wrapS = rug.wrapT = RepeatWrapping;
    const madera = new MeshStandardMaterial({ map: mad, roughnessMap: rug, roughness: 0.9, bumpMap: rug, bumpScale: 0.5 });
    // el mostrador: costados de madera, frente de tablillas (con la sombra del vuelo de la encimera pintada), encimera
    // con el barniz gastado delante y un zócalo oscuro
    const M = MOSTRADOR;
    const cuerpoM = new Mesh(uvCaja(caja(M.x0, M.x1, 0.06, 0.92, M.z0, M.z1), 0.9), madera);
    const frente = new Mesh(new PlaneGeometry(M.x1 - M.x0, 0.86), new MeshStandardMaterial({ map: tex(img.frente), roughness: 0.62 }));
    frente.position.set((M.x0 + M.x1) / 2, 0.49, M.z1 + 0.002);
    const encimera = new Mesh(caja(M.x0 - 0.03, M.x1 + 0.03, 0.92, 0.96, M.z0 - 0.04, M.z1 + 0.04), new MeshStandardMaterial({ map: tex(img.encimera), roughness: 0.48 }));
    const pie = new Mesh(caja(M.x0 + 0.02, M.x1 - 0.02, 0, 0.06, M.z0 + 0.02, M.z1 - 0.02), new MeshStandardMaterial({ color: '#2B1D12', roughness: 0.7 }));
    encimera.castShadow = cuerpoM.castShadow = true;
    encimera.receiveShadow = cuerpoM.receiveShadow = frente.receiveShadow = true;
    s.add(cuerpoM, frente, encimera, pie);
    cronometro('mostrador');
    await pausa();

    // la tableta del negocio (15 × 21 cm, la del cobro y las citas), de pie en su soporte sobre el mostrador y mirando a
    // la calle: con la persiana arriba se enciende con el WhatsApp de un cliente (ver aplicar())
    const mx = 1.32, mz = M.z1 + 0.14;
    const telefono = new Group();
    const carcasa = new Mesh(caja(-0.075, 0.075, 0, 0.21, -0.009, 0), new MeshStandardMaterial({ color: '#1B1D20', roughness: 0.32, metalness: 0.6 }));
    this.pantallaMovil = new MeshBasicMaterial({ map: tex(img.movil), color: PANTALLA_APAGADA.clone(), toneMapped: false });
    const pantallaM = new Mesh(new PlaneGeometry(0.136, 0.194), this.pantallaMovil);
    pantallaM.position.set(0, 0.105, 0.0006);
    telefono.add(carcasa, pantallaM);
    telefono.rotation.set(-0.3, -0.16, 0, 'YXZ');
    telefono.position.set(mx, 0.968, mz);
    const soporte = new Mesh(mergeGeometries([
      caja(mx - 0.06, mx + 0.06, 0.96, 0.968, mz - 0.1, mz + 0.02),
      caja(mx - 0.02, mx + 0.02, 0.96, 1.12, mz - 0.095, mz - 0.07),
    ])!, new MeshStandardMaterial({ color: '#A9ADB0', roughness: 0.4, metalness: 0.5 }));
    this.brilloMovil = new MeshBasicMaterial({
      color: '#CFEBDD', alphaMap: tex(img.blando, false), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, toneMapped: false,
    });
    const brillo = new Mesh(planoSuelo(mx, 0.9615, mz + 0.09, 0.42, 0.24), this.brilloMovil);
    s.add(telefono, soporte, brillo);
    cronometro('móvil');
    await pausa();

    // la estantería: baldas de madera con escuadras de hierro y, en ellas, botes, frascos, cajas y archivadores de
    // tamaño real (un bote de 12 cm, una caja de 15), cada uno con su etiqueta. Todo junto son pocas mallas: los
    // colores van por vértice, las etiquetas salen de un atlas, y cada objeto deja su sombra de contacto en la balda.
    const B = BALDAS;
    const tablas: BufferGeometry[] = [];
    const escuadras: BufferGeometry[] = [];
    const cuerpos: BufferGeometry[] = [];
    const etiq: BufferGeometry[] = [];
    const contactos: BufferGeometry[] = [planoSuelo(mx, 0.9612, mz - 0.035, 0.2, 0.18)];
    const aoBaldas: BufferGeometry[] = [];
    const etiqueta = (cx: number, cy: number, z: number, w: number, h: number) => {
      const g = new PlaneGeometry(w, h);
      const k = Math.floor(r() * 8), u0 = (k % 4) / 4, v0 = 0.5 - Math.floor(k / 4) / 2;
      const uv = g.getAttribute('uv') as BufferAttribute;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, u0 + uv.getX(i) * 0.25, v0 + uv.getY(i) * 0.5);
      return g.translate(cx, cy, z);
    };
    const de = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
    const vidrios = ['#7A4A2A', '#D9CDB4', '#6E7F6A', '#E9E4D8', '#5B6B7A'] as const;
    const tapones = ['#2F3A44', '#B8862F', '#1E2228', '#E9E4D8'] as const;
    const cartones = ['#C9A87A', '#E9E4D8', '#A6452F', '#2F3A44', '#D9CDB4', '#7D8F6A'] as const;
    const lomos = ['#2F3A44', '#7D4A3E', '#3C4A3A', '#B8862F', '#5B6B7A', '#1E2228'] as const;
    for (const y of B.ys) {
      tablas.push(uvCaja(caja(B.x0, B.x1, y - 0.028, y, fondo, fondo + 0.3), 0.9));
      for (const ex of [B.x0 + 0.12, B.x1 - 0.12]) {
        escuadras.push(caja(ex - 0.008, ex + 0.008, y - 0.2, y - 0.028, fondo, fondo + 0.012));
        escuadras.push(caja(ex - 0.008, ex + 0.008, y - 0.046, y - 0.028, fondo, fondo + 0.22));
      }
      aoBaldas.push(planoSuelo((B.x0 + B.x1) / 2, y + 0.0012, fondo + 0.05, B.x1 - B.x0, 0.1));
      const arriba = y === B.ys[B.ys.length - 1];
      const tope = B.x1 - 0.06;
      let x = arriba ? B.x0 + 0.3 : B.x0 + 0.03;
      while (x < tope) {
        const t = r();
        let w: number;
        if (t < 0.28) {
          // bote de boca ancha con tapa de rosca
          const rr = 0.032 + r() * 0.012, h = 0.09 + r() * 0.05, cx = x + rr, cz = fondo + 0.15;
          w = rr * 2;
          cuerpos.push(colorear(new CylinderGeometry(rr, rr, h, 16).translate(cx, y + h / 2, cz), de(vidrios)));
          cuerpos.push(colorear(new CylinderGeometry(rr * 1.04, rr * 1.04, 0.022, 16).translate(cx, y + h + 0.011, cz), de(tapones)));
          etiq.push(etiqueta(cx, y + h * 0.45, cz + rr + 0.0015, rr * 1.35, h * 0.5));
          contactos.push(planoSuelo(cx, y + 0.001, cz, w * 1.8, w * 1.6));
        } else if (t < 0.5) {
          // frasco: cuerpo, hombro y tapón
          const rr = 0.025 + r() * 0.008, h = 0.13 + r() * 0.06, cx = x + rr, cz = fondo + 0.15, col = de(vidrios);
          w = rr * 2;
          cuerpos.push(colorear(new CylinderGeometry(rr, rr, h, 14).translate(cx, y + h / 2, cz), col));
          cuerpos.push(colorear(new CylinderGeometry(rr * 0.38, rr, 0.032, 14).translate(cx, y + h + 0.016, cz), col));
          cuerpos.push(colorear(new CylinderGeometry(rr * 0.36, rr * 0.36, 0.03, 10).translate(cx, y + h + 0.047, cz), de(tapones)));
          etiq.push(etiqueta(cx, y + h * 0.5, cz + rr + 0.0015, rr * 1.3, h * 0.45));
          contactos.push(planoSuelo(cx, y + 0.001, cz, w * 1.9, w * 1.7));
        } else if (t < 0.78) {
          // caja de cartón con su etiqueta (y a veces otra más pequeña encima)
          w = 0.09 + r() * 0.08;
          const h = 0.07 + r() * 0.12, d = 0.12 + r() * 0.1, z1 = fondo + 0.03 + d;
          cuerpos.push(colorear(caja(x, x + w, y, y + h, fondo + 0.03, z1), de(cartones)));
          etiq.push(etiqueta(x + w / 2, y + h * 0.5, z1 + 0.0015, w * 0.72, h * 0.62));
          contactos.push(planoSuelo(x + w / 2, y + 0.001, fondo + 0.03 + d / 2, w * 1.35, d * 1.3));
          if (h < 0.13 && r() < 0.5) {
            const w2 = w * 0.8, h2 = 0.05 + r() * 0.05;
            cuerpos.push(colorear(caja(x + 0.01, x + 0.01 + w2, y + h, y + h + h2, fondo + 0.04, z1 - 0.02), de(cartones)));
          }
        } else {
          // archivadores y libros: de dos a cuatro lomos juntos
          const k = 2 + Math.floor(r() * 3);
          w = 0;
          for (let i = 0; i < k; i++) {
            const lw = 0.03 + r() * 0.025, h = 0.2 + r() * 0.06;
            cuerpos.push(colorear(caja(x + w, x + w + lw, y, y + h, fondo + 0.04, fondo + 0.26), de(lomos)));
            w += lw + 0.002;
          }
          contactos.push(planoSuelo(x + w / 2, y + 0.001, fondo + 0.15, w * 1.3, 0.3));
        }
        x += w + 0.025 + r() * 0.035;
      }
    }
    cronometro('baldas: piezas');
    await pausa();
    const mTablas = new Mesh(mergeGeometries(tablas)!, madera);
    mTablas.receiveShadow = true;
    const mEscuadras = new Mesh(mergeGeometries(escuadras)!, hierro);
    const productos = new Mesh(mergeGeometries(cuerpos)!, new MeshStandardMaterial({ vertexColors: true, roughness: 0.42 }));
    productos.receiveShadow = true;
    cronometro('baldas: productos');
    await pausa();
    const mEtiq = new Mesh(mergeGeometries(etiq)!, new MeshStandardMaterial({ map: tex(img.etiquetas), roughness: 0.65 }));
    // oclusión falsa: el óvalo blando bajo cada objeto y la franja donde la balda toca la pared
    const sombraMat = (mapa: HTMLCanvasElement, opacidad: number) => new MeshBasicMaterial({
      color: '#000', alphaMap: tex(mapa, false), transparent: true, opacity: opacidad, depthWrite: false, toneMapped: false,
      polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
    });
    const mContactos = new Mesh(mergeGeometries(contactos)!, sombraMat(img.blando, 0.62));
    const mAo = new Mesh(mergeGeometries(aoBaldas)!, sombraMat(img.degradado, 0.5));
    s.add(mTablas, mEscuadras, productos, mEtiq, mContactos, mAo);
    // una planta en la balda de arriba
    const planta = maceta(r);
    planta.scale.setScalar(0.85);
    planta.position.set(B.x0 + 0.14, B.ys[B.ys.length - 1], fondo + 0.15);
    s.add(planta);
    cronometro('baldas');
    await pausa();
    // lámparas colgantes: una sobre la estantería y otra sobre el mostrador
    const pantallaL = new MeshStandardMaterial({ color: '#2B2B2B', metalness: 0.5, roughness: 0.4, side: DoubleSide });
    const bombilla = new MeshStandardMaterial({ color: '#000', emissive: '#FFD9A0', emissiveIntensity: 3 });
    for (const [x, z] of [[LAMP_X, -1.4], [LAMPARA_MOSTRADOR.x, LAMPARA_MOSTRADOR.z]] as const) {
      const pl = new Mesh(new CylinderGeometry(0.07, 0.2, 0.16, 20, 1, true), pantallaL);
      pl.position.set(x, 2.5, z);
      const bo = new Mesh(new IcosahedronGeometry(0.045, 2), bombilla);
      bo.position.set(x, 2.44, z);
      const cable = new Mesh(new CylinderGeometry(0.004, 0.004, 0.5), pantallaL);
      cable.position.set(x, 2.83, z);
      s.add(pl, bo, cable);
    }
    cronometro('lamparas');
    await pausa();
    // la pantalla del fondo: marco fino, la web (sin luces ni tono de cámara: brilla como una pantalla de verdad) y el
    // cristal, que suma encima un reflejo tenue de la calle
    const marcoP = new Mesh(caja(-pantW / 2 - 0.022, pantW / 2 + 0.022, -pantH / 2 - 0.022, pantH / 2 + 0.03, -0.035, 0), new MeshStandardMaterial({ color: '#121314', roughness: 0.3, metalness: 0.5 }));
    marcoP.position.copy(pc);
    const pant = new Mesh(new PlaneGeometry(pantW, pantH), new MeshBasicMaterial({ map: tex(img.web), color: new Color(0.84, 0.84, 0.84), toneMapped: false }));
    pant.position.copy(pc).add(new Vector3(0, 0, 0.002));
    const cristalP = new Mesh(new PlaneGeometry(pantW, pantH), new MeshBasicMaterial({
      map: tex(img.reflejo), transparent: true, opacity: 0.6, blending: AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    cristalP.position.copy(pc).add(new Vector3(0, 0, 0.004));
    s.add(marcoP, pant, cristalP);
    cronometro("paso 8");
    await pausa();

    // ─── luces ───
    const hemi = new HemisphereLight('#A3B9D4', '#7A6D5E', 1.15);
    s.add(hemi);
    // luz de rebote de la fachada de enfrente, cálida y suave (sin sombras)
    const rebote = new DirectionalLight('#FFE7C9', 0.3);
    rebote.position.set(3, 2, 8);
    s.add(rebote);
    cronometro('hemi');
    await pausa();
    // el sol de la tarde, rasante desde la izquierda: marca la textura de la cal y la sombra de la reja
    this.sol = new DirectionalLight('#FFD3A1', 5.6);
    const dir = new Vector3(-0.62, 0.52, 0.58).normalize();
    this.sol.position.copy(dir.clone().multiplyScalar(40));
    this.sol.target.position.set(0, 0, 0);
    this.sol.castShadow = true;
    const sc = this.sol.shadow.camera;
    sc.left = -6; sc.right = 6; sc.top = 7; sc.bottom = -5; sc.near = 1; sc.far = 80;
    this.sol.shadow.mapSize.set(movil ? 1024 : 2048, movil ? 1024 : 2048);
    this.sol.shadow.bias = -0.0004;
    this.sol.shadow.normalBias = 0.02;
    this.sol.shadow.radius = 3;
    this.sol.shadow.autoUpdate = false;
    this.sol.shadow.needsUpdate = true;
    s.add(this.sol, this.sol.target);
    cronometro('sol');
    await pausa();
    // la casa de enfrente: no se ve (queda detrás de la cámara), pero su sombra cubre la tienda. Su alero de tejas
    // deja en la pared el borde dentado de la sombra.
    const enfrente: BufferGeometry[] = [];
    const t = 14.5 / dir.z;           // del muro (z = 0) al plano de la casa de enfrente (z = 14.5)
    const corteX = -0.95 + dir.x * t;  // borde vertical de su sombra en x = -0.95
    const corteY = 4.35 + dir.y * t;   // y el alero, a 4,35 m
    enfrente.push(caja(corteX, corteX + 40, -10, corteY, 14.5, 14.8));
    for (let x = corteX; x < corteX + 16; x += 0.26) enfrente.push(caja(x, x + 0.16, corteY, corteY + 0.09, 14.5, 14.8));
    const casa = new Mesh(mergeGeometries(enfrente)!, new MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
    casa.castShadow = true;
    s.add(casa);
    cronometro('casa');
    await pausa();
    // el interior: una luz cálida general y un foco con sombra que sale por debajo de la persiana a la acera
    this.interior = new PointLight('#FFC584', 4.5, 3.0, 2);
    this.interior.position.set(HU.x0 + 0.45, 2.2, -1.5);
    // la lámpara del mostrador, y un relleno bajo y cálido: el rebote de la luz en el suelo y en la madera, que quita la
    // dureza de las sombras de dentro y se derrama por la puerta a la acera
    const mostradorLuz = new PointLight('#FFD29A', 2.2, 2.6, 2);
    mostradorLuz.position.set(LAMPARA_MOSTRADOR.x, 2.3, LAMPARA_MOSTRADOR.z);
    const reboteInterior = new PointLight('#FFB373', 0.8, 3.6, 2);
    reboteInterior.position.set((HU.x0 + HU.x1) / 2, 0.9, -1.1);
    s.add(mostradorLuz, reboteInterior);
    s.add(this.interior);
    this.foco = new SpotLight('#FFC27A', 80, 10, 0.95, 0.75, 1.5);
    this.foco.position.set((HU.x0 + HU.x1) / 2, 2.6, -2.9);
    this.foco.target.position.set((HU.x0 + HU.x1) / 2, -0.4, 1.6);
    this.foco.castShadow = true;
    this.foco.shadow.mapSize.set(movil ? 512 : 1024, movil ? 512 : 1024);
    this.foco.shadow.bias = -0.0008;
    this.foco.shadow.radius = 4;
    this.foco.shadow.camera.near = 0.3;
    this.foco.shadow.autoUpdate = false;
    this.foco.shadow.needsUpdate = true;
    s.add(this.foco, this.foco.target);
    const amb = new AmbientLight('#FFE2BC', 0.08);
    s.add(amb);

    cronometro('luces');
    this.aplicar(0);
    await this.compilarPorPartes();
    cronometro('compilar');
    // Dos fotogramas de ensayo recortados a 1×1 px (el lienzo aún es invisible), cada uno en su tarea: calculan el mapa
    // de sombras del sol y el del foco del interior, y compilan el programa de profundidad. Sin ellos, el primer
    // fotograma de verdad era una tarea de ~330 ms en un móvil lento. OJO: no vale pintarlos en un WebGLRenderTarget:
    // ahí three no aplica el tone mapping ni la conversión de color, los programas son otros y se volvían a compilar
    // todos (3 s de bloqueo).
    if (!this.op.poster) {
      const sombras = [this.sol.shadow, this.foco.shadow];
      this.renderer.setScissor(0, 0, 1, 1);
      for (const s of sombras) {
        await pausa();
        for (const o of sombras) o.needsUpdate = o === s;
        this.renderer.setScissorTest(true);
        this.renderer.render(this.scene, this.camara);
        this.renderer.setScissorTest(false);
        cronometro('sombras');
      }
      await pausa();
    }
  }

  /**
   * Sube las texturas y compila los programas de sombreado de uno en uno, cediendo el hilo entre ellos: todo a la vez
   * es una tarea larga de cientos de ms en Windows (ANGLE sobre D3D11) y en móviles.
   */
  private async compilarPorPartes() {
    const mallas: Mesh[] = [];
    this.scene.traverse((o) => { if ((o as Mesh).isMesh) mallas.push(o as Mesh); });
    // primero las texturas a la GPU, de una en una (cada canvas grande es una subida de varios ms)
    const texturas = new Set<Texture>();
    for (const m of mallas) for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
      for (const v of Object.values(mat)) if (v instanceof Texture) texturas.add(v);
    }
    for (const t of texturas) { this.renderer.initTexture(t); cronometro(`subida ${(t.image as HTMLCanvasElement).width}×${(t.image as HTMLCanvasElement).height}`); await pausa(); }
    cronometro('texturas');
    // Después, cada material nuevo en su propia tarea: compile(objeto, cámara, escena) prepara solo los materiales de
    // `objeto` (con las luces de la escena) y espera a que el programa esté listo sin bloquear (KHR_parallel_shader_compile).
    // OJO: compile(escena) recorre la escena entera aunque haya mallas ocultas (usa traverse, no traverseVisible): así se
    // compilaba todo de golpe, en una tarea de ~450 ms en escritorio.
    const primeras: Mesh[] = [];
    const vistos = new Set<Material>();
    for (const m of mallas) {
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      if (mats.every((x) => vistos.has(x))) continue;
      mats.forEach((x) => vistos.add(x));
      primeras.push(m);
      await this.renderer.compileAsync(m, this.camara, this.scene);
      cronometro(`programa ${m.geometry.type}`);
      await pausa();
    }
    // Y luego se pinta cada una de esas mallas sola, recortada a 1 px (el lienzo aún es invisible): el primer uso de un
    // programa lee sus uniformes de la GPU (consultas síncronas) y, si se dejaba para el primer fotograma, todas juntas
    // eran otra tarea larga. Antes, un ensayo sin mallas solo para crear los mapas de sombras (sin ellos, el muestreador
    // de sombras apunta a una textura de otro tipo y WebGL protesta: GL_INVALID_OPERATION). Las sombras de verdad se
    // calculan después, en los ensayos de construir().
    const estado = mallas.map((m) => [m.visible, m.frustumCulled] as const);
    const ensayo = (sola: Mesh | null) => {
      for (const o of mallas) { o.visible = o === sola; o.frustumCulled = false; }
      this.renderer.setScissor(0, 0, 1, 1);
      this.renderer.setScissorTest(true);
      this.renderer.render(this.scene, this.camara);
      this.renderer.setScissorTest(false);
      mallas.forEach((o, i) => { [o.visible, o.frustumCulled] = estado[i]; });
    };
    ensayo(null);
    for (const m of primeras) {
      ensayo(m);
      await pausa();
    }
    cronometro('primer uso de los programas');
  }

  /** Coloca la persiana, la cámara y el cartel según el estado actual. */
  private aplicar(dt: number) {
    const a = this.abierto;
    // la persiana sube y se esconde tras el dintel (deja la barra de abajo a la vista, como las de verdad)
    this.persiana.position.y = a * (HU.y1 - 0.09);
    // la cámara se acerca a la tienda en la segunda mitad de la subida
    const k = MathUtils.smootherstep(a, INTRO, 1);
    const pose = POSES[this.encuadre];
    const pos = pose.a.pos.clone().lerp(pose.b.pos, k);
    const mira = pose.a.mira.clone().lerp(pose.b.mira, k);
    // el puntero mueve menos la cámara cuanto más cerca está (en B, el azulejo queda justo fuera del encuadre)
    pos.x += this.punteroSuave.x * 0.18 * (1 - 0.6 * k);
    pos.y += this.punteroSuave.y * 0.08;
    this.camara.position.copy(pos);
    this.camara.lookAt(mira);
    // el cartel: cuando la persiana pasa de 3/4, un muelle lo gira a «Abierto»; con el póster, ya girado
    const meta = a > 0.72 ? 0 : Math.PI;
    if (dt === 0) { this.giro = meta; this.vGiro = 0; } else {
      const acc = (meta - this.giro) * 38 - this.vGiro * 5.2;
      this.vGiro += acc * dt;
      this.giro += this.vGiro * dt;
    }
    this.cartel.rotation.y = this.giro;
    // el móvil del mostrador se enciende con el aviso cuando la persiana está casi arriba (y deja un brillo en la madera)
    const metaAviso = a > AVISO ? 1 : 0;
    this.avisoT = dt === 0 ? metaAviso : this.avisoT + (metaAviso - this.avisoT) * (1 - Math.exp(-dt * 6));
    this.pantallaMovil.color.lerpColors(PANTALLA_APAGADA, PANTALLA_ENCENDIDA, this.avisoT);
    this.brilloMovil.opacity = 0.3 * this.avisoT;
  }

  /** Proporción del lienzo: el encuadre se recorta como object-fit: cover sobre la proporción de referencia. */
  medir(w: number, h: number) {
    this.ancho = w;
    this.alto = h;
    const asp = w / h, ref = ASPECTOS[this.encuadre];
    this.camara.aspect = asp;
    this.camara.fov = asp >= ref ? MathUtils.radToDeg(2 * Math.atan(Math.tan(MathUtils.degToRad(FOV) / 2) * ref / asp)) : FOV;
    this.camara.updateProjectionMatrix();
    this.ajustarDpr();
    this.renderer.setSize(w, h, false);
    this.pedir();
  }

  /** Cambia de encuadre (al girar la tableta o cambiar el ancho de la ventana entre móvil y escritorio). */
  ponerEncuadre(e: Encuadre) {
    if (e === this.encuadre) return;
    this.encuadre = e;
    this.aplicar(0);
    this.medir(this.ancho, this.alto);
  }

  apuntar(x: number, y: number) {
    this.puntero.set(x, y);
    this.pedir();
  }

  /** Pinta una vez, ya (póster). */
  pintarYa(abierto: number) {
    this.abierto = this.objetivo = abierto;
    this.vAbierto = 0;
    this.aplicar(0);
    this.sol.shadow.needsUpdate = this.foco.shadow.needsUpdate = true;
    this.renderer.render(this.scene, this.camara);
  }

  /** Pide un fotograma; el bucle se apaga solo cuando todo ha llegado a su sitio. */
  pedir() {
    if (this.pidiendo || !this.activo || this.liberado) return;
    this.pidiendo = true;
    this.rafId = requestAnimationFrame(this.paso);
  }

  private paso = (t: number) => {
    this.pidiendo = false;
    if (this.liberado) return;
    const dt = this.ultimo ? Math.min((t - this.ultimo) / 1000, 1 / 20) : 1 / 60;
    this.ultimo = t;
    const antes = this.abierto;
    // La persiana como un muelle con masa: pesa (tarda en arrancar y en frenar) y no oscila a media altura
    // (amortiguamiento crítico). Cerca de arriba, la meta se pasa un poco del tope: llega con algo de velocidad, choca
    // con el tope (1), rebota un poco y asienta. Dos subpasos por fotograma, por estabilidad con dt grandes.
    const meta = this.objetivo + REBASE * MathUtils.smoothstep(this.objetivo, 0.86, 1);
    for (let i = 0; i < 2; i++) {
      const h = dt / 2;
      this.vAbierto += ((meta - this.abierto) * MUELLE - this.vAbierto * 2 * Math.sqrt(MUELLE)) * h;
      this.abierto += this.vAbierto * h;
      if (this.abierto > 1) { this.abierto = 1; if (this.vAbierto > 0) this.vAbierto *= -REBOTE; }
      if (this.abierto < 0) { this.abierto = 0; this.vAbierto = 0; }
    }
    const tope = meta >= 1 && this.abierto >= 0.9995;
    if ((tope || Math.abs(meta - this.abierto) < 0.0004) && Math.abs(this.vAbierto) < 0.02) {
      this.abierto = tope ? 1 : meta;
      this.vAbierto = 0;
    }
    this.punteroSuave.lerp(this.puntero, 1 - Math.exp(-dt * 3));
    this.aplicar(dt);
    if (this.abierto !== antes) this.foco.shadow.needsUpdate = true;
    if (this.onFrame) marca = performance.now();
    this.renderer.render(this.scene, this.camara);
    if (this.onFrame) cronometro('primer fotograma');
    this.onFrame?.();
    const quieto = this.vAbierto === 0
      && this.punteroSuave.distanceTo(this.puntero) < 0.002
      && Math.abs(this.vGiro) < 0.002 && Math.abs(this.giro - (this.abierto > 0.72 ? 0 : Math.PI)) < 0.002
      && Math.abs(this.avisoT - (this.abierto > AVISO ? 1 : 0)) < 0.002;
    if (!quieto) this.pedir(); else this.ultimo = 0;
  };

  /** Libera la GPU. Idempotente. Primero se recorre la escena y las sombras; el renderer se libera el último. */
  liberar() {
    if (this.liberado) return;
    this.liberado = true;
    this.activo = false;
    this.fin.abort();
    cancelAnimationFrame(this.rafId);
    this.pidiendo = false;
    this.scene.traverse((o: Object3D) => {
      const m = o as Mesh;
      if (m.geometry) m.geometry.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const mat of mats) {
        for (const v of Object.values(mat)) if (v instanceof Texture) v.dispose();
        mat.dispose();
      }
    });
    this.sol?.shadow.dispose();
    this.foco?.shadow.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
