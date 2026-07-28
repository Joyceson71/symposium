'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxLayer({ children, speed = 0.5, className = '' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleScroll = () => {
      if (!ref.current) return;
      // Calculate parallax offset based on scroll position
      const offset = window.scrollY * speed;
      ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, shouldReduceMotion]);

  return (
    <div className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}>
      <div ref={ref} className="w-full h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
