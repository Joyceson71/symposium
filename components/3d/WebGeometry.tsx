'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

export default function WebGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !meshRef.current) return;
    meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshStandardMaterial
        color="#04070b"
        wireframe
        emissive="#ff3b30"
        emissiveIntensity={0.5}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}
