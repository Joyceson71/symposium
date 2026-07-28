'use client';

import dynamic from 'next/dynamic';
import ParallaxLayer from '../ui/ParallaxLayer';
import TextScramble from '../ui/TextScramble';

const MiniScene = dynamic(() => import('../3d/MiniScene'), { ssr: false });

export default function AboutSection() {
  return (
    <section id="about" className="relative w-full py-32 bg-ink overflow-hidden">
      <ParallaxLayer speed={0.2} className="opacity-5">
        <div className="absolute top-1/4 -left-1/4 w-[1000px] h-[1000px] rounded-full bg-ember blur-[150px]" />
      </ParallaxLayer>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <h2 className="text-ember font-orbitron tracking-widest text-sm mb-4 uppercase">
            <TextScramble text="Data Log // About Us" />
          </h2>
          <h3 className="font-display text-4xl md:text-6xl text-snow mb-6">
            BEYOND THE CIRCUITS
          </h3>
          <div className="space-y-6 text-steel leading-relaxed">
            <p>
              TechnoKings-2k26 is the premier national-level technical symposium organized by the Department of Electronics and Communication Engineering. We bridge the gap between theoretical knowledge and practical innovation.
            </p>
            <p>
              Join us for a two-day tech extravaganza featuring cutting-edge competitions, expert workshops, and networking opportunities that will propel your engineering career into the future.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <div className="font-display text-4xl text-ember mb-2">15+</div>
              <div className="text-sm font-orbitron text-steel uppercase tracking-wider">Technical Events</div>
            </div>
            <div>
              <div className="font-display text-4xl text-ember mb-2">50k+</div>
              <div className="text-sm font-orbitron text-steel uppercase tracking-wider">Prize Pool</div>
            </div>
          </div>
        </div>
        
        <div className="relative border border-white/10 rounded-2xl bg-black/40 backdrop-blur p-2">
          <MiniScene />
        </div>
      </div>
    </section>
  );
}
