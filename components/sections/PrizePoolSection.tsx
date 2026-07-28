'use client';

import React from 'react';
import TextScramble from '../ui/TextScramble';

export default function PrizePoolSection() {
  return (
    <section className="relative w-full py-32 bg-black border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-ember/20 blur-[150px] -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-ember font-orbitron tracking-widest text-sm mb-4 uppercase">
          <TextScramble text="Rewards // Allocation" />
        </h2>
        <h3 className="font-display text-4xl md:text-6xl text-snow mb-16">
          MASSIVE PRIZE POOL
        </h3>
        
        <div className="flex justify-center mb-16">
          <div className="relative">
            <h4 className="font-display text-8xl md:text-9xl text-snow drop-shadow-glow">
              ₹50K<span className="text-ember">+</span>
            </h4>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-orbitron text-steel tracking-[0.3em] text-sm">
              TOTAL WORTH
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-8 border border-white/10 bg-ink/50 backdrop-blur rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <h5 className="font-display text-2xl text-snow mb-2">WINNER</h5>
            <div className="text-ember font-bold text-xl">₹25,000</div>
          </div>
          <div className="p-8 border border-ember/30 bg-ember/5 backdrop-blur rounded-xl shadow-[0_0_20px_rgba(255,59,48,0.15)] transform scale-105">
            <h5 className="font-display text-2xl text-snow mb-2">OVERALL CHAMPION</h5>
            <div className="text-ember font-bold text-xl">TROPHY + GOODIES</div>
          </div>
          <div className="p-8 border border-white/10 bg-ink/50 backdrop-blur rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <h5 className="font-display text-2xl text-snow mb-2">RUNNER UP</h5>
            <div className="text-ember font-bold text-xl">₹15,000</div>
          </div>
        </div>
        <p className="text-steel text-sm mt-8">
          *Prizes distributed across various technical and non-technical events.
        </p>
      </div>
    </section>
  );
}
