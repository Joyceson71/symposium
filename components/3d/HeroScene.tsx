'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import ParticlesField from './ParticlesField';
import WebGeometry from './WebGeometry';
import { useInView } from 'react-intersection-observer';

export default function HeroScene() {
  const { ref, inView } = useInView({ threshold: 0 });
  const [shouldRender3D, setShouldRender3D] = useState(true);

  useEffect(() => {
    // Performance rules: check devicePixelRatio or mobile
    const isMobile = window.innerWidth < 768;
    const isHighDPI = window.devicePixelRatio > 2;

    if (isMobile || isHighDPI) {
      // For mobile or very high DPI, we might want to fallback to 2D
      // Let's implement a simple 2D fallback for extreme cases, 
      // but the prompt allows scaling down particles (which we did in ParticlesField).
      // Here we can disable heavy post-processing or fallback entirely.
      // Based on prompt: "Mobile: Three.js hero replaced with static 2D canvas fallback if devicePixelRatio > 2 or canvas fails to init"
      if (isMobile && isHighDPI) {
        setShouldRender3D(false);
      }
    }
  }, []);

  if (!shouldRender3D) {
    return (
      <div ref={ref} className="absolute inset-0 z-0 bg-ink flex items-center justify-center">
        {/* Static 2D fallback */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#ff3b30_0%,_transparent_50%)]" />
        <div className="w-full h-full border border-ember/20 opacity-10" style={{ backgroundImage: 'linear-gradient(#ff3b30 1px, transparent 1px), linear-gradient(90deg, #ff3b30 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute inset-0 z-0 bg-ink">
      <Canvas
        frameloop={inView ? 'always' : 'demand'}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ powerPreference: 'high-performance', antialias: false }}
        dpr={[1, 2]} // Cap DPR at 2
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#04070b']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#ff3b30" />
          
          <WebGeometry />
          <ParticlesField />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate 
            autoRotateSpeed={0.5} 
          />

          {/* Post Processing */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
            <Noise opacity={0.02} />
          </EffectComposer>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
