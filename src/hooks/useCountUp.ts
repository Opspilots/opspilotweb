import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CountUpOptions {
    end: number;
    duration?: number;
    format?: (n: number) => string;
}

export function useCountUp<T extends HTMLElement>({
    end,
    duration = 1.4,
    format = (n) => Math.round(n).toString(),
}: CountUpOptions) {
    const ref = useRef<T>(null);
    const played = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Already animated — set final value and bail
        if (played.current) {
            el.textContent = format(end);
            return;
        }

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            el.textContent = format(end);
            played.current = true;
            return;
        }

        const obj = { value: 0 };
        const tween = gsap.to(obj, {
            value: end,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
                el.textContent = format(obj.value);
            },
            paused: true,
        });

        const st = ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                played.current = true;
                tween.play();
            },
        });

        return () => {
            st.kill();
            tween.kill();
        };
    // format is intentionally omitted — it's a new function reference on every call
    // (default destructuring), so including it would restart the effect every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end, duration]);

    return ref;
}
