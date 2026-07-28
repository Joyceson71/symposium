'use client';

import dynamic from 'next/dynamic';
import Button from '../ui/Button';
import TextScramble from '../ui/TextScramble';

const HeroScene = dynamic(() => import('../3d/HeroScene'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* 3D Background */}
      <HeroScene />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/50 to-ink z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-ember font-orbitron tracking-[0.2em] text-sm md:text-base mb-4 uppercase">
          <TextScramble text="Welcome to the Future" />
        </h2>
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-snow tracking-wider mb-6 drop-shadow-glow">
          TECHNO KINGS
        </h1>
        <p className="text-steel text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
          Experience the pinnacle of engineering innovation at our annual national-level ECE symposium. 
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <Button href="/register" className="w-full sm:w-auto">
            SECURE YOUR PASS
          </Button>
          <Button href="/events" className="w-full sm:w-auto !bg-transparent border border-ember !text-ember hover:!bg-ember/10">
            EXPLORE EVENTS
          </Button>
        </div>
      </div>
    </section>
  );
}
