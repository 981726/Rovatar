import { Component, Suspense, useEffect, useMemo, type ReactNode } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { LoadingManager } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";

import { resolveRbxCdnUrl } from "@/lib/rbx-cdn";
import type { Avatar3dPayload } from "@/lib/roblox.functions";

/**
 * The real (non-fake) 3D mesh Roblox generates for a user's avatar, loaded
 * client-side and rendered with three.js. Always used behind a toggle next
 * to the flat thumbnail — the flat image is the default/fallback so a slow
 * or failed 3D load never blocks the page (README error-state guidance).
 *
 * Uses three's own OrbitControls directly rather than @react-three/drei —
 * drei pulls in ~440kb gzipped for a single control helper, which isn't
 * worth it for one toggleable feature.
 */

function Controls({ target }: { target: [number, number, number] }) {
  const { camera, gl } = useThree();
  const controls = useMemo(() => new OrbitControlsImpl(camera, gl.domElement), [camera, gl]);

  useEffect(() => {
    controls.target.set(...target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2;
    controls.maxDistance = 60;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.update();
    return () => controls.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls]);

  useFrame(() => controls.update());

  return null;
}

function Model({ mesh }: { mesh: Avatar3dPayload }) {
  // The .mtl file references its texture files by content hash only, not
  // full URLs — each has to be resolved to the correct CDN shard the same
  // way the top-level obj/mtl URLs already were, but at load time.
  const manager = useMemo(() => {
    const m = new LoadingManager();
    m.setURLModifier((url) => {
      if (url.startsWith("http")) return url;
      const hash = url.split("/").pop() ?? url;
      return resolveRbxCdnUrl(hash);
    });
    return m;
  }, []);

  const materials = useLoader(MTLLoader, mesh.mtlUrl, (loader) => {
    loader.manager = manager;
  });
  const object = useLoader(OBJLoader, mesh.objUrl, (loader) => {
    materials.preload();
    // Roblox's avatar exports ship an alpha map that makes the whole mesh
    // transparent unless this is disabled.
    for (const key in materials.materials) {
      const mat = materials.materials[key] as unknown as { transparent: boolean };
      mat.transparent = false;
    }
    loader.setMaterials(materials);
    loader.manager = manager;
  });

  const center: [number, number, number] = [
    (mesh.aabb.min.x + mesh.aabb.max.x) / 2,
    (mesh.aabb.min.y + mesh.aabb.max.y) / 2,
    (mesh.aabb.min.z + mesh.aabb.max.z) / 2,
  ];

  return (
    <>
      <primitive object={object} />
      <Controls target={center} />
    </>
  );
}

class ViewerErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function Avatar3dViewer({
  mesh,
  fallback,
  onCanvasReady,
}: {
  mesh: Avatar3dPayload;
  /** Rendered instead if three.js fails to load/parse the mesh at runtime. */
  fallback: ReactNode;
  /** Hands back the raw <canvas> once mounted, e.g. for a PNG export button. */
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}) {
  return (
    <ViewerErrorBoundary fallback={fallback}>
      <Canvas
        camera={{
          position: [mesh.camera.position.x, mesh.camera.position.y, mesh.camera.position.z],
          fov: mesh.camera.fov,
        }}
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={(state) => onCanvasReady?.(state.gl.domElement)}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.6} />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />
        <Suspense fallback={null}>
          <Model mesh={mesh} />
        </Suspense>
      </Canvas>
    </ViewerErrorBoundary>
  );
}
