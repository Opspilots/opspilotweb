import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type RefObject,
} from 'react';
import { useDragScroll } from './useDragScroll';

/**
 * Mecánica de los carruseles de casos, en un solo sitio.
 *
 * Antes esta lógica estaba escrita DOS VECES —`getScrollUnit`/`handleScroll`/
 * `scrollToIndex` en src/pages/Cases.tsx y `getCaseScrollUnit`/
 * `handleCaseScroll`/`scrollToCase` en src/pages/Home.tsx— con el mismo
 * cálculo copiado y renombrado. Lo caro no era la duplicación en sí, sino
 * que las dos copias DIVERGIERON: Home acabó teniendo navegación por teclado
 * (tabIndex + flechas) y /casos no, así que el mismo carrusel era accesible
 * en la portada e inaccesible en la página dedicada a los casos. Con el hook,
 * un arreglo de accesibilidad se hace una vez y llega a las dos páginas.
 *
 * Lo que NO entra aquí: nada de presentación. El contador `01/03` de /casos,
 * los puntos, las flechas y los textos son decisiones de cada página y se
 * quedan en cada página — unificar la mecánica no es uniformar la interfaz.
 *
 * Cómo mide: el track es un contenedor con `overflow-x: auto` y
 * `scroll-snap-type: x mandatory` donde cada diapositiva ocupa el 100% del
 * ancho, así que la unidad de scroll es `anchoDeLaPrimera + gap` leído del
 * CSS computado. Se lee en cada uso y no se cachea porque depende del
 * viewport y cambia al redimensionar; leerlo cuesta un reflow puntual, sólo
 * al soltar el scroll o al pulsar un control.
 */
export interface Carousel<T extends HTMLElement> {
    /** Diapositiva que ocupa el viewport del track ahora mismo (0-based). */
    index: number;
    /** El mismo ref que va en `trackProps`, expuesto suelto por si la página
     *  necesita medir o cablear algo más sobre el track. */
    trackRef: RefObject<T | null>;
    /** Lleva el track a la diapositiva `i`, recortada al rango válido. Es lo
     *  que consumen los puntos y las flechas de las dos páginas. */
    scrollTo: (index: number) => void;
    /** Props que HAY que esparcir en el elemento del track. Van juntas a
     *  propósito: `tabIndex` sin `onKeyDown` deja un elemento que recibe foco
     *  y no responde, y `onKeyDown` sin `tabIndex` no se dispara nunca. Que
     *  el hook las entregue como un bloque impide volver a dejarse una. */
    trackProps: {
        ref: RefObject<T | null>;
        /** Un `div` con `tabIndex` pero sin rol se expone como `generic`, y
         *  el spec de nombres accesibles PROHÍBE nombrar un `generic`: el
         *  `aria-label` que ya llevaban los dos tracks se estaba cayendo por
         *  el camino. `group` es el rol correcto aquí (un conjunto de
         *  elementos relacionados) y no `region`, que crearía un landmark
         *  por carrusel y ensuciaría la navegación por landmarks. */
        role: 'group';
        tabIndex: 0;
        onScroll: () => void;
        onKeyDown: (e: KeyboardEvent<T>) => void;
    };
}

export function useCarousel<T extends HTMLElement = HTMLDivElement>(
    count: number,
): Carousel<T> {
    const trackRef = useRef<T>(null);
    const [index, setIndex] = useState(0);
    const rafRef = useRef(0);

    // Arrastre con ratón. Los dos tracks anuncian `cursor: grab` en su CSS y
    // el scroll nativo por overflow no responde al arrastre del ratón, así
    // que sin esto el cursor sería una promesa falsa (ver useDragScroll).
    useDragScroll(trackRef);

    const clamp = useCallback(
        (i: number) => Math.max(0, Math.min(i, count - 1)),
        [count],
    );

    const getUnit = useCallback((): number => {
        const track = trackRef.current;
        if (!track) return 0;
        const slide = track.children[0] as HTMLElement | null;
        if (!slide) return 0;
        // 20px de reserva: si `gap` viniera como `normal` u otro valor no
        // parseable, un NaN propagaría a `scrollTo` y dejaría el carrusel
        // clavado en la primera diapositiva.
        const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
        return slide.offsetWidth + gap;
    }, []);

    // `scroll` dispara decenas de veces por gesto. Se colapsa a un frame con
    // rAF para no llamar a `setIndex` (y a `getComputedStyle`, que fuerza
    // reflow) en cada evento mientras el dedo o la rueda están en marcha.
    const handleScroll = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const track = trackRef.current;
            const unit = getUnit();
            if (!track || !unit) return;
            setIndex(clamp(Math.round(track.scrollLeft / unit)));
        });
    }, [clamp, getUnit]);

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    const scrollTo = useCallback(
        (i: number) => {
            const track = trackRef.current;
            const unit = getUnit();
            const target = clamp(i);
            if (track && unit) {
                track.scrollTo({ left: target * unit, behavior: 'smooth' });
            }
            // El índice se actualiza aunque el track todavía no esté medido:
            // los puntos y el contador reflejan la intención del usuario al
            // instante, y el `onScroll` posterior sólo lo confirma.
            setIndex(target);
        },
        [clamp, getUnit],
    );

    const onKeyDown = useCallback(
        (e: KeyboardEvent<T>) => {
            // Sólo flechas horizontales. El track es un contenedor con scroll
            // y el navegador ya las usa para desplazarlo, pero lo hace por
            // píxeles sueltos y rompería el snap a mitad de diapositiva: por
            // eso se intercepta con preventDefault y se avanza por unidades.
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollTo(index + 1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollTo(index - 1);
            }
        },
        [index, scrollTo],
    );

    return {
        index,
        trackRef,
        scrollTo,
        trackProps: {
            ref: trackRef,
            role: 'group',
            tabIndex: 0,
            onScroll: handleScroll,
            onKeyDown,
        },
    };
}
