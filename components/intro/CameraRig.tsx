"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { type MutableRefObject } from "react";
import type { HoleState } from "./BlackHoleCanvas";

/**
 * Move a câmara real da cena (não apenas o backdrop em shader) para dar
 * profundidade genuína: dolly para a frente, "punch" de FOV na travessia
 * do portal (efeito hyperspace) e um roll muito subtil na aproximação.
 */
export default function CameraRig({ stateRef }: { stateRef: MutableRefObject<HoleState> }) {
  const { camera } = useThree();

  useFrame(() => {
    const s = stateRef.current;
    const P = s.progress;
    const pNear = THREE.MathUtils.smoothstep(P, 0.52, 0.76);
    const pEnter = THREE.MathUtils.smoothstep(P, 0.9, 1.0);

    const baseZ = THREE.MathUtils.lerp(8.5, 2.6, pNear);
    camera.position.z = baseZ - pEnter * pEnter * 3.6;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, s.mouse.x * 0.22, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, s.mouse.y * 0.14, 0.06);

    camera.lookAt(0, 0, -6);
    const roll =
      THREE.MathUtils.lerp(0, 0.045, pNear) +
      Math.sin(performance.now() * 0.0006) * 0.0035 * pNear;
    camera.rotateZ(roll);

    if (camera instanceof THREE.PerspectiveCamera) {
      const fov = THREE.MathUtils.lerp(40, 50, pNear) + pEnter * 26;
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
