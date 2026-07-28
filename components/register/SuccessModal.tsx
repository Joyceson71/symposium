'use client';

import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import confetti from 'canvas-confetti';

export default function SuccessModal() {
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff3b30', '#ffffff', '#000000']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff3b30', '#ffffff', '#000000']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-ink border border-ember/30 rounded-2xl p-8 md:p-12 max-w-lg w-full text-center shadow-[0_0_50px_rgba(255,59,48,0.2)] animate-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-ember rounded-full blur-xl opacity-50" />
            <CheckCircle size={80} className="text-ember relative z-10" />
          </div>
        </div>
        
        <h2 className="font-display text-4xl text-snow mb-4">REGISTRATION SUCCESSFUL</h2>
        <p className="text-steel mb-8">
          Welcome to the future, Engineer. Your registration details have been received and verified. We will send you an email confirmation shortly.
        </p>
        
        <Button href="/" className="w-full">
          RETURN TO BASE
        </Button>
      </div>
    </div>
  );
}
