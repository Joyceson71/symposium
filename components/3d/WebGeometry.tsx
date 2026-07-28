'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

export default function WebGeometry() {
  const meshRef = useRef<THREE.Group>(null);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !meshRef.current) return;
    // Dynamic swinging/rotating animation
    meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.5;
    meshRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.1) * 0.3;
    meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.2;
    
    // Pulse effect
    const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.02;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={meshRef}>
      <mesh scale={[1, 1, 0.1]}>
        {/* Sphere with specific segments looks like a spider web when wireframed and flattened */}
        <sphereGeometry args={[4, 16, 8]} />
        <meshStandardMaterial
          color="#000000"
          wireframe
          emissive="#ff3b30"
          emissiveIntensity={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Inner dense core */}
      <mesh scale={[0.5, 0.5, 0.05]}>
        <sphereGeometry args={[2, 12, 6]} />
        <meshStandardMaterial
          color="#ff3b30"
          wireframe
          emissive="#ff0000"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}
