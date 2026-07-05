import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface CaseDeckSceneProps {
    /** Active card index of the Cases carousel (`currentIndex` state in
     * `Cases.tsx`), written to this ref from a one-line `useEffect` and read
     * here every frame (never via React state/props, so changing slides
     * never re-renders or re-mounts the Canvas). */
    activeIndexRef: MutableRefObject<number>;
}

const PLANE_COUNT = 3;
const PLANE_WIDTH = 1.6;
const PLANE_HEIGHT = 1.0;

// Single source of truth for this color is src/styles/variables.css
// (--color-mint) — kept in sync manually since THREE.Color objects can't
// read CSS custom properties directly.
const COLOR_MINT = new THREE.Color('#39ce86');

// Base, "at rest" transform per plane: stacked with a slight Z offset and a
// gentle X rotation/Y offset, evoking loosely fanned case files in
// perspective. Index 0 is nearest by default.
const BASE_TRANSFORMS = [
    { z: 0, y: 0, x: 0, rotX: -0.06, rotZ: 0.02 },
    { z: -0.32, y: -0.08, x: 0.22, rotX: -0.1, rotZ: -0.015 },
    { z: -0.64, y: -0.16, x: -0.18, rotX: -0.14, rotZ: 0.03 },
];

/**
 * Decorative background for the Cases carousel: three translucent planes
 * stacked with a Z offset, evoking case files in perspective. Purely
 * reactive to `activeIndexRef` (the carousel's existing `currentIndex`,
 * never read/written here beyond this ref) — the plane matching the active
 * index eases toward the front (closer Z, higher opacity), the others ease
 * back. All motion is ref-driven inside `useFrame`, never `setState`.
 */
export default function CaseDeckScene({ activeIndexRef }: CaseDeckSceneProps) {
    const groupRef = useRef<THREE.Group>(null);
    const planeRefs = useRef<Array<THREE.Mesh | null>>([]);
    const materialRefs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
    const frontWeights = useRef<number[]>(new Array(PLANE_COUNT).fill(0));

    useFrame((state, delta) => {
        const activeIndex = THREE.MathUtils.clamp(
            Math.round(activeIndexRef.current),
            0,
            PLANE_COUNT - 1
        );

        const group = groupRef.current;
        if (group) {
            // Slow always-on idle sway, independent of the carousel state.
            group.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.05;
        }

        for (let i = 0; i < PLANE_COUNT; i++) {
            const base = BASE_TRANSFORMS[i];
            const target = i === activeIndex ? 1 : 0;
            frontWeights.current[i] = THREE.MathUtils.damp(frontWeights.current[i], target, 4, delta);
            const weight = frontWeights.current[i];

            const mesh = planeRefs.current[i];
            if (mesh) {
                mesh.position.z = THREE.MathUtils.lerp(base.z, 0.28, weight);
                mesh.position.x = THREE.MathUtils.lerp(base.x, 0, weight);
                mesh.position.y = THREE.MathUtils.lerp(base.y, 0.04, weight);
                mesh.rotation.x = THREE.MathUtils.lerp(base.rotX, -0.02, weight);
                mesh.rotation.z = THREE.MathUtils.lerp(base.rotZ, 0, weight);
            }

            const material = materialRefs.current[i];
            if (material) {
                material.opacity = THREE.MathUtils.lerp(0.08, 0.16, weight);
            }
        }
    });

    return (
        <group ref={groupRef}>
            {BASE_TRANSFORMS.map((base, i) => (
                <mesh
                    key={i}
                    position={[base.x, base.y, base.z]}
                    rotation={[base.rotX, 0, base.rotZ]}
                    ref={(el) => {
                        planeRefs.current[i] = el;
                    }}
                >
                    <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
                    <meshBasicMaterial
                        ref={(el) => {
                            materialRefs.current[i] = el;
                        }}
                        color={COLOR_MINT}
                        transparent
                        opacity={0.1}
                        side={THREE.DoubleSide}
                        toneMapped={false}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}
