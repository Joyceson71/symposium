'use client';

import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  image?: string;
  className?: string;
}

export default function EventCard({ title, description, date, image, className = '' }: EventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineStyle, setShineStyle] = useState({ opacity: 0, x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate max ±10deg based on mouse position
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setShineStyle({ opacity: 1, x, y });
  };

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return;
    setRotateX(0);
    setRotateY(0);
    setShineStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative w-full h-80 rounded-xl bg-ink border border-white/10 overflow-hidden cursor-none ${className}`}
    >
      {/* 3D Content Container */}
      <div 
        className="absolute inset-0 p-6 flex flex-col justify-end"
        style={{ transform: 'translateZ(30px)' }}
      >
        <div className="bg-gradient-to-t from-black/80 to-transparent absolute inset-0 -z-10" />
        <h3 className="font-display text-2xl text-snow mb-2">{title}</h3>
        <p className="text-steel text-sm line-clamp-2 mb-4">{description}</p>
        <span className="text-ember text-xs font-bold tracking-widest">{date}</span>
      </div>

      {/* Specular Shine */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: shineStyle.opacity,
          background: `radial-gradient(circle 150px at ${shineStyle.x}px ${shineStyle.y}px, rgba(255,255,255,0.1), transparent)`,
        }}
      />
    </motion.div>
  );
}
