import { lazy, Suspense, useState, type ComponentType, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';

export interface SceneCanvasMountProps<P extends object> {
    /** Dynamic import of the heavy R3F scene component, e.g. `() => import('./scenes/PrimitiveHeroScene')`. */
    loader: () => Promise<{ default: ComponentType<P> }>;
    /** Props forwarded to the lazy-loaded scene component once mounted. */
    sceneProps?: P;
    /** Fallback rendered while the scene chunk is loading. */
    fallback: ReactNode;
    /** Whether the host section is currently in the viewport — drives `frameloop`. */
    inView: boolean;
}

/**
 * Actually mounts `@react-three/fiber`'s `Canvas` plus the lazy-loaded scene.
 *
 * Split out from `SceneCanvas` so that the (large) `@react-three/fiber` /
 * `three` runtime is only pulled into a chunk that gets downloaded once this
 * module is dynamically imported by `SceneCanvas` — i.e. only after the host
 * section has entered the viewport and the user doesn't prefer reduced
 * motion. Pages that merely render `SceneCanvas` (e.g. `Product.tsx`) never
 * download `@react-three/fiber`/`three` unless this component actually
 * mounts.
 */
export function SceneCanvasMount<P extends object>({
    loader,
    sceneProps,
    fallback,
    inView,
}: SceneCanvasMountProps<P>) {
    // Created once per mounted instance; `lazy()` itself doesn't trigger the
    // dynamic import — that only happens when the resulting component is
    // actually rendered, which happens immediately here since this whole
    // module only loads once the parent has decided to show the canvas.
    const [Scene] = useState(() => lazy(loader));

    return (
        <Suspense fallback={fallback}>
            <Canvas
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
                frameloop={inView ? 'always' : 'never'}
            >
                <Scene {...(sceneProps as P)} />
            </Canvas>
        </Suspense>
    );
}

export default SceneCanvasMount;
