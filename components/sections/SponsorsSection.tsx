'use client';

import React from 'react';
import TextScramble from '../ui/TextScramble';

export default function SponsorsSection() {
  return (
    <section className="relative w-full py-24 bg-ink overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-ember font-orbitron tracking-widest text-sm mb-4 uppercase">
          <TextScramble text="Alliances // Network" />
        </h2>
        <h3 className="font-display text-4xl text-snow mb-12">
          OUR SPONSORS
        </h3>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* // TODO: Add real sponsor logos here */}
          <div className="font-display text-2xl text-steel hover:text-white transition-colors">TechCorp</div>
          <div className="font-display text-2xl text-steel hover:text-white transition-colors">InnovateX</div>
          <div className="font-display text-2xl text-steel hover:text-white transition-colors">FutureSys</div>
          <div className="font-display text-2xl text-steel hover:text-white transition-colors">CyberDyne</div>
        </div>
      </div>
    </section>
  );
}
