'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';

function FloatingObject() {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          color="#04070b" 
          roughness={0.2} 
          metalness={0.8}
          wireframe
        />
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.OctahedronGeometry(1.5, 0)]} />
          <lineBasicMaterial attach="material" color="#ff3b30" linewidth={2} />
        </lineSegments>
      </mesh>
    </Float>
  );
}

export default function MiniScene() {
  const { ref, inView } = useInView({ threshold: 0 });

  return (
    <div ref={ref} className="w-full h-[400px]">
      <Canvas
        frameloop={inView ? 'always' : 'demand'}
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#ff3b30" />
          <FloatingObject />
        </Suspense>
      </Canvas>
    </div>
  );
}
