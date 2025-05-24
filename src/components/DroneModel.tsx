// src/components/DroneModel.tsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const DroneGLB = () => {
  const { scene } = useGLTF("/models/drone.glb"); // path relative to /public
  return <primitive object={scene} scale={1.5} />;
};

const DroneModel = () => {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 5 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <Suspense fallback={null}>
          <DroneGLB />
        </Suspense>
        <OrbitControls
          minDistance={2}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={2.0}
        />
      </Canvas>
    </div>
  );
};

export default DroneModel;
