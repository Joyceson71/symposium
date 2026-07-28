'use client';

import { useState, useEffect } from 'react';
import TextScramble from '../ui/TextScramble';

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: March 15, 2026 (Example)
    const targetDate = new Date('2026-03-15T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <section className="relative w-full py-24 bg-black border-y border-white/5">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-ember font-orbitron tracking-widest text-sm mb-12 uppercase">
          <TextScramble text="System Initialization In..." />
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {timeBlocks.map((block) => (
            <div key={block.label} className="flex flex-col items-center">
              <div className="font-display text-5xl md:text-7xl text-snow mb-4 tracking-wider w-full bg-ink/50 py-6 rounded-lg border border-white/10 shadow-[0_0_15px_rgba(255,59,48,0.2)]">
                {String(block.value).padStart(2, '0')}
              </div>
              <div className="font-orbitron text-steel text-xs md:text-sm tracking-[0.3em]">
                {block.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
