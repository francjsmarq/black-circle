"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "@/shaders/blackhole";
import { config } from "@/lib/config";
import CameraRig from "./CameraRig";
import Particles from "./Particles";

export type HoleState = {
  progress: number;
  mouse: { x: number; y: number };
};

type Props = {
  stateRef: MutableRefObject<HoleState>;
  quality: number;
  ambient?: boolean;
  onError?: () => void;
};

function FullscreenHole({
  stateRef,
  quality,
  ambient,
}: {
  stateRef: MutableRefObject<HoleState>;
  quality: number;
  ambient?: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, gl } = useThree();
  const smooth = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uQuality: { value: quality },
      uAmbient: { value: ambient ? 1 : 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const s = stateRef.current;
    m.uniforms.uTime.value += delta;
    m.uniforms.uProgress.value = s.progress;
    smooth.current.x += (s.mouse.x - smooth.current.x) * 0.06;
    smooth.current.y += (s.mouse.y - smooth.current.y) * 0.06;
    m.uniforms.uMouse.value.set(smooth.current.x, smooth.current.y);
    const dpr = gl.getPixelRatio();
    m.uniforms.uRes.value.set(size.width * dpr, size.height * dpr);
    m.uniforms.uQuality.value = quality;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Aberração cromática que reage à aproximação e à travessia — "câmara sob tensão". */
function EffectsRig({ stateRef }: { stateRef: MutableRefObject<HoleState> }) {
  const caRef = useRef<{ offset: THREE.Vector2 } | null>(null);

  useFrame(() => {
    const P = stateRef.current.progress;
    const pNear = THREE.MathUtils.smoothstep(P, 0.52, 0.76);
    const pEnter = THREE.MathUtils.smoothstep(P, 0.9, 1.0);
    const amt = 0.0006 + pNear * 0.0012 + pEnter * 0.0062;
    caRef.current?.offset.set(amt, amt * 0.6);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.34}
        mipmapBlur
        radius={0.68}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ChromaticAberration
        ref={caRef as any}
        offset={new THREE.Vector2(0.0006, 0.0004)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.15} darkness={0.82} />
      <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.04} premultiply />
    </EffectComposer>
  );
}

export default function BlackHoleCanvas({ stateRef, quality, ambient, onError }: Props) {
  const highQuality = quality > 0.5 && !ambient;

  return (
    <Canvas
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
      dpr={[1, config.performance.maxDpr]}
      camera={{ fov: 40, near: 0.1, far: 60, position: [0, 0, 8.5] }}
      frameloop="always"
      className="pointer-events-none"
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onError?.();
          },
          { once: true }
        );
      }}
      fallback={null}
      onError={() => onError?.()}
    >
      <FullscreenHole stateRef={stateRef} quality={quality} ambient={ambient} />
      {!ambient && (
        <>
          <CameraRig stateRef={stateRef} />
          <Particles stateRef={stateRef} quality={quality} />
        </>
      )}
      {highQuality && <EffectsRig stateRef={stateRef} />}
    </Canvas>
  );
}
