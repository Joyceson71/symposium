'use client';

import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

export default function ParticlesField({ count = 3000 }: { count?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  // Scale down particles for mobile as per rules
  const finalCount = isMobile ? Math.min(count, 800) : count;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(finalCount * 3);
    const scl = new Float32Array(finalCount);

    for (let i = 0; i < finalCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // z

      scl[i] = Math.random();
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scl, 1));
    return geo;
  }, [finalCount]);

  useFrame((state) => {
    if (shouldReduceMotion || !geometry) return;
    
    // Slow rotation
    const time = state.clock.getElapsedTime() * 0.05;
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < finalCount; i++) {
      const i3 = i * 3;
      // Gentle floating motion
      positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.01;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#ff3b30"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
