'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [text, setText] = useState('');
  const fullText = 'TECHNO KINGS 2K26';

  useEffect(() => {
    // Check if already visited in this session
    const hasVisited = sessionStorage.getItem('hasVisitedTK2k26');
    if (hasVisited) {
      setIsVisible(false);
      return;
    }
    
    // Typewriter effect
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    // Fade out after 2.5 seconds
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('hasVisitedTK2k26', 'true');
    }, 2500);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-ink transition-opacity duration-500">
      {/* Spider web drawing animation */}
      <svg
        className="absolute w-[80vmin] h-[80vmin] opacity-30 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path
          className="spider-web-path text-ember"
          d="M50 50 L50 0 M50 50 L100 20 M50 50 L100 80 M50 50 L50 100 M50 50 L0 80 M50 50 L0 20 M30 50 A 20 20 0 0 1 70 50 M15 50 A 35 35 0 0 1 85 50 M5 50 A 45 45 0 0 1 95 50 M30 50 A 20 20 0 0 0 70 50 M15 50 A 35 35 0 0 0 85 50 M5 50 A 45 45 0 0 0 95 50"
        />
      </svg>
      
      <div className="relative z-10 font-display text-4xl tracking-widest text-snow mb-8">
        {text}
        <span className="animate-pulse">_</span>
      </div>

      <div className="relative z-10 h-1 w-64 overflow-hidden rounded-full bg-steel/30">
        <div className="h-full bg-ember animate-[fillBar_2s_ease-in-out_forwards]" />
      </div>

      <style jsx>{`
        @keyframes fillBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
