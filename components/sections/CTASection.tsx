'use client';

import React from 'react';
import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section className="relative w-full py-32 bg-ember overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display text-5xl md:text-7xl text-black mb-6">
          READY TO UPLOAD YOUR CONSCIOUSNESS?
        </h2>
        <p className="text-black/80 font-medium text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Join hundreds of engineers from across the country. Secure your spot in the ultimate technical showdown.
        </p>
        
        <Button href="/register" className="!bg-black !text-snow hover:!bg-black/80 scale-110 shadow-2xl">
          INITIATE REGISTRATION
        </Button>
      </div>
    </section>
  );
}
