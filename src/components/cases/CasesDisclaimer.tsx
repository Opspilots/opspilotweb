import React from 'react';
import { CASES } from '../../data';

/**
 * La letra pequeña de los casos de éxito, escrita UNA sola vez y CALCULADA a
 * partir de los casos que hay.
 *
 * ── De dónde viene ──
 * Antes vivía copiada en src/pages/Home.tsx y en src/pages/Cases.tsx, y las
 * dos copias habían divergido: la de /casos hablaba de "cifras
 * representativas" y de "métricas [que] ilustran resultados típicos", la de
 * la portada sólo de nombres y testimonios. Peor que la divergencia era el
 * fondo: NO HAY CIFRAS que advertir. Las stats numéricas de los casos se
 * eliminaron hace tiempo (ver `CaseShowcase` en src/data/types.ts, que
 * sustituyó a "las antiguas stats numéricas"), y src/data/cases.ts documenta
 * la regla con todas las letras: ni un porcentaje, ni una gráfica, ni un
 * contador. Aquello se arregló unificando el texto.
 *
 * ── Qué se arregla AHORA, que es un problema distinto y peor ──
 * El texto unificado decía «Cada caso resume varios proyectos del mismo
 * sector, no un cliente concreto». Era verdad de los 3 casos que había, y
 * dejó de serlo en el momento en que entró ObraFácil: un cliente real, con
 * nombre, con su tienda publicada y con un enlace que el visitante puede
 * pulsar. Aplicarle esa frase no es un exceso de prudencia — es afirmar que
 * algo comprobable es inventado, o sea la misma mentira que este proyecto
 * vino a quitar, sólo que del revés. Un descargo que niega tu única prueba
 * verificable te cuesta justo lo que valía la prueba.
 *
 * ── Cómo se resuelve, y por qué así ──
 * La condición de "composición" es una propiedad DEL CASO, no de la página,
 * así que vive en el caso: `client: { kind: 'composite' }` (ver
 * `ClientDisclosure` en src/data/types.ts). Este componente lee CASES y:
 *
 *   · si NINGÚN caso es compuesto, no renderiza nada — el día que los cuatro
 *     sean clientes reales, el descargo se apaga solo, sin que nadie tenga
 *     que acordarse de venir a borrarlo. Un aviso que sobrevive a su motivo
 *     es ruido que enseña a ignorar la letra pequeña;
 *   · si alguno lo es, delimita el alcance por una señal que el lector TIENE
 *     DELANTE: el nombre del cliente en la tarjeta. "Los casos que no llevan
 *     nombre" es verificable de un vistazo, mientras que "algunos de estos
 *     casos" obligaría a adivinar cuáles.
 *
 * Se descartó la alternativa evidente —pintar el aviso dentro de cada tarjeta
 * compuesta— porque multiplica por tres la letra pequeña en una superficie
 * donde sólo se ve una tarjeta a la vez, y porque el contraste entre los dos
 * tipos de caso se pierde si nunca se leen juntos: la frase de cierre ("los
 * que sí llevan nombre...") sólo funciona dicha una vez, sobre el conjunto.
 *
 * Lee CASES directamente en vez de recibirlo por prop porque sus dos únicos
 * consumidores —la portada y /casos— pintan EL MISMO carrusel con la lista
 * entera. Una prop abriría la puerta a llamarlo con un subconjunto y a que el
 * descargo describiera casos que no están en pantalla, que es el fallo que
 * este componente existe para evitar.
 *
 * `className` en vez de un CSS Module propio porque las dos páginas lo
 * pintan con tipografía y color distintos (`--font-size-xs` /
 * `--color-text-subtle` en /casos, `--font-size-sm` / `--color-text-muted`
 * en la portada): se unifica el TEXTO, no el aspecto.
 */
export const CasesDisclaimer: React.FC<{ className?: string }> = ({ className }) => {
    const hasComposite = CASES.some((c) => c.client?.kind === 'composite');

    if (!hasComposite) return null;

    return (
        <p className={className}>
            Los casos que no llevan nombre de cliente resumen varios proyectos
            del mismo sector, no un cliente concreto: omitimos nombres y datos
            identificativos por privacidad, y sus testimonios se publican
            anonimizados. Los que sí llevan nombre y enlace son ese cliente y
            ese proyecto, y se pueden comprobar.
        </p>
    );
};
