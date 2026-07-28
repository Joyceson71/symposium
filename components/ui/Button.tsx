'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export default function Button({ children, href, className = '', ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      // Proximity threshold of 60px
      if (distance < 60) {
        // Max displacement of 12px
        const x = (distanceX / 60) * 12;
        const y = (distanceY / 60) * 12;
        setPosition({ x, y });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (href) {
    return (
      <motion.a 
        href={href} 
        ref={ref as React.Ref<HTMLAnchorElement>}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        className={`relative overflow-hidden rounded bg-ember px-8 py-3 font-bold text-snow transition-colors hover:bg-ember/80 ${className}`}
        {...(props as any)}
      >
        <span className="relative z-10 block magnetic-btn-text">{children}</span>
      </motion.a>
    );
  }

  return (
    <motion.button 
      ref={ref as React.Ref<HTMLButtonElement>}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative overflow-hidden rounded bg-ember px-8 py-3 font-bold text-snow transition-colors hover:bg-ember/80 ${className}`}
      {...(props as any)}
    >
      <span className="relative z-10 block magnetic-btn-text">{children}</span>
    </motion.button>
  );
}
