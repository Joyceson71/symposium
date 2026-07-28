'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sparkles } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function WebScene() {
  const groupRef = useRef<THREE.Group>(null!);
  const lines = useMemo(() => {
    const points: THREE.Vector3[][] = [];
    for (let i = 0; i < 10; i += 1) {
      const band = Array.from({ length: 24 }, (_, index) => {
        const angle = (index / 23) * Math.PI;
        const x = Math.cos(angle) * (1.4 + i * 0.08);
        const y = Math.sin(angle) * (1.5 - i * 0.09);
        return new THREE.Vector3(x, y, 0.1 * (i % 2));
      });
      points.push(band);
    }
    return points;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={index % 2 === 0 ? '#ff3b30' : '#ff7b72'}
          lineWidth={2}
          transparent
          opacity={0.85}
        />
      ))}
      <mesh position={[0, -1.7, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 16]} />
        <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={0.5} />
      </mesh>
      <Sparkles count={40} scale={3} size={3} color="#ff3b30" />
    </group>
  );
}

export default function SpiderScene() {
  return (
    <div className="h-[420px] w-full rounded-[1.5rem] bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 48 }}>
        <color attach="background" args={['#02040a']} />
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 3, 6]} intensity={10} color="#ff3b30" />
        <pointLight position={[-3, -2, 5]} intensity={6} color="#ffffff" />
        <WebScene />
        <OrbitControls autoRotate={true} autoRotateSpeed={0.15} enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
