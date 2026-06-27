import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';

        const onScroll = () => ScrollTrigger.update();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            document.documentElement.style.scrollBehavior = '';
            window.removeEventListener('scroll', onScroll);
        };
    }, []);
}
