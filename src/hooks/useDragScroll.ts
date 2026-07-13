import { useEffect, type RefObject } from 'react';

/**
 * Mouse drag-to-scroll for horizontal tracks that advertise `cursor: grab`.
 * Before this hook, the grab cursor was a false promise: native overflow
 * scrolling never responds to mouse dragging, so desktop users saw a grab
 * hand that did nothing.
 *
 * - Touch/pen input is ignored (native scrolling already handles it).
 * - scroll-snap and smooth scroll-behavior are suspended mid-drag so the
 *   track follows the pointer 1:1, and restored on release (snap settles).
 * - Clicks are suppressed only after an actual drag (>4px), so buttons and
 *   links inside the track keep working normally.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let startX = 0;
        let startScroll = 0;
        let dragging = false;
        let moved = false;

        const onPointerDown = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            dragging = true;
            moved = false;
            startX = e.clientX;
            startScroll = el.scrollLeft;
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            if (!moved && Math.abs(dx) > 4) {
                moved = true;
                el.style.scrollSnapType = 'none';
                el.style.scrollBehavior = 'auto';
                el.style.userSelect = 'none';
            }
            if (moved) el.scrollLeft = startScroll - dx;
        };

        const onPointerUp = () => {
            if (!dragging) return;
            dragging = false;
            if (moved) {
                el.style.scrollSnapType = '';
                el.style.scrollBehavior = '';
                el.style.userSelect = '';
            }
        };

        const onClickCapture = (e: MouseEvent) => {
            if (moved) {
                e.preventDefault();
                e.stopPropagation();
                moved = false;
            }
        };

        el.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        el.addEventListener('click', onClickCapture, true);

        return () => {
            el.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            el.removeEventListener('click', onClickCapture, true);
        };
    }, [ref]);
}
