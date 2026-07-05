import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type PrimitiveKind =
    | 'icosahedron'
    | 'octahedron'
    | 'dodecahedron'
    | 'sphere'
    | 'torus'
    | 'capsule';

export interface PrimitiveShapeConfig {
    /** Which low-poly/basic geometry to render for this shape. */
    kind: PrimitiveKind;
    /** Base position in scene units. */
    position: [number, number, number];
    /** Primary dimension — radius for polyhedra/sphere/capsule, outer radius for torus. */
    radius: number;
    /** Torus tube radius. Only used when `kind === 'torus'`; defaults to `radius * 0.05` (a thin ring). */
    tube?: number;
    /** Capsule body length. Only used when `kind === 'capsule'`; defaults to `radius * 1.6`. */
    length?: number;
    /** [x, y] idle spin speed in rad/s-ish (multiplied by `state.clock.elapsedTime`). */
    spinSpeed: [number, number];
    /** Gentle vertical bob — amplitude/speed/phase of a sine drift applied to position.y. Omit for a static (only-spinning) shape. */
    driftAmp?: number;
    driftSpeed?: number;
    phase?: number;
    /**
     * Render style:
     * - `'wireframe'` (default): faceted low-poly line mesh — the
     *   Soluciones/Resources/Cases look, via `meshStandardMaterial`.
     * - `'solid'`: flat, unlit translucent surface via `meshBasicMaterial` —
     *   used for Contact's thin signal ring (no facets to catch light).
     * - `'emissive'`: a small glowing core via `meshStandardMaterial` with
     *   `emissive` set — pair with `pulse` for a breathing beacon.
     */
    material?: 'wireframe' | 'solid' | 'emissive';
    /** Overrides the scene-level `color` for just this shape's accent (wireframe/solid tint, or emissive glow color for `'emissive'` shapes). E.g. Product's second, warm-toned primitive. */
    color?: string;
    /** Non-glowing surface color for `'emissive'` shapes only. Defaults to a near-black `'#050807'`, matching Contact's original beacon core. */
    baseColor?: string;
    /** Static opacity. Ignored for `'emissive'` shapes controlled by `pulse`. */
    opacity?: number;
    /** Breathing emissive pulse — only meaningful when `material === 'emissive'`. `emissiveIntensity` oscillates as `base + sin(t * frequency) * amplitude`. */
    pulse?: { base: number; amplitude: number; frequency: number };
}

export interface PrimitiveHeroSceneProps {
    /** Primary accent color for this page — drives the optional point light and any shape that doesn't set its own `color`. Hex string, e.g. '#39ce86'. */
    color: string;
    /** Composition of 1-2 primitives — deliberately restrained per page; no busier composition is justified since these headers have no scroll/pointer signal of their own. */
    shapes: PrimitiveShapeConfig[];
    /** Ambient light intensity. Defaults to 0.45 (the original Soluciones/Resources level). Contact uses a dimmer 0.3 for its more minimal "signal" read. */
    ambientIntensity?: number;
    /** Adds a single point light tinted `color`. Defaults to true; Contact sets this to `false` to stay closer to a flat, near-black mark. */
    pointLight?: boolean;
}

/**
 * Unified, parametrized hero background shared by Product, Soluciones,
 * Resources, Contact and Cases. Each page mounts this same component (via
 * `SceneCanvas`, scoped to its own `.pageHero` section only — never the full
 * page) with its own `color` + `shapes` composition, so the five pages read
 * as one coherent visual family (same wireframe/emissive language, same
 * mounting/sizing behavior, same restrained 1-2-primitive rule, same slow
 * ambient rotation) while still being visually distinct from one another.
 *
 * Replaces the two previously separate, structurally-duplicated components:
 * `SimpleOrbitScene` (was hard-coded to a mint icosahedron+octahedron pair,
 * shared verbatim by Soluciones and Resources — the reason those two pages
 * were visually indistinguishable) and `ContactBeaconScene` (a bespoke
 * torus+pulsing-sphere beacon). Both looks are now just `shapes` +
 * `material` combinations of this one component — Contact's beacon is a
 * `torus` (`material: 'solid'`) plus a `sphere` (`material: 'emissive'`,
 * `pulse` set).
 *
 * Purely ambient/time-based, matching both predecessors: the only input
 * driving motion is `state.clock.elapsedTime` inside `useFrame`. No pointer
 * tracking, no scroll coupling, no `setState` in the render loop.
 */
