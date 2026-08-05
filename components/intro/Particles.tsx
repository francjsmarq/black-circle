"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { HoleState } from "./BlackHoleCanvas";

type Props = {
  stateRef: MutableRefObject<HoleState>;
  quality: number;
};

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  varying float vSeed;
  varying float vFade;
  void main() {
    vSeed = aSeed;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = -mvPosition.z;
    vFade = smoothstep(0.2, 1.8, dist) * (1.0 - smoothstep(20.0, 32.0, dist));
    gl_PointSize = aSize * (58.0 / max(dist, 0.6));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying float vSeed;
  varying float vFade;
  uniform float uTime;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= alpha;
    float tw = 0.7 + 0.3 * sin(uTime * (0.8 + vSeed * 2.0) + vSeed * 60.0);
    vec3 silver = vec3(0.85, 0.86, 0.9);
    vec3 champagne = vec3(0.74, 0.63, 0.45);
    vec3 col = mix(silver, champagne, step(0.72, vSeed));
    gl_FragColor = vec4(col, alpha * tw * vFade * 0.9);
  }
`;

/** Poeira/detritos reais em 3D — a câmara voa por dentro deste campo. */
export default function Particles({ stateRef, quality }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  const count = quality > 0.5 ? 2600 : 1100;

  const { positions, sizes, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 0.6 + Math.random() * 5.4;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.68; // achatado, "disco" de poeira
      positions[i * 3 + 2] = -Math.random() * 34 - 1;
      sizes[i] = 0.4 + Math.random() * 1.6;
      seeds[i] = Math.random();
    }
    return { positions, sizes, seeds };
  }, [count]);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
    const points = pointsRef.current;
    if (!points) return;

    const s = stateRef.current;
    const P = s.progress;
    const pNear = THREE.MathUtils.smoothstep(P, 0.52, 0.76);
    const pEnter = THREE.MathUtils.smoothstep(P, 0.9, 1.0);
    const speed = delta * (0.55 + pNear * 3.4 + pEnter * 15.0);

    const pos = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 2;
      arr[idx] += speed;
      if (arr[idx] > 2.6) arr[idx] -= 36;
    }
    pos.needsUpdate = true;
    points.rotation.z += delta * 0.012 * (1 + pNear);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