export default function PrimitiveHeroScene({
    color,
    shapes,
    ambientIntensity = 0.45,
    pointLight = true,
}: PrimitiveHeroSceneProps) {
    const groupRefs = useRef<Array<THREE.Group | null>>([]);
    const pulseMaterialRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        shapes.forEach((shape, i) => {
            const group = groupRefs.current[i];
            if (group) {
                group.rotation.x = t * shape.spinSpeed[0];
                group.rotation.y = t * shape.spinSpeed[1];
                if (shape.driftAmp) {
                    group.position.y =
                        shape.position[1] +
                        Math.sin(t * (shape.driftSpeed ?? 0.15) + (shape.phase ?? 0)) * shape.driftAmp;
                }
            }

            const pulseMaterial = pulseMaterialRefs.current[i];
            if (pulseMaterial && shape.pulse) {
                const { base, amplitude, frequency } = shape.pulse;
                pulseMaterial.emissiveIntensity = base + Math.sin(t * frequency) * amplitude;
            }
        });
    });

    return (
        <>
            <ambientLight intensity={ambientIntensity} />
            {pointLight && (
                <pointLight position={[0, 1.5, 3]} intensity={3.5} color={color} distance={9} decay={2} />
            )}
            {shapes.map((shape, i) => {
                const shapeColor = shape.color ?? color;
                const material = shape.material ?? 'wireframe';

                return (
                    <group
                        key={shape.kind + i}
                        position={shape.position}
                        ref={(el) => {
                            groupRefs.current[i] = el;
                        }}
                    >
                        <mesh>
                            {shape.kind === 'icosahedron' && <icosahedronGeometry args={[shape.radius, 0]} />}
                            {shape.kind === 'octahedron' && <octahedronGeometry args={[shape.radius, 0]} />}
                            {shape.kind === 'dodecahedron' && <dodecahedronGeometry args={[shape.radius, 0]} />}
                            {shape.kind === 'sphere' && <sphereGeometry args={[shape.radius, 16, 16]} />}
                            {shape.kind === 'torus' && (
                                <torusGeometry args={[shape.radius, shape.tube ?? shape.radius * 0.05, 16, 96]} />
                            )}
                            {shape.kind === 'capsule' && (
                                <capsuleGeometry args={[shape.radius, shape.length ?? shape.radius * 1.6, 8, 16]} />
                            )}

                            {material === 'emissive' && (
                                <meshStandardMaterial
                                    ref={(el) => {
                                        pulseMaterialRefs.current[i] = el;
                                    }}
                                    color={shape.baseColor ?? '#050807'}
                                    emissive={shapeColor}
                                    emissiveIntensity={shape.pulse?.base ?? 0.6}
                                    transparent
                                    opacity={shape.opacity ?? 0.85}
                                    toneMapped={false}
                                />
                            )}
                            {material === 'solid' && (
                                <meshBasicMaterial
                                    color={shapeColor}
                                    transparent
                                    opacity={shape.opacity ?? 0.22}
                                    toneMapped={false}
                                />
                            )}
                            {material === 'wireframe' && (
                                <meshStandardMaterial
                                    color={shapeColor}
                                    wireframe
                                    transparent
                                    opacity={shape.opacity ?? 0.45}
                                />
                            )}
                        </mesh>
                    </group>
                );
            })}
        </>
    );
}
